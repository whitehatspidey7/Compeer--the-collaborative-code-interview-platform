"use client"

import Editor ,{OnMount} from '@monaco-editor/react';
import {useRef,useEffect} from 'react';
import {io ,Socket} from 'socket.io-client';

export default function CodeEditor( {language,Slug}:{language:string,Slug:string})
{
    const editorRef = useRef<any>(null);
    const socketRef = useRef<any>(null);
    
    
      

        useEffect(()=>{
            
                //initailizing the socket connection
                socketRef.current= io(process.env.NEXT_PUBLIC_SOCKET_URL);
                //join the specific room
                socketRef.current.emit("join-room", { slug: Slug });

            const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
            socketRef.current = io(socketUrl,{
            transports: ["websocket"]});

            // 2. JOIN: Tell the server which room we are in
            socketRef.current.emit("join-room", { slug: Slug });
                
            // 3. CLEANUP: Disconnect if the user leaves the page
            return () => {
            socketRef.current?.disconnect();
            };

        },[Slug]);


        const handleEditorDidMount = (editor: any) => {
        // Save the editor instance so we can read from it later
        editorRef.current = editor;

        // 4. RECEIVE: Listen for incoming code from other users
            socketRef.current?.on("receive-code", (newCode: string) => {
            // CRITICAL: Only update if the code is actually different to prevent infinite loops
            if (newCode !== editor.getValue()) {
                editor.setValue(newCode);
            }
            });
        };

        const handleEditorChange = () => {
    const code = editorRef.current?.getValue();
    
    // 5. BROADCAST: Send our keystrokes to the server
    socketRef.current?.emit("code-change", { slug: Slug, code });
  };
    

    return (
        <Editor 
        height="500px"
        defaultLanguage="javascript"
        defaultValue="// you can write your code here..."
        theme="vs-dark"
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
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