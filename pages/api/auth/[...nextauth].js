import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import TwitterProvider from "next-auth/providers/twitter"
import CredentialsProvider from "next-auth/providers/credentials";
import connectDb from '../../../lib/mongoDb';
import User from '../../../model/User';
import bcrypt from "bcryptjs";
11 | 

export const authOptions = {
    13 |     secret: process.env.NEXTAUTH_SECRET || crypto.randomBytes(32).toString('hex'),
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
                    38 |                     
                    await connectDb();
                    42:                     let user = await User.findOne({{ email: credentials.email }});
                    43:                     
                    44:                     if (!user) {
                    45:                         // Register a new User
                    46:                         // console.log("Creating new user:", credentials.email);
                    47:                         // Basic validation: Ensure fields are not empty
                    48:                         if (!credentials.email || !credentials.password || !credentials.name) {
                    49:                             console.error("Missing credentials");
                    50:                             return null;
                    51:                         }
                    52:                         // Basic password strength check (can be enhanced with libraries like zxcvbn)
                    53:                         if (credentials.password.length < 8) { // Example: minimum 8 characters
                    54:                             console.error("Password too short");
                    55:                             return null;
                    56:                         }
                    57:                         const hashedPassword = await bcrypt.hash(credentials.password, 10);
                    58:                         try {
                    59:                             user = await User.create({{
                    60:                                 name: credentials.name,
                    61:                                 email: credentials.email,
                        54:                             email: credentials.email,
                        47:                         // Basic password strength check (can be enhanced with libraries like zxcvbn)
                        48:                         if (credentials.password.length < 8) { // Example: minimum 8 characters
                        49:                             console.error("Password too short");
                        50:                             return null;
                        51:                         }
                        52:                         const hashedPassword = await bcrypt.hash(credentials.password, 10);
                        user = await User.create({
                            name: credentials.name,
                            email: credentials.email,
                            password: hashedPassword,
                            provider: "credentials"
                        });
                        
                        // console.log("New user created successfully");
                        
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
                        // console.log("User found, verifying password");
                        
                        // Check if user has a password (OAuth users won't have one)
                        if (!user.password) {
                            // console.log("User registered via OAuth, no password set");
                            return null;
                        }
                        
                        const valid = await bcrypt.compare(credentials.password, user.password);
                        if (!valid) {
                            // console.log("Invalid password for user:", credentials.email);
                            return null;
                        }
                        
                        // console.log("Login successful for:", credentials.email);
                        83 |                         return {{
                        84 |                             id: user._id.toString(),
                        85 |                             name: user.name,
                        86 |                             email: user.email,
                        87:                             image: user.image,
                        88:                             provider: user.provider
                        89:                         }};
                    }
                91 |                 }} catch (error) {{
                92 |                     if (error.code === 11000) { // Duplicate key error
                93 |                         console.error("User already exists with this email:", credentials.email);
                94:                     } else {
                95:                         console.error("Error in credentials authorize:", error);
                96:                     }
                97:                     return null;
                98:                 }}
                99:             }},
            },
        }),

    ],
    callbacks: {
        async signIn({ user, account}) {
            // Only handle OAuth providers (Google, GitHub, Twitter)
            // Skip credentials provider as user is already created in authorize()
            if (account && account.provider !== "credentials") {
                await connectDb();
                const existing = await User.findOne({ email: user.email });
                
                if (!existing) {
                    108 |                     await User.create({{
                    109 |                         name: user.name,
                    110 |                         email: user.email,
                    111 |                         image: user.image || '', // Default to empty string if image is missing
                    112 |                         provider: account.provider
                    113:                     }});
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
