import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",      type: "email"    },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const user = await User.findOne({ email: credentials.email }).lean() as any;
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password as string, user.password);
        if (!valid) return null;

        return {
          id:           user._id.toString(),
          email:        user.email,
          name:         user.businessName,
          businessId:   user._id.toString(),
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      // Al hacer login, guardamos businessId en el token
      if (user) token.businessId = (user as any).businessId;
      return token;
    },
    session({ session, token }) {
      // Exponemos businessId en la sesión del cliente
      if (token.businessId) (session.user as any).businessId = token.businessId as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
});
