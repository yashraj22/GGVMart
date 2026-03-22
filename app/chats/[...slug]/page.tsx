"use client";
import { use } from "react";
import ChatUi from "@/app/components/ChatUi";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = use(props.params);

  return (
    <div
      className="mx-auto max-w-7xl w-full flex flex-col overflow-hidden"
      style={{
        height: "calc(100vh - 56px)",
        background: "var(--ds-background-100)",
      }}
    >
      <div className="px-4 py-3 flex-shrink-0">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
          style={{ color: "var(--ds-gray-700)" }}
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Back to home
        </Link>
      </div>
      <div
        className="flex flex-1 min-h-0 border-x"
        style={{
          borderColor: "var(--ds-gray-400)",
        }}
      >
        <ChatUi params={params} />
      </div>
    </div>
  );
}
