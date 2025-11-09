import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession();

  if (!session?.user?.name) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { operation, rightValue } = await req.json();
  const username = session.user.name;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const parent = await prisma.post.findUnique({ where: { id } });
  if (!parent) {
    return new Response("Parent not found", { status: 404 });
  }

  let result = parent.value;
  const rv = Number(rightValue);

  switch (operation) {
    case "add":
      result += rv;
      break;
    case "subtract":
      result -= rv;
      break;
    case "multiply":
      result *= rv;
      break;
    case "divide":
      result = rv !== 0 ? result / rv : 0;
      break;
    default:
      return new Response("Invalid operation", { status: 400 });
  }

  const reply = await prisma.post.create({
    data: {
      value: result,
      operation,
      rightValue: rv,
      parentId: parent.id,
      authorId: user.id,
      replierId: user.id,
    },
  });

  return Response.json(reply, { status: 201 });
}
