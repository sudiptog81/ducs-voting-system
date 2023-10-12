import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google';
import { authenticateUser } from './db';

const findUserByEmail = (email, course) => {
  const user = authenticateUser(email, course);
  if (user) {
    return user;
  } else {
    return null;
  }
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Email",
      pages: {
        signIn: "/",
      },
      credentials: {
        course: { label: "Course", type: "text" },
        email: { label: "E-mail", type: "email" },
      },
      async authorize(credentials, req) {
        const user = findUserByEmail(credentials.email, credentials.course);
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
};
