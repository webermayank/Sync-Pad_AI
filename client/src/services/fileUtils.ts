export interface savedFile{
    id: string;
    name: string;
    size: number;
    url?: string;
    createdAt: string;
}

export interface saveFileOptions {
    saveToCloud: boolean;
    downloadLocal: boolean;
    fileName: string;
    content: string;
}

//save file to local stroage
export const saveToLocal = (content: string, filename: string): void=>{
    const blob = new Blob([content], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

//creating a file object from content
export const createFileFromContent = (content: string, fileName: string): File => {
    const blob = new Blob([content], { type: "text/plain" });
    return new File([blob], `${fileName}.txt`, { type: "text/plain" });
  };

/**
* Validate file name
*/
export const validateFileName = (fileName: string): { isValid: boolean; error?: string } => {
    if (!fileName.trim()) {
        return { isValid: false, error: "Please enter a file name" };
    }

    if (fileName.length > 50) {
        return { isValid: false, error: "File name must be less than 50 characters" };
    }

    // Check for invalid characters
    const validNameRegex = /^[a-zA-Z0-9_-\s]+$/;
    if (!validNameRegex.test(fileName)) {
        return { isValid: false, error: "File name can only contain letters, numbers, spaces, underscores, and dashes" };
    }

    return { isValid: true };
  };