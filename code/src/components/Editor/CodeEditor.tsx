"use client"

import Editor ,{OnMount} from '@monaco-editor/react';
import {useRef} from 'react';
import {io} from 'socket.io-client';

export default function CodeEditor( {language}:{language:string})
{
    const editorRef = useRef<any>(null);
    // 3. Listen for local changes to broadcast
    
     const socketRef = useRef<any>(null);
    const HandlerEditorOnMount = (editor:any)=>
    {
       

            //initailizing the socket connection
        socketRef.current= io(process.env.PUBLIC_SOCKET_URL);

        //join the specific room
        socketRef.current.emit("join-room", { slug: "your-room-slug" });

        // listen for changes to broadcast
        editor.onDidChangeModelContent((event: any) => {
        const code = editor.getValue();
        socketRef.current.emit("code-change", {
        slug: "your-room-slug",
        code: code,
        });
    });

        // 4. Listen for incoming changes from others
        socketRef.current.on("receive-code", (newCode: string) => {
            if (newCode !== editor.getValue()) {
            // Important: Only update if the code is actually different to avoid loops
            editor.setValue(newCode);
            }
        });


        editor.current = editor;
        // console.log("")
        editor.focus();
    };

    return (
        <Editor 
        height="500px"
        defaultLanguage="javascript"
        defaultValue="// you can write your code here..."
        theme="vs-dark"
        onMount={HandlerEditorOnMount}
        options={{
        fontSize: 14,
        fontFamily: "Fira Code, monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        automaticLayout: true,
        tabSize: 2,
        formatOnPaste: true,
        formatOnType: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        smoothScrolling: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        parameterHints: { enabled: true },
    }}
      />
    );
};