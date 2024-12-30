import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import connectDB from '@/lib/database.db';
import { User } from '@/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt', // Use JSON Web Tokens for session management
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        // Connect to the database
        await connectDB();
    
        // Check if user exists in the database
        const existingUser = await User.findOne({ email: user.email });
    
        if (existingUser) {
          console.log("user already exist ok")
          return true; // Allow sign-in if user exists
        } else {
          // Create a new user if they don't exist
          const newUser = new User({
            name: user.name,
            email: user.email,
            image: user.image,
            role: 'user', // Set default role (you can modify this as needed)
            semester: "",
            isVerifiedByAdmin: false, // Set initial verification status (adjust as needed)
          });
    
          // Save the new user to the database
          await newUser.save();
    console.log("user is saved ok")
          return true; // Proceed with sign-in process
        }
      } catch (error) {
        console.error('Error during sign-in:', error); // Log the error
        return false; // Block sign-in if an error occurs
      }
    }
    ,
    async session({ session, token }) {
      try {
        // Fetch latest user data from database
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          // Use the latest data from database instead of token
          session.user.role = dbUser.role;
          session.user.isVerifiedByAdmin = dbUser.isVerifiedByAdmin;
        }
        return session;
      } catch (error) {
        console.error('Error fetching user data for session:', error);
        // Fallback to token data if database fetch fails
        session.user.role = token.role;
        session.user.isVerifiedByAdmin = token.isVerifiedByAdmin;
        return session;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.role = dbUser.role; // Set role
          token.isVerifiedByAdmin = dbUser.isVerifiedByAdmin; // Set admin verification status
        }
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
