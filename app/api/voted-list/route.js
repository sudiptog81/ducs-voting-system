import {insertVote, checkVoted, getVotedUsers} from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export async function GET(request, response) {
  const users = await getVotedUsers()
  return Response.json({voted: users})
}
