'use client';

import { ReactElement, Ref } from "react";

import ReactMarkdown from 'react-markdown';

interface CommentProps {
    no:         number;
    handleName: string;
    text:       string;
    threadId:   string;
    textRef:    Ref<HTMLTextAreaElement>,
    setText:    Function
}

function convertFormat(text: string, threadId: string) {
    return text.replace(/>>(\d+)/g, (_, no) => `[>>${no}](/thread/${threadId}/#${no})`);
}

export default function CommentEle({ no, handleName, text, threadId, textRef, setText }: CommentProps): ReactElement {
    return (
        <div id={no.toString()} className="border rounded-md px-2 py-2 mt-2" onClick={() => {
            setText(textRef.current.value += `>>${no}`)
        }}>
            <div className="rounded px-2">
                { no } =&gt; { handleName }
            </div>
            
            <ReactMarkdown 
                className={`px-4`}
                components={{
                    a: ({ node, ...props }) => <a {...props} className="text-blue-500 hover:text-blue-600 hover:underline" />
                }} >
                { convertFormat(text, threadId) }
            </ReactMarkdown>
        </div>
    );
}