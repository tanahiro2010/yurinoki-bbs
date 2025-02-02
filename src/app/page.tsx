'use client';

import { useEffect, useState } from "react";

import CreateThreadAction from "@/actions/createThread";
import Header from "@/components/ui/Header";
import Thread from "@/interface/thread";
import Link from "next/link";

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {

  }, []);

  return (
    <>
    <Header disbleNotLoginUser={true}/>

    <div className="mt-5 flex">
      <div className="w-1/5"></div>
      <div className="w-full">
        <div className="text-center text-3xl">
          Dashboard
        </div>

        <div className="mt-3 bg-white rounded-md px-5 py-5">
          <button 
            onClick={CreateThreadAction} 
            className="border w-full rounded-md px-2 py-2 hover:bg-gray-100" >
              スレッドを作成
          </button><br />

          <Link href={`/threads?view=myself`}>
            <div className="border w-full rounded-md px-2 py-2 text-center items-center mt-3 hover:bg-gray-100 ">
              自身の作成したスレッド
            </div>
          </Link>
          
        </div>

        <div className="text-center text-3xl mt-5">
          最近更新されたスレッド
        </div>

        <div className="mt-3 bg-white rounded-md px-5 py-5">
          {threads.map((thread: Thread) => {
            return (
              <Link href={`/thread/${thread.thread_id}`}>
                <div className="border w-full rounded-md px-2 py-2 text-center items-center mt-3 hover:bg-gray-100 ">
                  { thread.name }
                </div>
              </Link>
            );
          })}
          
          
        </div>
        
      </div>

      
      <div className="w-1/5"></div>
    </div>
    </>
  )
}
