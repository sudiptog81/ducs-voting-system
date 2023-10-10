import {insertVote, checkVoted} from "@/lib/db";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export async function POST(request, response) {
  const b = await checkVoted(await request.json());
  return Response.json({voted: b})
}
