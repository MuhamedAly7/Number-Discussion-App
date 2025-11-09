import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { parentId: null },
    include: {
      author: { select: { username: true } },
      replier: { select: { username: true } },
      replies: {
        include: {
          author: { select: { username: true } },
          replier: { select: { username: true } },
          replies: {
            include: {
              author: { select: { username: true } },
              replier: { select: { username: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.name)
    return new Response("Unauthorized", { status: 401 });

  const { value } = await req.json();
  const username = session.user.name;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return new Response("User not found", { status: 404 });

  const post = await prisma.post.create({
    data: {
      value: Number(value),
      authorId: user.id,
    },
  });

  return Response.json(post, { status: 201 });
}
