import connectDb from "../../lib/mongoDb";
import Chat from "../../model/chat";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req, res) => {
    // Get session on server side
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
        return res.status(401).json({ error: "Unauthorized. Please sign in." });
    }
    
    try {
        await connectDb();
        const { email } = session.user;
        
        const chatHistory = await Chat.findOne({ userEmail: email });
        
        return res.status(200).json({ 
            messages: chatHistory?.messages || [],
            userEmail: email 
        });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return res.status(500).json({ error: "Failed to fetch chat history" });
    }
}

export default handler;