"use client"

import Editor ,{OnMount} from '@monaco-editor/react';
import {useRef,useEffect} from 'react';
import {io ,Socket} from 'socket.io-client';

export default function CodeEditor( {language,Slug}:{language:string,Slug:string})
{
    const editorRef = useRef<any>(null);
    const socketRef = useRef<any>(null);
    
    const isReceiving = useRef<boolean>(false); //  this is the lock that wil prevent infinite loop

        useEffect(()=>
        {
            
                // //initailizing the socket connection
                // socketRef.current= io(process.env.NEXT_PUBLIC_SOCKET_URL);
                // //join the specific room
                // socketRef.current.emit("join-room", { slug: Slug });

            // initialize the socket server
            const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

            socketRef.current = io(socketUrl,{
            transports: ["websocket"]});

            // 2. JOIN: Tell the server which room we are in
            socketRef.current.emit("join-room", { slug: Slug });
            
            // 3. RECEIVE CODE: 
            socketRef.current.on('receive-code',(new_code:string) =>
            {
                if(editorRef.current)
                {
                    if(new_code !== editorRef.current.getValue())
                    {
                        isReceiving.current = true; // setting lock
                        editorRef.current.setValue(new_code);
                        isReceiving.current = false; // release lock
                    }
                }
                
            });

            // 4. CLEANUP: Disconnect if the user leaves the page
            return () => {
            socketRef.current?.disconnect();
            };

        },[Slug]); // when the room changes so does the slug


        const handleEditorDidMount = (editor: any) => 
        {
            // Save the editor instance so we can read from it later
            editorRef.current = editor;

            // 4. RECEIVE: Listen for incoming code from other users
            socketRef.current?.on("receive-code", (newCode: string) => {
            // CRITICAL: Only update if the code is actually different to prevent infinite loops
            if (newCode !== editor.getValue()) 
            {
                isReceiving.current = true; //setting the lock

                editor.setValue(newCode);
            
                isReceiving.current = false; // release the lock
            }
            });
        };

         const handleEditorChange = () =>
         {
            const code = editorRef.current?.getValue();
            
            if(isReceiving.current) return ; // if the lock is set 
            
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