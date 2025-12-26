import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import TestUpload from '../components/TestUpload';
import VideoPlayer from '../components/VideoPlayer';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('videos'); 
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get('http://localhost:5000/api/videos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVideos(videoRes.data);

        if (user?.role === 'Admin') {
            const userRes = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsersList(userRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if(user) fetchData();
  }, [user, token]);

  useEffect(() => {
    if (!user) return;
    const socket = io('http://localhost:5000');
    socket.emit('join_room', user._id);
    socket.on('video_progress', (data) => {
      setVideos((prev) => {
        const exists = prev.find(v => v._id === data.videoId);
        return exists 
            ? prev.map((v) => v._id === data.videoId ? { ...v, ...data } : v)
            : prev;
      });
    });
    return () => socket.disconnect();
  }, [user]);

  const handleDeleteVideo = async (videoId) => {
      if(!window.confirm("Are you sure you want to delete this video?")) return;
      try {
          await axios.delete(`http://localhost:5000/api/videos/${videoId}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setVideos(videos.filter(v => v._id !== videoId));
      } catch (error) { alert("Delete failed"); }
  }

  const handleDeleteUser = async (userId) => {
      if(!window.confirm("⚠️ Warning: Removing a user will also delete ALL their videos. Continue?")) return;
      try {
          await axios.delete(`http://localhost:5000/api/users/${userId}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setUsersList(usersList.filter(u => u._id !== userId));
          const videoRes = await axios.get('http://localhost:5000/api/videos', { headers: { Authorization: `Bearer ${token}` } });
          setVideos(videoRes.data);
      } catch (error) { alert("Failed to delete user"); }
  }

  const filteredVideos = videos.filter(video => filter === 'all' || video.sensitivity === filter);

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-gray-900 transition-colors duration-300">
      <Navbar /> 
      
      <div className="max-w-7xl mx-auto p-6">
        
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2 font-sans tracking-tight">
                Dashboard
            </h1>
            <p className="text-[#747474] dark:text-gray-400 font-sans">
                Welcome back, <span className="font-bold text-[teal]">{user?.username}</span>.
            </p>
        </div>

        {user?.role === 'Admin' && (
            <div className="flex gap-4 mb-8 border-b border-[#e0e0e0] dark:border-gray-700">
                <button 
                    onClick={() => setActiveTab('videos')}
                    className={`pb-3 px-4 text-sm font-bold transition border-b-4 ${
                        activeTab === 'videos' 
                        ? 'border-[teal] text-[teal]' 
                        : 'border-transparent text-[#747474] hover:text-black dark:text-gray-400'
                    }`}
                >
                    🎥 Videos
                </button>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`pb-3 px-4 text-sm font-bold transition border-b-4 ${
                        activeTab === 'users' 
                        ? 'border-[teal] text-[teal]' 
                        : 'border-transparent text-[#747474] hover:text-black dark:text-gray-400'
                    }`}
                >
                    👥 User Management
                </button>
            </div>
        )}

        {activeTab === 'videos' && (
        <>
            {(user?.role === 'Editor' || user?.role === 'Admin') ? (
                <div className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-[10px] shadow-[0px_5px_15px_rgba(0,0,0,0.1)]">
                    <TestUpload />
                </div>
            ) : (
                <div className="p-4 mb-8 rounded-[10px] bg-blue-50 border border-blue-200 text-blue-700 font-bold text-center">
                    🔒 Viewer Mode: You have read-only access.
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black dark:text-white">Recent Uploads</h2>
                
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="rounded-[20px] border border-[#c0c0c0] px-[15px] py-[8px] outline-none text-black focus:border-[teal] bg-white cursor-pointer shadow-sm text-sm"
                >
                    <option value="all">All Videos</option>
                    <option value="safe">✅ Safe</option>
                    <option value="flagged">🚩 Flagged</option>
                    <option value="processing">⏳ Processing</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                    <div key={video._id} className="bg-white dark:bg-gray-800 rounded-[10px] shadow-[0px_5px_15px_rgba(0,0,0,0.15)] overflow-hidden transition-transform hover:-translate-y-1 group relative">
                        
                        {user?.role === 'Admin' && (
                            <button 
                                onClick={() => handleDeleteVideo(video._id)}
                                className="absolute top-3 right-3 z-20 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                                title="Delete Video"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        )}

                        <div className="h-48 bg-black relative flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform cursor-pointer" onClick={() => video.status === 'completed' && setSelectedVideo(video)}>
                                <span className="text-white ml-1 text-lg">▶</span>
                            </div>
                            {video.status === 'processing' && (
                                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-[teal] border-t-transparent rounded-full animate-spin mb-2"></div>
                                    <span className="text-[teal] font-bold text-xs tracking-widest">PROCESSING</span>
                                </div>
                            )}
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-black dark:text-white line-clamp-1 text-lg">{video.title}</h3>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                                    video.sensitivity === 'safe' ? 'bg-green-100 text-green-700' :
                                    video.sensitivity === 'flagged' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-600'
                                }`}>{video.sensitivity || '...'}</span>
                            </div>
                            
                            {user?.role === 'Admin' && video.uploader && (
                                <p className="text-xs text-[#747474] dark:text-gray-400 mb-4">By: <span className="text-[teal] font-bold">@{video.uploader.username}</span></p>
                            )}

                            {video.status === 'completed' ? (
                                <button 
                                    onClick={() => setSelectedVideo(video)} 
                                    className="w-full bg-black text-white py-2 rounded-[20px] font-bold text-sm hover:bg-gray-800 transition shadow-md"
                                >
                                    Watch Video
                                </button>
                            ) : (
                                <button disabled className="w-full bg-gray-100 text-gray-400 py-2 rounded-[20px] text-sm font-bold cursor-not-allowed">
                                    Processing...
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
        )}

        {activeTab === 'users' && user?.role === 'Admin' && (
            <div className="bg-white dark:bg-gray-800 rounded-[10px] shadow-[0px_5px_15px_rgba(0,0,0,0.15)] overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-black dark:text-white">Platform Users</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-[#747474] dark:text-gray-300 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Username</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {usersList.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <td className="px-6 py-4 font-bold text-black dark:text-white">{u.username}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-[20px] text-xs font-bold uppercase ${
                                            u.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                            u.role === 'Editor' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>{u.role}</span>
                                    </td>
                                    <td className="px-6 py-4 text-[#747474] text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        {u._id !== user._id && (
                                            <button 
                                                onClick={() => handleDeleteUser(u._id)}
                                                className="text-red-500 hover:text-red-700 font-bold text-xs border border-red-200 bg-red-50 px-3 py-1 rounded-[20px] hover:bg-red-100 transition"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>

      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-[10px] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-lg text-black dark:text-white">{selectedVideo.title}</h3>
              <button 
                onClick={() => setSelectedVideo(null)} 
                className="text-[#747474] hover:text-black font-bold px-3 py-1 transition"
              >
                ✕ CLOSE
              </button>
            </div>
            <VideoPlayer videoUrl={`http://localhost:5000/${selectedVideo.path.replace(/\\/g, "/")}`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;