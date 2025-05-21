import React, { useState, useRef, useEffect } from "react";
import WebcamFeed from "@/components/kyc/WebcamFeed";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import "@/components/translations/Translations";
import { useTranslation } from "react-i18next";

interface CaptureFrameProps {
  onNextStep: () => void;
}

const CaptureFrame: React.FC<CaptureFrameProps> = ({ onNextStep }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [portraitImage, setPortraitImage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  // Extract portrait image from HTML content in localStorage
  useEffect(() => {
    const apiResult = JSON.parse(localStorage.getItem("kyc-verification-data") || '{}');
    console.log("apiResult", { apiResult });
    let html = apiResult?.data?.[1] || "";
    // Find the Portrait cell and extract the next <img src=...>
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Get all table rows
    const rows = Array.from(doc.querySelectorAll('tr'));

    for (const row of rows) {
      const cells = row.querySelectorAll('td');

      // Loop through cells to find the one with "Portrait"
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];

        if (cell.textContent?.trim() === 'Portrait') {
          // Check if the next <td> exists and has an <img>
          const nextCell = cells[i + 1];
          if (nextCell) {
            const img = nextCell.querySelector('img');
            if (img && img.src && img.src.startsWith('data:image')) {
              console.log("img.src", img);
              setPortraitImage(img.src);
              return; // Exit loop early once found
            }
          }
        }
      }
    }
  }, []);




  // Show message after 2 seconds
  useEffect(() => {
    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, 2000);
    return () => clearTimeout(messageTimer);
  }, []);

    useEffect(() => {
    canvasRef.current = document.createElement("canvas");
  }, []);

  // Capture image after 3 seconds
  useEffect(() => {
    const captureTimer = setTimeout(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
        const context = canvas.getContext("2d");
        if (!context) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const imageDataUrl = canvas.toDataURL("image/png");
        setCapturedImage(imageDataUrl);
        // Send both images to API
        // sendImagesToApi(imageDataUrl, portraitImage);
      }
    }, 5000);
    return () => clearTimeout(captureTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onNextStep, portraitImage]);

  // Send both images to API
  const sendImagesToApi = async (webcamImage: string | null, portrait: string | null) => {
    if (!webcamImage || !portrait) return;
    try {
      setLoading(true);
      const payload = {
        data: [portrait, webcamImage],
        event_data: null,
        fn_index: 4, // Use the correct fn_index for this API
        session_hash: "orybe0zq5qx"
      };
      const response = await fetch("https://web.kby-ai.com/run/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      localStorage.setItem("kyc-verify-result", JSON.stringify(result));
      onNextStep();
    } catch (error) {
      console.error("Error sending images to API:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("capturedImage", capturedImage);
  console.log("portraitImage", portraitImage);

  return (
    <div className="text-center w-[600px] mx-auto my-10 p-5">
      <h2 className="text-xl font-semibold">{t("Take a Live Photograph")}</h2>
      <p className="text-md">{t("Position your face inside the rectangle")}</p>
      <div className="video-capture-container flex flex-col justify-center">
      {showMessage && (
          <div className="font-semibold text-md my-4 text-red-600">
            {t("Move closer and show your face straight")}
          </div>
        )}
        <WebcamFeed videoRef={videoRef} frameType="photo" />
        {/* upload from file and set to capturedImage */}
        <div className="flex flex-col items-center my-4">
          {!capturedImage ? (
            <label className="flex flex-col items-center justify-center w-56 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition">
              <svg className="text-3xl text-orange-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="32" height="32"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
              <span className="text-gray-500 text-sm mb-1">Upload from file</span>
              <span className="text-xs text-gray-400">PNG, JPG, JPEG</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setCapturedImage(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative w-56 h-40">
              <img
                src={capturedImage}
                alt="Preview"
                className="object-cover w-full h-full rounded-lg border"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                onClick={() => setCapturedImage(null)}
                aria-label="Remove image"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
        </div>
       
        {/* {loading && (
          <div className="font-semibold text-md my-4 text-blue-600">
            {t("Submitting, please wait...")}
          </div>
        )} */}
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold flex items-center justify-center gap-2 rounded-full py-3"
          onClick={() => sendImagesToApi(capturedImage, portraitImage)}
          disabled={loading || !capturedImage || !portraitImage}
        >
          {loading ? t("Processing, please wait...") : t("Verify")}
        </Button>
      </div>

      {/* {portraitImage && <img src={portraitImage} alt="Portrait" />} */}
      {/* {capturedImage && <img src={capturedImage} alt="Captured" />} */}
    </div>
  );
};

export default CaptureFrame;
