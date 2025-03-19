import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";
import jwt, { JwtPayload } from "jsonwebtoken";

interface NextAuthOptionsExtended extends NextAuthOptions {
  adapter: any;
}

export const authOptions: NextAuthOptionsExtended = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
    // Follow the "Login with Email" tutorial to set up your email server
    // Requires a MongoDB database. Set MONOGODB_URI env variable.
    /* ...(connectMongo
    /* ...(connectMongo
      ? [
          EmailProvider({
            server: {
              host: "smtp.resend.com",
              port: 465,
              auth: {
                user: "resend",
                pass: process.env.RESEND_API_KEY,
              },
            },
            from: config.resend.fromNoReply,
          }),
        ]
      : []), */
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.email; // Override sub with email
        token.googleId = user.id; // Store Google ID separately
        delete token.email; // Remove email from the token
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.email = token.sub;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    async encode({ token, secret, maxAge }) {
      return jwt.sign(token, secret, { expiresIn: maxAge, algorithm: "HS256" });
    },

    async decode({ token, secret }) {
      try {
        // Decode JWT and verify it using the secret
        const decodedToken = jwt.verify(token, secret) as JwtPayload;

        // Convert the decoded JWT into a JWT object
        return {
          sub: decodedToken.sub,
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture,
          iat: decodedToken.iat,
        };
      } catch (err) {
        return null; // Return null if JWT is invalid or expired
      }
    },
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    //logo: `https://${config.domainName}/logoAndName.png`,
  },
};

export default NextAuth(authOptions);
