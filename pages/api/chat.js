import { Pinecone } from "@pinecone-database/pinecone";
import connectDb from "../../lib/mongoDb";
import Chat from "../../model/chat";
import { getServerSession } from "next-auth/next";
import { checkRateLimit } from "../../lib/ratelimit";
import { authOptions } from "./auth/[...nextauth]";
import dotenv from "dotenv"

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const INDEX_NAME = "indigenous-cultures";

const getGeminiEmbedding = async (text) => {
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: {
                        parts: [{ text: text }]
                    }
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(`Gemini API error: ${data.error?.message || JSON.stringify(data)}`);
        }

        if (data.embedding && data.embedding.values) {
            return data.embedding.values;
        }

        throw new Error(`No embedding returned from Gemini API.`);
    } catch (error) {
        console.error('Error getting embedding:', error);
        throw error;
    }
}

const queryPinecone = async (queryEmbedding) => {
    const pc = new Pinecone({
        apiKey: PINECONE_API_KEY
    });
    const index = pc.Index(INDEX_NAME);
    const results = await index.query({
        vector: queryEmbedding,
        topK: 10,
        includeMetadata: true
    })
    return results.matches.map(match => match.metadata.text);
}

const generateAnswerWithGemini = async (question, contextChunks, retries = 3) => {
    try {
        const context = contextChunks.join('\n')
        const prompt = `Use the following context to answer the question concisely:\n\nContext:\n${context}\n\nQuestion: ${question}\n\nAnswer:`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: prompt }] }],
                
            })
        });

        const data = await res.json();
        console.log('Gemini API Response:', JSON.stringify(data, null, 2));

        if (!res.ok) {
            console.error('API Error Response:', data);
            // If 503 error (overloaded) and retries remaining, wait and retry
            if (res.status === 503 && retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return generateAnswerWithGemini(question, contextChunks, retries - 1);
            }

            return `I apologize, but I encountered an error: ${data.error?.message || 'Unknown error'}. Please try again.`;
        }

        // Safely extract the response text
        if (data.candidates && Array.isArray(data.candidates) && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && Array.isArray(candidate.content.parts) && candidate.content.parts.length > 0) {
                const text = candidate.content.parts[0].text;
                if (text) {
                    return text;
                }
            }
        }

        console.log('No valid response structure found, full data:', data);
        return "No answer generated. Please try again.";

    } catch (error) {
        console.error('Error in generateAnswerWithGemini:', error);
        return `Error generating answer: ${error.message}`;
    }
}
const handleAnswer = async (req, res) => {
    const { question } = req.body;

    // Run session check and DB connection in parallel
    const [session] = await Promise.all([
        getServerSession(req, res, authOptions),
        connectDb()
    ]);

    if (!session) {
        return res.status(401).json({ error: "Unauthorized. Please sign in." });
    }

    const { email } = session.user;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const identifier = email || ip || "unknown";
    
    // Check rate limit
    try {
        const rl = await checkRateLimit(identifier);
        
        if (!rl.success) {
            return res.status(429).json({
                error: "Rate limit exceeded. Please wait before sending more requests.",
                limit: rl.limit,
                remaining: rl.remaining,
                reset: rl.reset,
            });
        }
    } catch (err) {
        console.error("Rate limit check error:", err);
    }

    // Get embedding and generate answer
    const queryEmbedding = await getGeminiEmbedding(question);
    const contextChunks = await queryPinecone(queryEmbedding);
    const answer = await generateAnswerWithGemini(question, contextChunks);

    // Save to database (don't await to send response faster)
    Chat.findOne({ userEmail: email }).then(chat => {
        if (!chat) {
            chat = new Chat({ userEmail: email, messages: [] });
        }
        chat.messages.push({ role: "user", content: question });
        chat.messages.push({ role: "bot", content: answer });
        return chat.save();
    }).catch(err => console.error('Error saving chat:', err));

    // Send response immediately without waiting for DB save
    res.status(200).json({ success: true, answer: answer });
}

export default handleAnswer;


