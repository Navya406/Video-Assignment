import { useState } from 'react';
import axios from 'axios';

const TestUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    // 1. Get Token Automatically from Browser Storage
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', file.name); // Use filename as title by default

    try {
      setUploading(true);
      await axios.post('http://localhost:5000/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // <--- Auto-inserted here
        }
      });
      // We don't need an alert here because the Socket will show the "Processing" status immediately
      setFile(null); // Clear the file input
      
      // Reset the file input visually
      document.getElementById('fileInput').value = ""; 
      
    } catch (error) {
      console.error(error);
      alert('❌ Upload Failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Upload New Video</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* File Input */}
        <input 
          id="fileInput"
          type="file" 
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])} 
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        
        {/* Upload Button */}
        <button 
          onClick={handleUpload} 
          disabled={uploading || !file}
          className={`w-full sm:w-auto py-2 px-6 rounded-lg text-white font-semibold transition
            ${uploading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default TestUpload;