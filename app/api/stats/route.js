import {getStats} from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export async function GET(request, response) {
  const session = await getServerSession({req: request});

  if (!session) {
    return Response.json({error: 'Unauthorized'}, {status: 401});
  }

  try {
    const stats = await getStats();
    return Response.json({success: true, stats})
  } catch (e) {
    console.log(e);
    return Response.json({success: false})
  }  
}
