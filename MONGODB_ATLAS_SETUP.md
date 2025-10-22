# MongoDB Atlas Cloud Database Setup

This guide will help you migrate from local MongoDB to MongoDB Atlas (cloud database).

## 📋 Prerequisites
- A MongoDB Atlas account (free tier available)
- Your existing local MongoDB data (optional - for migration)

## 🚀 Step-by-Step Setup

### 1. Create MongoDB Atlas Account
- Visit: https://www.mongodb.com/cloud/atlas/register
- Sign up using email or OAuth (Google/GitHub)
- Verify your email address

### 2. Create a Free Cluster
1. Click **"Build a Database"** or **"Create Deployment"**
2. Choose **"M0 FREE"** tier
   - 512 MB storage
   - Shared RAM
   - Perfect for development
3. Select Cloud Provider & Region:
   - AWS, Google Cloud, or Azure
   - Choose region closest to your users
4. Name your cluster: `rag-chatbot-cluster`
5. Click **"Create Cluster"** (takes 3-5 minutes)

### 3. Create Database User
1. Navigate to **"Database Access"** (Security section)
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `ragchatbot-admin` (or your choice)
5. Click **"Autogenerate Secure Password"**
   - 📝 **IMPORTANT**: Copy and save this password securely!
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### 4. Configure Network Access
1. Go to **"Network Access"** (Security section)
2. Click **"Add IP Address"**
3. For Development:
   - Click **"Allow Access from Anywhere"**
   - IP: `0.0.0.0/0`
   - This allows connections from any IP
4. For Production:
   - Add specific IP addresses
   - Or use your deployment platform's IP range
5. Click **"Confirm"**

⚠️ **Security Note**: For production, always restrict to specific IPs!

### 5. Get Connection String
1. Go to **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Update Your .env.local File

Replace the local MongoDB URI with your Atlas connection string:

**Before (Local):**
```env
MONGO_URI=mongodb://localhost:27017/rag-chatbot
```

**After (Atlas):**
```env
MONGO_URI=mongodb+srv://ragchatbot-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/rag-chatbot?retryWrites=true&w=majority
```

**Important Replacements:**
- `<username>`: Your database username (e.g., `ragchatbot-admin`)
- `<password>`: The password you saved (URL encode if it contains special characters)
- `cluster0.xxxxx.mongodb.net`: Your actual cluster URL
- `rag-chatbot`: Your database name

### 7. Test Connection

Run your application:
```bash
npm run dev
```

Check the console for connection messages. You should see:
```
✅ MongoDB connected successfully
```

### 8. Create Database and Collections

MongoDB Atlas will automatically create:
- Database: `rag-chatbot` (when first document is inserted)
- Collections: `users`, `chats` (when first document is inserted)

You don't need to manually create them!

## 🔧 Troubleshooting

### Connection Errors

**Error: "MongoServerError: bad auth"**
- Solution: Check username and password are correct
- Ensure password is URL-encoded if it contains special characters

**Error: "MongooseServerSelectionError"**
- Solution: Check IP whitelist in Network Access
- Ensure 0.0.0.0/0 is added for development

**Error: "Authentication failed"**
- Solution: Verify database user exists in Database Access
- Check user has read/write permissions

### URL Encoding Special Characters

If your password contains special characters, encode them:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`
- `[` → `%5B`
- `]` → `%5D`

Example:
```
Password: p@ss:word
Encoded: p%40ss%3Aword
```

## 📊 View Your Data

1. Go to **"Database"** → **"Browse Collections"**
2. Select database: `rag-chatbot`
3. View collections: `users`, `chats`
4. You can manually add/edit/delete documents here

## 💡 Best Practices

1. **Environment Variables**: Never commit .env files to Git
2. **Password Security**: Use strong, unique passwords
3. **IP Whitelisting**: Restrict to specific IPs in production
4. **Monitoring**: Check Atlas dashboard for connection metrics
5. **Backups**: Atlas M0 includes basic backup (7-day retention)

## 📈 Scaling

When you need more resources:
- Upgrade to M10+ for dedicated clusters
- Get automated backups
- Add more storage and RAM
- Enable advanced security features

## 🆘 Need Help?

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Community Forum: https://www.mongodb.com/community/forums/
- MongoDB University: https://university.mongodb.com/ (Free courses)

---

**Next Steps After Setup:**
1. ✅ Update .env.local with Atlas connection string
2. ✅ Test the connection by running the app
3. ✅ Sign up/Sign in to create your first user
4. ✅ Start chatting to populate the database!
