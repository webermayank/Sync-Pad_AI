import React, { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react';

const FileContentContext = createContext<{
    content: string;
    setContent:Dispatch<SetStateAction<string>>;
}>({
    content: '',
    setContent: () => { },
});

export const useFileContent = () => useContext(FileContentContext);

export const FileContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [content, setContent] = useState('');
    return (
        <FileContentContext.Provider value={{ content, setContent }}>
            {children}
        </FileContentContext.Provider>
    );
};