import React, { useState } from "react";
import ReactMarkdown, { type Components } from 'react-markdown';
import Toolbar from "../components/Toolbar";
import Editor from "../components/Editor";
import Sidebar from "../components/Sidebar";
import { type Mode } from "../components/ModeToggle";
import "../styles/editor.css";


type ReactMarkdownComponents = Components;
type HeadingProps = React.ComponentProps<'h1'>;
type ParagraphProps = React.ComponentProps<'p'>;
type LinkProps = React.ComponentProps<'a'>;
type ListProps = React.ComponentProps<'ul'>;
type OrderedListProps = React.ComponentProps<'ol'>;
type ListItemProps = React.ComponentProps<'li'>;

interface CodeProps extends React.ComponentProps<'code'> {
  inline?: boolean;
}

const EditorPage: React.FC = () => {
  const [content, setContent] = useState<string>("");  // holds Markdown text
  const [selection, setSelection] = useState<{
    text: string;
    rect: DOMRect;
  } | null>(null);
  const [aiOutput, setAiOutput] = useState<string>(""); // AI-generated Markdown
  const [mode, setMode] = useState<Mode>('normal');




  const handleApply = () => {
    if (aiOutput) {
    
      setContent((prevContent) => {
        // If previous content non-empty, separate by two newlines so Markdown blocks are distinct
        const separator = prevContent.trim() ? '\n\n' : '';
        return prevContent + separator + aiOutput.trim();
      });
    }
  
    setAiOutput("");
  
  
  };

  const handleDiscard = () => {
    setAiOutput("");
  };

  const handleNewChunk = (chunk: string) => {
    setAiOutput((prevOutput) => prevOutput + chunk);
  };

  const handleNewAIResponse = () => {
    setAiOutput("");
  };

  // Custom renderers for ReactMarkdown preview
  const markdownComponents: ReactMarkdownComponents = {
    h1: ({ children, ...props }: HeadingProps) => (
      <h1 {...props} className="markdown-h1">{children}</h1>
    ),
    h2: ({ children, ...props }: HeadingProps) => (
      <h2 {...props} className="markdown-h2">{children}</h2>
    ),
    h3: ({ children, ...props }: HeadingProps) => (
      <h3 {...props} className="markdown-h3">{children}</h3>
    ),
    code: ({ inline, children, ...props }: CodeProps) => {
      if (inline) {
        return <code {...props} className="markdown-inline-code">{children}</code>;
      }
      return (
        <pre className="markdown-code-block">
          <code {...props}>{children}</code>
        </pre>
      );
    },
    ul: ({ children, ...props }: ListProps) => (
      <ul {...props} className="markdown-ul">{children}</ul>
    ),
    ol: ({ children, ...props }: OrderedListProps) => (
      <ol {...props} className="markdown-ol">{children}</ol>
    ),
    li: ({ children, ...props }: ListItemProps) => (
      <li {...props} className="markdown-li">{children}</li>
    ),
    p: ({ children, ...props }: ParagraphProps) => (
      <p {...props} className="markdown-p">{children}</p>
    ),
    a: ({ href, children, ...props }: LinkProps) => (
      <a
        {...props}
        href={href}
        className="markdown-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    em: ({ children, ...props }: React.ComponentProps<'em'>) => (
      <em {...props} className="markdown-em">{children}</em>
    ),
    strong: ({ children, ...props }: React.ComponentProps<'strong'>) => (
      <strong {...props} className="markdown-strong">{children}</strong>
    ),
  
  };

  return (
    <div className="editor-page">
      <Toolbar
        content={content}
        setContent={setContent}
        mode={mode}
        setMode={setMode}
      />

      <div className="editor-container">
        <div className="editor-main">
        
          <Editor
            content={content}
            setContent={setContent}
            onSelectText={(text, rect) => setSelection({ text, rect })}
         
          />

          {selection && (
            <Sidebar
              selection={selection}
              mode={mode}
              onClose={() => setSelection(null)}
              onChunk={handleNewChunk}
              onStart={handleNewAIResponse}
            />
          )}
        </div>

        {/* AI Output Preview + Actions */}
        {aiOutput && (
          <div className="editor-output">
            <div className="editor-output__content">
              {/* Preview the AI-generated Markdown */}
              <ReactMarkdown components={markdownComponents}>
                {aiOutput}
              </ReactMarkdown>
            </div>
            <div className="editor-output__actions">
              <button
                className="editor-output__button"
                onClick={handleApply}
              >
                Apply
              </button>
              <button
                className="editor-output__button editor-output__button--discard"
                onClick={handleDiscard}
              >
                Discard
              </button>
            </div>
          </div>
        )}
      </div>
     
    </div>
  );
};

export default EditorPage;
