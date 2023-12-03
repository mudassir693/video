// import axios from 'axios';
// import React, { useRef, useEffect } from 'react';

// function App() {
//   let videoRef = useRef(null);

//   useEffect(() => {
//     axios({
//       url: `http://localhost:4000/images/0/${1024*1024*5}`,
//       method: 'GET',
//       responseType: 'arraybuffer', // Set the response type to arraybuffer
//     })
//       .then(async (res) => {
//         console.log(res.data)
//         const blob = new Blob([res.data], { type: 'video/mp4' });
//         const videoUrl = URL.createObjectURL(blob);
//         console.log(videoUrl)
//         // Set the blob URL as the video source
//         videoRef.current.src = videoUrl;
//         // videoRef.current.autoplay = true;
//       }) // Return the promise here
//       .catch((error) => {
//         console.error(error);
//       });
//   }, []); 
  

//   let callFunctions = ()=>{
//     axios({
//       url: `http://localhost:4000/images/${1024*1024*5}/${1024*1024*5*2}`,
//       method: 'GET',
//       responseType: 'arraybuffer', // Set the response type to arraybuffer
//     })
//       .then(async (res) => {
//         console.log(res.data)
//         const blob = new Blob([res.data], { type: 'video/mp4' });
//         const videoUrl = URL.createObjectURL(blob);
//         console.log(videoUrl)
//         // Set the blob URL as the video source
//         videoRef.current.src = videoUrl;
//         // videoRef.current.autoplay = true;
//       }) // Return the promise here
//       .catch((error) => {
//         console.error(error);
//       });
//   }
  
//   const handleTimeUpdate = async () => {
//     // Get the current time of the video
//     const currentTime = videoRef.current.currentTime;
//     console.log("this update fn hit")

//     // Check if 5 seconds have passed (you can adjust the interval as needed)
//     if (currentTime >= 3 && currentTime % 3 < 0.1) {
//       // Trigger your action here
//       await callFunctions()
//       console.log('Triggered at', currentTime, 'seconds');
//     }
//   };

//   useEffect(() => {
//     // Add event listener for the timeupdate event
//     if (videoRef.current) {
//       videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
//     }

//     // Clean up the event listener when the component is unmounted
//     return () => {
//       if (videoRef.current) {
//         videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
//       }
//     };
//   }, []); 

//   let currentTime = ()=>{
//     console.log(videoRef.current.currentTime)
//   }
//   return (
//     <div className="App">
//       <video ref={videoRef} width='320' height='500' autoplay controls loop>
//         {/* No need for a source tag here */}
//       </video>

//       <button onClick={currentTime}>current time</button>
//     </div>
//   );
// }

// export default App;


// This code work partially
import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';

