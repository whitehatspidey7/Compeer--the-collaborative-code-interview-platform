"use client"

import Editor ,{OnMount} from '@monaco-editor/react';
import {useRef} from 'react';


export default function CodeEditor( {language}:{language:string})
{
    const editorRef = useRef<any>(null);

    const HandlerEditorOnMount = (editor:any)=>
    {
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