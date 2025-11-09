"use client";

import { useState } from "react";
import ReplyForm from "./ReplyForm";
import StartPostForm from "./StartPostForm";
import { format } from "date-fns";
import Link from "next/link";

type Post = {
  id: string;
  value: number;
  operation: string | null;
  rightValue: number | null;
  createdAt: string;
  author: { username: string };
  replier?: { username: string } | null;
  replies: Post[];
};

export default function PostTree({
  initialPosts,
  session,
}: {
  initialPosts: Post[];
  session: any; // from getServerSession()
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const addReply = (parentId: string, reply: Post) => {
    const update = (posts: Post[]): Post[] =>
      posts.map((p) =>
        p.id === parentId
          ? { ...p, replies: [...p.replies, reply] }
          : { ...p, replies: update(p.replies) }
      );
    setPosts(update(posts));
    setReplyingTo(null);
  };

  const addPost = (post: Post) => {
    setPosts([post, ...posts]);
  };

  const renderPost = (post: Post, depth = 0) => (
    <div
      key={post.id}
      style={{
        marginLeft: Math.min(depth * 30, 150),
        transform:
          depth > 4
            ? `scale(${Math.max(1 - (depth - 4) * 0.08, 0.6)})`
            : undefined,
        transformOrigin: "top left",
        opacity: depth > 6 ? 0.8 : 1,
        transition: "all 0.2s ease",
      }}
      className="border-l-2 border-gray-200 pl-4 my-2"
    >
      <div className="bg-white p-3 rounded shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <strong>{post.author.username}</strong>
          {post.replier && (
            <span className="text-gray-400">→ {post.replier.username}</span>
          )}
          <span>{format(new Date(post.createdAt), "MM.dd.yyyy @ HH:mm")}</span>
        </div>

        <div className="mt-2 font-mono text-lg">
          {post.operation ? (
            <span>
              {post.operation === "add" && "+"}
              {post.operation === "subtract" && "−"}
              {post.operation === "multiply" && "×"}
              {post.operation === "divide" && "÷"} {post.rightValue} →{" "}
              <strong>{post.value.toFixed(3)}</strong>
            </span>
          ) : (
            <strong>{post.value}</strong>
          )}
        </div>

        <button
          onClick={() => setReplyingTo(post.id)}
          className="text-purple-600 text-sm mt-1 hover:underline"
        >
          Reply
        </button>

        {replyingTo === post.id && (
          <ReplyForm
            parentId={post.id}
            onReply={(reply) => addReply(post.id, reply)}
            onCancel={() => setReplyingTo(null)}
          />
        )}
      </div>

      {post.replies.map((reply) => renderPost(reply, depth + 1))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      {session ? (
        <StartPostForm onPost={addPost} />
      ) : (
        <div className="text-center py-8">
          <p className="text-lg">
            <Link href="/login" className="text-purple-600 hover:underline">
              Log in
            </Link>{" "}
            or{" "}
            <Link href="/register" className="text-purple-600 hover:underline">
              register
            </Link>{" "}
            to start a discussion.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-4">{posts.map(renderPost)}</div>
    </div>
  );
}
