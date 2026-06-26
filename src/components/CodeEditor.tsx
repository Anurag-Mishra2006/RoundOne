import { Editor, type Monaco } from '@monaco-editor/react';

interface CodeEditorProps {
    value: string,
    language: string,
    onChange: (code: string | undefined) => void,
    onMount? : (editor: any, monaco: Monaco)=>void // this is added for formating code
}

function CodeEditor({ value, language, onChange, onMount }: CodeEditorProps) {
    // changing the theme - having theme other than vs-dark
    // but we will use vs-dark as our base - start with dark theme
    const handleEditorWillMount = (monaco: Monaco) => {
        // naya theme bana rhe having name roundOneTheme
        monaco.editor.defineTheme('round-one-theme', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                // we color the actual code text here
                { token: 'comment', foreground: '6272a4', fontStyle: 'italic' }, // Gray-blue italics
                { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' },   // Pink/Magenta
                { token: 'string', foreground: 'f1fa8c' },                       // Yellow
                { token: 'number', foreground: 'bd93f9' },                       // Purple
                { token: 'identifier', foreground: '8be9fd' }
            ],
            colors: {
                // Here we color the UI of the editor (background, line numbers, etc.)
                'editor.background': '#1e1e24',                    
                'editor.lineHighlightBackground': '#2c313c',      
                'editorLineNumber.foreground': '#4b5263',          
                'editor.selectionBackground': '#3e4451',         
            }
        });
        // {TODO : WRITE CUSTOM FORMATING CODE REQUESTING BACKEND}
        // const customFormatDocument = {}
        // registration for languages requesting to backend for formating
        // monaco.languages.registerDocumentFormattingEditProvider('cpp', customFormatDocument);
    }

    const editorOptions = {
        minimap: { enabled: false },        
        fontSize: 16,                       
        wordWrap: "on" as const,            
        padding: { top: 20, bottom: 20 },   
        smoothScrolling: true,             
        cursorBlinking: "smooth" as const,  
        formatOnType: true,                 
        lineHeight: 26,                     
        scrollBeyondLastLine: false,        
    };

    return (
         <div style={{ height: '600px', width: '100%', borderRadius: '8px', border: '1px solid #4b5263', backgroundColor: '#1e1e24', overflow: 'hidden' }}>
            <Editor height="100%" language={language}
                value={value}
                theme='round-one-theme'
                options={editorOptions}
                onChange={(code) => onChange(code)}
                beforeMount={handleEditorWillMount}
                onMount={onMount}
            />
        </div>
    )
}

export default CodeEditor
