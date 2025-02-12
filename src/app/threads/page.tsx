'use client';
export const runtime = 'edge';
import { useEffect, useState } from "react";

import ApiResponse from "@/interface/response";
import roleLevel from "@/data/roleLevel";
import Header from "@/components/ui/Header";
import Thread from "@/interface/thread";
import Link from "next/link";
import Role from "@/types/role";

const needLevel: number = 1;

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [view, setView] = useState<string>('*');

  useEffect(() => {
    const authUserPermission = async () => {
      const response: Response = await fetch('/api/v1/user');
      const data: ApiResponse = await response.json();
      
      if (data.success && data.body) {
        const role: Role = data.body.role;
        const level = roleLevel[role];

        console.log(level);
        console.log(needLevel >= level);

        if (needLevel >= level) {
          alert('貴方は認証されていません');
          document.cookie = 'session=;';
          window.location.href = '/login';
          return false;
        }
        return true;
      } else {
        window.location.href = '/login';
        return false;
      }
    };

    const getUserSelfThread = async () => {
      const isAuthorized = await authUserPermission();
      if (!isAuthorized) return;

      const { searchParams } = new URL(window.location.href);
      const target: string = searchParams.get('view') ?? '*';
      setView(target);
      
      const response: Response = await fetch(`/api/v1/thread?filter=${target}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setThreads(data.body);
      } else {
        alert('最新のスレッドの取得に失敗しました');
      }
    };

    getUserSelfThread();
  }, []);

  return (
    <>
    <Header disbleNotLoginUser={true}/>

    <div className="mt-5 flex">
      <div className="w-1/5"></div>
      <div className="w-full">
        <div className="text-center text-3xl mt-5">
          スレッド一覧 - { view == 'myself' ? 'ユーザー作成' : '全て' }
        </div>

        <div className="mt-3 bg-white rounded-md px-5 py-5">
          {threads.map((thread: Thread, index: number) => {
            return (
              <Link href={`/thread/${thread.thread_id}`} key={index}>
                <div className="border w-full rounded-md px-2 py-2 text-center items-center mt-3 hover:bg-gray-100 ">
                  { thread.name } - 更新日時: { new Date(thread.update_date).toUTCString() }
                </div>
              </Link>
            );
          })}
        </div>
        
      </div>

      <div className="w-1/5"></div>
    </div>
    </>
  );
}
