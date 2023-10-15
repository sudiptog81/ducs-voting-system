import { authOptions } from "@/lib/auth";
import { insertVote } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function POST(request, response) {
  const session = await getServerSession(
    request,
    {
      ...response,
      getHeader: (name) => response.headers?.get(name),
      setHeader: (name, value) => response.headers?.set(name, value),
    },
    authOptions,
  );

  if (!session) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 },
    );
  }

  const data = await request.json();
  const { email, votes, secret } = data;

  if (secret != process.env.NEXT_PUBLIC_SECRET) {
    return Response.json(
      { error: "Unauthorized", success: false },
      { status: 401 },
    );
  }

  try {
    for (const [post, candidate] of Object.entries(votes)) {
      await insertVote(email, post, candidate);
    }
    return Response.json({ success: true });
  } catch (e) {
    console.log(e);
    return Response.json({ success: false });
  }
}
