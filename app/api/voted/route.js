import { insertVote, checkVoted } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export async function POST(request, response) {
  const p = await request.json();
  const b = await checkVoted(p);
  return Response.json({ voted: b });
}
