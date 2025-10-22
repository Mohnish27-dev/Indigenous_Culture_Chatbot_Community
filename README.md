# 🌍 RAG Chatbot - Indigenous Cultures Knowledge Base

A sophisticated Retrieval-Augmented Generation (RAG) chatbot built with Next.js, powered by Google's Gemini AI and Pinecone vector database. This project provides an intelligent conversational interface to explore and learn about indigenous cultures, historical figures, and cultural heritage from around the world.

## ✨ Features

- 🤖 **AI-Powered Responses**: Utilizes Google Gemini 2.5 Flash for fast, contextual answers
- 🔍 **Vector Search**: Pinecone integration for semantic search across cultural knowledge base
- 🔐 **Multiple Authentication Methods**: 
  - Email/Password (Credentials)
  - Google OAuth
  - GitHub OAuth
  - Twitter OAuth
- 💬 **Chat History**: Persistent conversation storage in MongoDB
- 🎨 **Modern UI**: Beautiful tribal-themed interface with smooth animations using Framer Motion
- ⚡ **Rate Limiting**: Built-in rate limiting with Upstash Redis
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.5.4, React, TailwindCSS
- **Authentication**: NextAuth.js
- **AI/ML**: Google Gemini API (text-embedding-004, gemini-2.5-flash)
- **Vector Database**: Pinecone
- **Database**: MongoDB with Mongoose
- **Rate Limiting**: Upstash Redis
- **Animations**: Framer Motion
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

You'll also need API keys for:
- Google Gemini API
- Pinecone
- MongoDB connection string
- OAuth providers (Google, GitHub, Twitter - optional)
- Upstash Redis (for rate limiting)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mohnish27-dev/rag-chatbot.git
cd rag-chatbot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add the following:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/rag-chatbot

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key_here

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### 4. Set up the knowledge base

The project includes scripts to process and upload data to Pinecone:

```bash
# Chunk text documents
node scripts/chunkText.js

# Generate embeddings
node scripts/embedChunk.js

# Upload to Pinecone
node scripts/uploadToPinecone.js
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
rag-chatbot/
├── components/          # React components
│   ├── ChatBox.js      # Main chat interface
│   ├── MessageBubble.js # Individual message component
│   ├── Navbar.js       # Navigation bar
│   └── useAvtar.js     # Avatar utility
├── data/               # Knowledge base text files
├── lib/                # Utility functions
│   ├── gemini.js       # Gemini API integration
│   ├── mongoDb.js      # MongoDB connection
│   ├── pinecone.js     # Pinecone client
│   └── ratelimit.js    # Rate limiting logic
├── model/              # Database models
│   ├── User.js         # User schema
│   └── chat.js         # Chat history schema
├── pages/              # Next.js pages
│   ├── api/            # API routes
│   │   ├── auth/       # Authentication endpoints
│   │   ├── chat.js     # Main chat endpoint
│   │   └── chat-history.js
│   ├── chat.js         # Chat page
│   └── index.js        # Home page
├── scripts/            # Utility scripts
└── styles/             # Global styles
```

## 🎯 How It Works

1. **User Authentication**: Users sign in using credentials or OAuth providers
2. **Question Input**: User asks a question about indigenous cultures
3. **Embedding Generation**: Question is converted to a vector using Gemini's text-embedding-004
4. **Vector Search**: Pinecone finds the most relevant knowledge chunks
5. **Answer Generation**: Gemini 2.5 Flash generates a contextual answer using retrieved information
6. **Response Delivery**: Answer is displayed in the chat interface and saved to MongoDB

## 🔑 API Endpoints

- `POST /api/chat` - Send a question and receive an AI-generated answer or Sign in with credentials


## 🌟 Key Features Explained

### RAG (Retrieval-Augmented Generation)
The chatbot uses RAG to provide accurate, context-aware responses by:
1. Retrieving relevant information from the knowledge base
2. Augmenting the AI prompt with this context
3. Generating informed responses based on actual data

### Rate Limiting
Implements rate limiting to prevent abuse:
- Limits requests per user/IP
- Configurable time windows
- Graceful error handling

### Chat History
- Persistent storage of conversations
- User-specific history retrieval
- Organized by sessions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👤 Author

**Mohnish**
- GitHub: [@Mohnish27-dev](https://github.com/Mohnish27-dev)

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Pinecone for vector search
- Indigenous communities for cultural knowledge
- Next.js team for the amazing framework

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Note**: This project is for educational purposes. Please ensure proper attribution and respect for indigenous cultures when using or sharing information from this chatbot.
