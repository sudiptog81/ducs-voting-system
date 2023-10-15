import { getVotedUsers } from "@/lib/db";

export async function POST(request, response) {
  const { secret } = await request.json();

  if (secret != process.env.NEXT_PUBLIC_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await getVotedUsers(25);
  return Response.json({ voted: users });
}
