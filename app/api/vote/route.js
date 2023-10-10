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

  const data = await request.formData();
  const {email, president, vice_president, treasurer, secretary, joint_secretary, agree} = Object.fromEntries(data)
  try {
    await insertVote(email, president, vice_president, treasurer, secretary, joint_secretary);
    return Response.json({success: true})
  } catch (e) {
    console.log(e);
    return Response.json({success: false})
  }  
}
