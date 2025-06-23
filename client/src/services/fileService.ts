import axios from 'axios';

export interface FileMeta { id: string; name: string; size: number; url: string; createdAt: string; }

export const uploadFile = async (file: File): Promise<FileMeta> => {
  const form = new FormData();
  form.append('file', file);
  form.append('name', file.name);
  const response = await axios.post<{ id: string, name: string, size: number, url: string, createdAt: string }>('/api/files/upload', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export const fetchFiles = async (): Promise<FileMeta[]> => {
  const response = await axios.get<FileMeta[]>('/api/files');
  
  if(Array.isArray(response.data)) {
    return response.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if(response.data && typeof response.data === 'object' && Array.isArray((response.data as any).files)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response.data as any).files;
  }
  return [];
}


export const deleteFile = async (id: string): Promise<void> => {
  await axios.delete(`/api/files/${id}`);
}