function App() {
  let videoRef = useRef(null);
  let [allowed, setAllowed] = useState(true)
  const mediaSourceRef = useRef(new MediaSource());

  let [counter, setCounter] = useState(0)
  const [videoChunks, setVideoChunks] = useState([]);
  let sourceBuffer;
  let [prev, setPrev] = useState([])

  useEffect(() => {
    // Initial API call to fetch the first chunk of video
    fetchVideoChunk(0, 1024 * 1024 * 5, 0);
  }, []);

  const appendVideoChunk = (chunk, countp) => {
    console.log(chunk)
    const blob = new Blob([chunk], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    videoRef.current.src = url
    videoRef.current.autoPlay = true
    return 
    console.log(countp ,videoRef.current)
    if (videoRef.current && countp == 0) {
      console.log('Ops')
      videoRef.current.src = url;
    } else {
      console.log('nest')
      setVideoChunks([...videoChunks, chunk]);
    }
  };

  // Function to fetch video chunk based on start and end parameters
  const fetchVideoChunk = (start, end, count) => {
    axios({
      url: `http://localhost:4500/videos`,
      method: 'GET',
      responseType: 'arraybuffer',
    })
      .then(async (res) => {
        console.log('fetched completed')
        // Create a Blob from the response data
        console.log(res.data)
        console.log(prev)
        sourceBuffer

        // appendVideoChunk(res.data, count)
        console.log('this shit..')
        setCounter(1)
        const blob = new Blob([...prev,res.data], { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(blob);
        console.log(videoUrl)
        setPrev((prevs)=>[...prevs,res.data])
        
        // Set the chunk as the new video source
        if(allowed){
          console.log('is it hit')
          videoRef.current.src = URL.createObjectURL(mediaSourceRef);
        }
        console.log("successfully load a video")
      })
      .catch((error) => {
        console.error(error);
      });

  };

  // Event handler to check current time and fetch new chunks when needed
  const handleTimeUpdate = async () => {
    const currentTime = videoRef.current.currentTime;

    // Check if 5 seconds have passed (or any desired interval)
    if (currentTime >= 5 && currentTime % 5 < 0.2) {
      // Calculate new start and end parameters based on your logic
      const newStart = 1024 * 1024 * 5; // Example: start from the nearest second
      const newEnd =  1024 * 1024 * 10 ; // Example: fetch the next 5 MB chunk

      console.log('fetching from : ',newStart+"-"+newEnd)
      // Fetch the new chunk of video
      setCounter(1)
      fetchVideoChunk(newStart, newEnd, 100);
      setAllowed(false)
    }
  };

  useEffect(() => {
    // Add event listener for the timeupdate event
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }

    // Clean up the event listener when the component is unmounted
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, []);

  let currentTime = () => {
    console.log(videoRef.current.currentTime);
  };

  const loadVideo = () => {
    console.log("hello")
    const chunks = videoChunks.map((chunk) => new Blob([chunk], { type: 'video/mp4' }));
    console.log(chunks)
    const blob = new Blob(chunks, { type: 'video/mp4' });
    console.log(blob)
    const url = URL.createObjectURL(blob);

    if (videoRef.current) {
      videoRef.current.src = url;
    }
  };

  return (
    <div className="App">
      <video ref={videoRef} width='320' height='500' autoPlay controls />
      <button onClick={currentTime}>Current Time</button>
      <button onClick={loadVideo}>Load content</button>
    </div>
  );
}

export default App;
// import axios from 'axios';
// import React, { useRef, useEffect, useState } from 'react';

// function App() {
//   const videoRef = useRef(null);
//   const mediaSourceRef = useRef(new MediaSource());
//   const sourceBufferRef = useRef(null);
//   const [allowed, setAllowed] = useState(true);

//   useEffect(() => {
//     const initializeVideo = async () => {
//       mediaSourceRef.current.addEventListener('sourceopen', () => {
//         console.log('Media source open');
//         sourceBufferRef.current = mediaSourceRef.current.addSourceBuffer('video/mp4; codecs="avc1.42E01E"');
//         sourceBufferRef.current.addEventListener('updateend', () => {
//           if (allowed) {
//             fetchAndAppendVideoChunk().catch((error) => {
//               console.error('Error fetching or appending next video chunk:', error);
//             });
//             setAllowed(false);
//           }
//         });
//       });

//       videoRef.current.src = URL.createObjectURL(mediaSourceRef.current);
//       try {
//         const response = await axios.get(`http://localhost:4000/images/${0}/${1024 * 1024 * 5}`, {
//           responseType: 'arraybuffer',
//         });
//         const initialChunk = response.data;
//         sourceBufferRef.current.appendBuffer(initialChunk);
//         console.log('Initial video chunk appended.');
//       } catch (error) {
//         console.error('Error fetching initial video chunk:', error);
//       }
//     };

//     initializeVideo();
//   }, []);

//   const fetchAndAppendVideoChunk = async () => {
//     try {
//       const response = await axios.get(`http://localhost:4000/images/${1024 * 1024 * 5}/${1024 * 1024 * 5 * 2}`, {
//         responseType: 'arraybuffer',
//       });
//       const chunk = response.data;
//       console.log(`Fetched video chunk of size: ${chunk.byteLength} bytes`);
//       sourceBufferRef.current.appendBuffer(chunk);
//       console.log('Video chunk appended successfully.');
//     } catch (error) {
//       console.error('Error fetching or appending next video chunk:', error);
//       // You can handle the error here, e.g., retry fetching the chunk after a delay
//     }
//   };

//   const currentTime = () => {
//     console.log(videoRef.current.currentTime);
//   };

//   return (
//     <div className="App">
//       <video ref={videoRef} width="320" height="500" autoPlay controls />
//       <button onClick={currentTime}>Current Time</button>
//     </div>
//   );
// }

// export default App;



