import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';

const VideoPlayer = () => {
  const playerRef = useRef(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const [isBuffering, setIsBuffering] = useState(false);

//   const fetchVideoChunk = (start, end) => {
//     axios({
//       url: `http://localhost:4000/images/${start}/${end}`,
//       method: 'GET',
//       responseType: 'arraybuffer',
//     })
//       .then(async (res) => {
//         console.log('fetched completed');
//         const blob = new Blob([res.data], { type: 'video/mp4' });
//         const videoUrl = URL.createObjectURL(blob);
//         playerRef.current.src = videoUrl;
//         console.log(videoUrl);
//         console.log('successfully loaded a video');
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

const fetchVideoChunk = async (start, end) => {
    try {
      // const response = await axios.get(`http://localhost:4000/images/${start}/${end}`, {
      //   responseType: 'arraybuffer',
      // });
      // const chunk = response.data;
      // console.log([...videoChunks, URL.createObjectURL(new Blob([chunk], { type: 'video/mp4' }))])
      // setVideoChunks(prevChunks => [...prevChunks, URL.createObjectURL(new Blob([chunk], { type: 'video/mp4' }))]);
    } catch (error) {
      console.error('Error fetching video chunk:', error);
    }
  };

  const handleBuffer = (e) => {
    setIsBuffering(e.target.getVideoInfo().buffered > 0);
  };

  useEffect(() => {
    // Fetch initial video chunk when component mounts
    fetchVideoChunk(0, 1024 * 1024 * 10);
  }, []); // Empty dependency array ensures this runs once after initial render

  let handleProgress = (progress)=>{
    console.log('this progress: ', progress)
    if(Math.floor(progress.playedSeconds) == 7){
        console.log('this is 7 second')
        fetchVideoChunk(1024 * 1024 * 5+1, 1024 * 1024 * 9)
    }
  }

  

  return (
    <div>
      <ReactPlayer
        url={`https://d2rhyzz48iddmi.cloudfront.net/influenzers-video-limit-test.mp4`}
        ref={playerRef}
        controls
        onBuffer={handleBuffer}
        // onProgress={handleProgress}
        onPause={() => {
          // Check if buffering is ongoing
          if (isBuffering) {
            // Wait until buffering is complete before resuming playback
            const checkBuffering = setInterval(() => {
              if (!isBuffering) {
                clearInterval(checkBuffering);
                // Resume playback when buffering is complete
                playerRef.current.seekTo(playerRef.current.getCurrentTime() + 0.1, 'seconds');
              }
            }, 1000); // Check buffering state every second
          }
        }}
      />
    </div>
  );


};

export default VideoPlayer;
