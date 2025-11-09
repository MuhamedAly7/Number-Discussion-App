import { registerUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return new Response("Missing fields", { status: 400 });
  }

  try {
    const user = await registerUser(username, password);
    return Response.json(
      { id: user.id, username: user.username },
      { status: 201 }
    );
  } catch (e: any) {
    if (e.code === "P2002") {
      return new Response("Username already taken", { status: 409 });
    }
    return new Response("Server error", { status: 500 });
  }
}
