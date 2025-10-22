import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import TwitterProvider from "next-auth/providers/twitter"
import CredentialsProvider from "next-auth/providers/credentials";
import connectDb from '../../../lib/mongoDb';
import User from '../../../model/User';
import bcrypt from "bcryptjs";
import dotenv from "dotenv"
// import EmailProvider from 'next-auth/providers/email'
dotenv.config();

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key-min-32-characters-long-for-development",
    providers: [
        // OAuth authentication providers...
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_ID,
            clientSecret: process.env.TWITTER_SECRET,
            version: "2.0"
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your@email.com" },
                password: { label: "Password", type: "password" },
                name: { label: "Name", type: "text", placeholder: "Your Name" },
            },
            async authorize(credentials) {
                try {
                    console.log("=== Credentials Login Attempt ===");
                    console.log("Email:", credentials.email);
                    
                    await connectDb();
                    let user = await User.findOne({ email: credentials.email });
                    
                    if (!user) {
                        // Register a new User
                        console.log("Creating new user:", credentials.email);
                        const hashedPassword = await bcrypt.hash(credentials.password, 10);
                        user = await User.create({
                            name: credentials.name,
                            email: credentials.email,
                            password: hashedPassword,
                            provider: "credentials"
                        });
                        
                        console.log("New user created successfully");
                        
                        // Return the newly created user
                        return {
                            id: user._id.toString(),
                            name: user.name,
                            email: user.email,
                            image: user.image || "",
                            provider: user.provider
                        };
                    }
                    else {
                        // Login: compare password
                        console.log("User found, verifying password");
                        
                        // Check if user has a password (OAuth users won't have one)
                        if (!user.password) {
                            console.log("User registered via OAuth, no password set");
                            return null;
                        }
                        
                        const valid = await bcrypt.compare(credentials.password, user.password);
                        if (!valid) {
                            console.log("Invalid password for user:", credentials.email);
                            return null;
                        }
                        
                        console.log("Login successful for:", credentials.email);
                        return {
                            id: user._id.toString(),
                            name: user.name,
                            email: user.email,
                            image: user.image || "",
                            provider: user.provider
                        };
                    }
                } catch (error) {
                    console.error("Error in credentials authorize:", error);
                    return null;
                }
            },
        }),

    ],
    callbacks: {
        async signIn({ user, account}) {
            // Only handle OAuth providers (Google, GitHub, Twitter)
            // Skip credentials provider as user is already created in authorize()
            if (account.provider !== "credentials") {
                await connectDb();
                const existing = await User.findOne({ email: user.email });
                
                if (!existing) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        provider: account.provider
                    });
                }
            }

            return true; // Allow sign-in
        },
        async session({ session, token, user }) {
            // const dbUser = await User.findOne({ email: session.user.email });
            // session.user.name = dbUser.username;

            return session
        }

        // pages: {
        //     signIn: "/auth/signin",
        //     // Optionally, specify error, signUp, etc.
        // },
        // session: {
        //     strategy: "jwt",
        // },
        // // Passwordless / email sign in
        // EmailProvider({
        //   server: process.env.MAIL_SERVER,
        //   from: 'NextAuth.js <no-reply@example.com>'
        // }),
    }
}

export default NextAuth(authOptions)