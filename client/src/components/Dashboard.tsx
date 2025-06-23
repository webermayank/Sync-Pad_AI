import React, { useEffect, useState } from 'react';
import { fetchFiles, uploadFile, deleteFile, type FileMeta } from '../services/fileService';
import '../styles/dashboard.css';

export default function Dashboard() {
    const [files, setFiles] = useState<FileMeta[]>([]);
    const [selected, setSelected] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const[displayName, setDisplayName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const loadFiles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFiles();
            setFiles(data);
        } catch (err) {
            console.error(err);
            setError('Could not load files.');
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const handleUpload = async () => {
        if (!selected) return;
        if(!displayName?.trim()) {
            setError('Please enter a display name for the file.');
            return;}
        setError(null);
        try {
            await uploadFile(selected);
            setSelected(null);
            setDisplayName('');
            await loadFiles();
        } catch (err) {
            console.error(err);
            setError('Upload failed.');
        }
    };

    const handleDelete = async (id: string) => {
        setError(null);
        try {
            await deleteFile(id);
            await loadFiles();
        } catch (err) {
            console.error(err);
            setError('Delete failed.');
        }
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Your Files</h2>

            <div className="dashboard-upload-row">
                <input type="text" placeholder='Enter file name' value={displayName} onChange={e=>setDisplayName(e.target.value)}
                className='disply-name-input'
                />
                <input
                    type="file"
                    onChange={e => setSelected(e.target.files ? e.target.files[0] : null)}
                />
                <button
                    onClick={handleUpload}
                    disabled={!selected}
                    className="dashboard-upload-btn"
                >
                    Upload
                </button>
            </div>

            {error && <div className="dashboard-error">{error}</div>}
            {loading ? (
                <div>Loading files...</div>
            ) : files.length === 0 ? (
                <div>No files uploaded yet.</div>
            ) : (
                <ul className="dashboard-files-list">
                    {files.map(f => (
                        <li key={f.id} className="dashboard-file-row">
                            <a
                                href={f.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dashboard-file-link"
                            >
                                {f.name}
                            </a>
                            <button
                                onClick={() => handleDelete(f.id)}
                                className="dashboard-delete-btn"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
