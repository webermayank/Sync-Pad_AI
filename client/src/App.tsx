import React, { useState } from 'react';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [selection, setSelection] = useState<{ text: string; rect: DOMRect } | null>(null);

  return (
    <div className="h-screen flex flex-col">
      <Toolbar content={content} setContent={setContent} />
      <div className="flex-1 relative">
        <Editor
          content={content}
          setContent={setContent}
          onSelectText={(text, rect) => setSelection({ text, rect })}
        />
        {selection && (
          <Sidebar
            selection={selection}
            onClose={() => setSelection(null)}
            appendResponse={(resp) => setContent((c) => c + '\n' + resp)}
          />
        )}
      </div>
    </div>
  );
};
export default App;