import {insertVote, checkVoted} from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export async function POST(request, response) {
  // check if user is authenticated
  const session = await getServerSession({req: request});

  if (!session) {
    return Response.json({error: 'Unauthorized'}, {status: 401});
  }

  const data = await request.json();
  const {email, votes, secret} = data;

  if (secret != process.env.NEXT_PUBLIC_SECRET) {
    return Response.json({error: 'Unauthorized'}, {status: 401});
  }
  
  try {
    for (const [post, candidate] of Object.entries(votes)) {
      await insertVote(email, post, candidate);
    }
    return Response.json({success: true})
  } catch (e) {
    console.log(e);
    return Response.json({success: false})
  }  
}
