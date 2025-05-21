import React, { useEffect, useRef } from "react";
import { FiInfo } from "react-icons/fi";

const WebcamFeed = ({ videoRef }: any) => {
  const localVideoRef = useRef(null);
  const usedVideoRef = videoRef || localVideoRef; // Use passed ref if available

  useEffect(() => {
    let stream: any = null;

    const startStream = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          const video = usedVideoRef.current;
          if (video) {
            video.srcObject = stream;
            video.play();
          }
        }
      } catch (error) {
        console.error("Error accessing the camera", error);
      }
    };

    startStream();

    return () => {
      // Cleanup function to stop the stream
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track: any) => track.stop());
      }
    };
  }, [usedVideoRef]);

  // Green rectangle overlay style (centered in the circle)
  const rectSize = 300;
  const circleSize = 500;
  const rectStyle = {
    position: "absolute" as const,
    top: (circleSize - rectSize) / 2,
    left: (circleSize - rectSize) / 2,
    width: rectSize,
    height: rectSize,
    border: "2px solid #00ff36",
    borderRadius: 8,
    pointerEvents: "none" as const,
    boxSizing: "border-box" as const,
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Heading and subtitle can be added outside this component if needed */}
      <div className="flex items-center justify-center mb-6 mt-2" style={{ position: "relative", width: circleSize, height: circleSize }}>
        <div
          className="flex items-center justify-center rounded-full border-8 border-orange-400 bg-gray-200"
          style={{ width: circleSize, height: circleSize, overflow: "hidden", position: "relative" }}
        >
          <video
            ref={usedVideoRef}
            style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated", transform: "scaleX(-1)" }}
            autoPlay
            playsInline
          ></video>
          {/* Green rectangle overlay */}
          <div style={rectStyle}></div>
        </div>
      </div>
      {/* Info Card */}
      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 w-full max-w-md shadow">
        <FiInfo className="text-orange-400 text-2xl mt-1" />
        <div>
          <div className="font-semibold mb-1 text-sm">Find a Well lit Area</div>
          <div className="text-gray-500 text-xs">
            Make sure you are in a location with good lighting and minimal shadows for optimal recognition
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamFeed;
