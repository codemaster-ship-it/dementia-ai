import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Friend from "@/models/Friend";

export async function GET() {
  await dbConnect();
  const friends = await Friend.find().sort({ createdAt: -1 });
  return NextResponse.json(friends);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const friend = await Friend.create(body);
  return NextResponse.json(friend);
}
