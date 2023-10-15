import { getStats } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export async function POST(request, response) {
  const { secret } = await request.json();

  if (secret != process.env.NEXT_PUBLIC_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await getStats();
    return Response.json({ success: true, stats });
  } catch (e) {
    console.log(e);
    return Response.json({ success: false });
  }
}
