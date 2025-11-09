"use client";

import { useState } from "react";

export default function StartPostForm({
  onPost,
}: {
  onPost: (post: any) => void;
}) {
  const [value, setValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: Number(value) }),
      });

      if (!res.ok) throw new Error("Failed to post");

      const post = await res.json();

      onPost({
        ...post,
        replies: [],
        author: post.author || { username: "You" },
        replier: null,
      });

      setValue("");
    } catch (err) {
      console.error(err);
      alert("Failed to start discussion");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Start a Discussion</h2>
      <div className="flex gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number"
          className="flex-1 px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Start
        </button>
      </div>
    </form>
  );
}
