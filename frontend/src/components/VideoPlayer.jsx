import React from 'react';

const VideoPlayer = ({ videoUrl, poster }) => {
  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-xl aspect-video w-full">
      <video 
        controls 
        className="w-full h-full"
        poster={poster || "https://placehold.co/600x400?text=Video+Thumbnail"}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;