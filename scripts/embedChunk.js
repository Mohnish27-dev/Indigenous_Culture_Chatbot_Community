import fetch from "node-fetch"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"

dotenv.config();


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const getGeminiEmbedding = async (text) => {
    //make the chunks of the textFile received from the main function
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            content: { 
                parts: [{ text: text }] 
            } 
        })
    });
    const data = await response.json();
    
    if (data.error) {
        console.error('Gemini API Error:', data.error);
        return null;
    }
    
    return data.embedding?.values || null;
}

const main = async () => {
    const chunkFiles = fs.readdirSync('./data').filter(f => f.startsWith("chunks-")); //array of files from data folder.
    for (const file of chunkFiles) {
        const chunks = JSON.parse(fs.readFileSync(path.join('./data', file), 'utf-8')); //storing datafiles into chunk array format
        const embeddings = [];
        for (let i = 0; i < chunks.length; i++) {
            const embed = await getGeminiEmbedding(chunks[i]);
            if (!embed) {
                console.error(`Failed to get embedding for chunk ${i + 1} in ${file}`);
                continue;
            }
            embeddings.push({
                chunk: chunks[i],
                embedding: embed,
                metadata: { source: file, chunkIndex: i }
            })

            console.log(`Embedded chunk ${i + 1}/${chunks.length} for ${file}`)

            await new Promise(r => setTimeout(r, 300));
        }

        fs.writeFileSync(
            `./data/embed-${file.replace('chunks-', '')}`,
            JSON.stringify(embeddings, null, 2),
            'utf-8'
        );
        console.log(`Saved embeddings for ${file}`)
    }
}

main();