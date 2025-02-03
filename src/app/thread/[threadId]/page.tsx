'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import CreateThreadAction from "@/actions/createThread";
import ApiResponse from "@/interface/response";
import CommentEle from "@/components/ui/Comment";
import Comment from "@/interface/comment";
import Header from "@/components/ui/Header";
import Thread from "@/interface/thread";
import Link from "next/link";

export default function Home() {
  const { threadId } = useParams();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!threadId) return; // threadId が未定義の場合は実行しない

    const getComments = (async () => {

    });

    const getThread = (async () => {
      try {
        const response: Response = await fetch(`/api/v1/thread?filter=${threadId}`);
        const data: ApiResponse = await response.json();

        if (data.success) {
          setThread(data.body);
        } else {
          alert('最新のスレッドの取得に失敗しました');
        }
      } catch (error) {
        console.error('スレッド取得エラー:', error);
        alert('スレッドの取得中にエラーが発生しました');
      }
    });

    getThread();
  }, [threadId]); // `threadId` を依存配列に追加

  return (
    <>
      <Header disbleNotLoginUser={true} />

      <div className="mt-5 flex">
        <div className="w-1/5"></div>
        <div className="w-full">
          <div className="text-center text-3xl">
            {thread ? thread.name : 'スレッドが見つかりません'}
          </div>

          <div className="mt-3 bg-white rounded-md px-5 py-5">
            {/* スレッドの内容をここに表示 */}

          </div>
        </div>

        <div className="w-1/5"></div>
      </div>
    </>
  );
}