"use client"

import Editor from '@monaco-editor/react';
import { useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';

// 1. MATCH THE BACKEND CONTRACT EXACTLY
interface ServerToClientEvents {
  "yjs-update": (code: Uint8Array) => void;
}

interface ClientToServerEvents {
  "join-room": (data: { slug: string }) => void;
  "yjs-update": (data: { slug: string; code: Uint8Array }) => void;
}

export default function CodeEditor({ language, Slug }: { language: string, Slug: string }) {
    const editorRef = useRef<any>(null);
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    
    // 2. NEW STATE: Hold the Math Document and the Visual Bridge
    const ydocRef = useRef<Y.Doc | null>(null);
    const bindingRef = useRef<MonacoBinding | null>(null);

    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
        const socket = io(socketUrl, { transports: ["websocket"] });
        socketRef.current = socket;

        // Initialize the local math engine
        const ydoc = new Y.Doc();
        ydocRef.current = ydoc;

        socket.emit("join-room", { slug: Slug });

        // 3. RECEIVE FROM NETWORK
        socket.on('yjs-update', (code) => {
            // Apply the server's binary math to our local document.
            // "network" is our tag so Yjs knows not to echo this back!
            Y.applyUpdate(ydoc, new Uint8Array(code), "network");
        });

        // 4. SEND TO NETWORK
        ydoc.on('update', (update, origin) => {
            // This replaces your manual 'isReceiving' lock!
            if (origin !== "network") {
                socket.emit('yjs-update', { slug: Slug, code: update });
            }
        });

        return () => {
            socket.off("yjs-update");
            socket.disconnect();
            bindingRef.current?.destroy();
            ydoc.destroy();
        };
    }, [Slug]); 

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;

        if (ydocRef.current) {
            // 5. THE MAGIC BRIDGE
            // We tell Yjs to create a text field tracking object named "monaco"
            const ytext = ydocRef.current.getText("monaco");
            
            // We bind that invisible math object directly to the visible editor UI
            bindingRef.current = new MonacoBinding(
                ytext, 
                editor.getModel(), 
                new Set([editor])
            );
        }
    };

    return (
        <div className="w-full h-full rounded-lg overflow-hidden border border-slate-700">
            <Editor 
                height="80vh"
                defaultLanguage={language}
                theme="vs-dark"
                onMount={handleEditorDidMount}
                // Notice: No onChange, no defaultValue, no manual locks.
                // Yjs completely drives the car now.
                options={{
                    fontSize: 14,
                    fontFamily: "Fira Code, monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    automaticLayout: true,
                    tabSize: 2,
                }}
            />
        </div>
    );
}