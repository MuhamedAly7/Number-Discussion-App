"use client";

import StartPostForm from "./StartPostForm";
import { useRouter } from "next/navigation";

export default function StartPostWrapper() {
  const router = useRouter();

  const handlePost = () => {
    router.refresh();
  };

  return <StartPostForm onPost={handlePost} />;
}
