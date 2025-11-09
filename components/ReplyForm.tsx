"use client";

import { useState } from "react";

export default function ReplyForm({
  parentId,
  onReply,
  onCancel,
}: {
  parentId: string;
  onReply: (reply: any) => void;
  onCancel: () => void;
}) {
  const [operation, setOperation] = useState("add");
  const [rightValue, setRightValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rightValue.trim()) return;

    try {
      const res = await fetch(`/api/posts/${parentId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation, rightValue: Number(rightValue) }),
      });

      if (!res.ok) throw new Error("Failed to reply");

      const reply = await res.json();

      // ENSURE replies is array
      onReply({
        ...reply,
        replies: [],
        author: reply.author || { username: "You" },
        replier: reply.replier || null,
      });

      setRightValue("");
    } catch (err) {
      console.error(err);
      alert("Failed to send reply, Please login!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-3 bg-gray-50 rounded">
      <div className="flex gap-2 items-center">
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          className="px-2 py-1 border rounded text-sm"
        >
          <option value="add">+</option>
          <option value="subtract">−</option>
          <option value="multiply">×</option>
          <option value="divide">÷</option>
        </select>
        <input
          type="number"
          value={rightValue}
          onChange={(e) => setRightValue(e.target.value)}
          placeholder="Number"
          className="flex-1 px-2 py-1 border rounded text-sm"
          required
        />
        <button
          type="submit"
          className="px-3 py-1 bg-purple-600 text-white rounded text-sm"
        >
          Send
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
