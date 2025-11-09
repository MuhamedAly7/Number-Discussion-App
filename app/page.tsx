import PostTree from "@/components/PostTree";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

function transformPost(post: any): any {
  return {
    ...post,
    createdAt: post.createdAt.toISOString(),
    replies: Array.isArray(post.replies) ? post.replies.map(transformPost) : [],
  };
}

export default async function Home() {
  const session = await getServerSession();

  const rawPosts = await prisma.post.findMany({
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

  const posts = rawPosts.map(transformPost);

  return <PostTree initialPosts={posts} session={session} />;
}
