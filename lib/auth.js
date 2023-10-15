import CredentialsProvider from "next-auth/providers/credentials";
import { authenticateUser } from "@/lib/db";

const findUserByEmail = (email, course) => {
  const user = authenticateUser(email, course);
  if (user) {
    return user;
  } else {
    return null;
  }
};

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
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};
