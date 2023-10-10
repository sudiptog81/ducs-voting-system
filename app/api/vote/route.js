import {insertVote, checkVoted} from "@/lib/db";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export async function POST(request, response) {
  const data = await request.formData();
  const {email, president, vice_president, treasurer, secretary, joint_secretary, agree} = Object.fromEntries(data)
  try {
    await insertVote(email, president, vice_president, treasurer, secretary, joint_secretary);
    return Response.json({success: true})
  } catch (e) {
    return Response.json({success: false})
  }  
}
