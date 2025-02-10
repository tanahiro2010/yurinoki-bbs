'use client';
export const runtime = 'edge';

import { useEffect, useState, useRef, Ref } from "react";
import { useParams } from "next/navigation";

import sendMessage from "@/actions/sendMessage";
import ApiResponse from "@/interface/response";
import CommentEle from "@/components/ui/Comment";
import Comment from "@/interface/comment";
import Header from "@/components/ui/Header";
import Thread from "@/interface/thread";

export default function Home() {
  const { threadId }: { threadId: string } = useParams();

  const handleNameRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const textRef: Ref<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);

  const [handleNameValue, setHandleNameValue] = useState<string>("風吹けば名無し");
  const [textValue, setTextValue] = useState<string>("");
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!threadId) return; // threadId が未定義の場合は実行しない
    setHandleNameValue(window.localStorage.getItem('handleName') ?? '風吹けば名無し');

    const getComments = (async () => {
      const response: Response = await fetch(`/api/v1/thread?filter=${threadId}&type=comment`);;
      const data: ApiResponse = await response.json();

      if (data.success) {
        setComments(data.body);
      } else {
        alert('コメントの取得に失敗しました');
        if (confirm('再試行しますか？')) {
          window.location.reload();
        }
      }
    });

    const getThread = (async () => {
      try {
        const response: Response = await fetch(`/api/v1/thread?filter=${threadId}`);
        const data: ApiResponse = await response.json();

        if (data.success) {
          setThread(data.body);
          await getComments();
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

          <div className="mt-3 bg-white rounded-md shadow-md border px-5 py-5 h-[75vh] overflow-y-auto">
            {/* スレッドの内容をここに表示 */}
            {comments.map((comment: Comment, index: number) => {
              return (
                <CommentEle 
                  key={index}
                  no={comment.comment_no}
                  authorId={comment.author_id}
                  handleName={comment.name}
                  text={comment.text}
                  threadId={threadId}
                  textRef={textRef}
                  setText={setTextValue}
                  createdAt={comment.created_at ?? ""}
                />
              )
            })}
          </div>

          <div className="mt-5 bg-white rounded-md shadow-md border px-5 py-5">
            <div className="text-center text-2xl">
              投稿する
            </div>

            <div className="flex items-center mt-2">
              <div className="w-1/5"></div>
              <div className="w-full">
                <form action={() => {sendMessage(threadId, handleNameRef.current?.value ?? '風吹けば名無し', textRef.current?.value)}}>
                  <input 
                    type="text"
                    placeholder="ハンドルネーム"
                    value={handleNameValue}
                    ref={handleNameRef}
                    onChange={(e) => {
                      setHandleNameValue(handleNameRef.current?.value ?? "" + e.target.value);
                      window.localStorage.setItem('handleName', handleNameValue);
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                  />

                  <textarea 
                    placeholder="本文"
                    ref={textRef}
                    className="w-full px-3 py-2 border rounded-md mt-2"
                    onChange={(e) => {
                      setTextValue(textRef.current?.value ?? "" + e.target.value);
                    }}
                    value={textValue} ></textarea>

                  <button 
                    className="w-full bg-blue-300 mt-2 rounded-md py-2 border hover:bg-blue-400" >
                    送信
                  </button>
                </form>
              </div>
              <div className="w-1/5"></div>
            </div>
          </div>

          <div className="h-[10vh]"></div>
        </div>

        <div className="w-1/5"></div>
      </div>
    </>
  );
}