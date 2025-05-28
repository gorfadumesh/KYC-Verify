import React, { useState, useRef, useEffect } from "react";
import WebcamFeed from "@/components/kyc/WebcamFeed";
import { Button } from "@/components/ui/button";
import "@/components/translations/Translations";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';

interface CaptureFrameProps {
  onNextStep: () => void;
  idType: string | null;
}

const CaptureFrame: React.FC<CaptureFrameProps> = ({ onNextStep, idType }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [portraitImage, setPortraitImage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [similarity, setSimilarity] = useState<string | null>(null);

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
      }
    }, 5000);
    return () => clearTimeout(captureTimer);
  }, []);

  // Handle both API calls sequentially and store in Supabase
  const handleVerification = async () => {
    if (!capturedImage) return;
    setLoading(true);

    try {
      // First API call - ID Card verification
      const idFront = localStorage.getItem("kyc-id-front");
      const idBack = localStorage.getItem("kyc-id-back");

      if (!idFront || !idBack) {
        throw new Error("ID card images not found");
      }

      const idCardPayload = {
        data: [idFront, idBack],
        event_data: null,
        fn_index: 6,
        session_hash: "orybe0zq5qx"
      };

      const idCardResponse = await fetch("https://web.kby-ai.com/run/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(idCardPayload)
      });

      const idCardResult = await idCardResponse.json();
      localStorage.setItem("kyc-verification-data", JSON.stringify(idCardResult));

      // Extract portrait from the first API response
      const parser = new DOMParser();
      const doc = parser.parseFromString(idCardResult?.data?.[1] || "", 'text/html');
      const rows = Array.from(doc.querySelectorAll('tr'));
      let extractedPortrait = null;

      for (const row of rows) {
        const cells = row.querySelectorAll('td');
        for (let i = 0; i < cells.length; i++) {
          if (cells[i].textContent?.trim() === 'Portrait') {
            const nextCell = cells[i + 1];
            if (nextCell) {
              const img = nextCell.querySelector('img');
              if (img?.src?.startsWith('data:image')) {
                extractedPortrait = img.src;
                break;
              }
            }
          }
        }
        if (extractedPortrait) break;
      }

      if (!extractedPortrait) {
        throw new Error("Portrait extraction failed");
      }

      // Second API call - Face verification
      const faceVerificationPayload = {
        data: [extractedPortrait, capturedImage],
        event_data: null,
        fn_index: 4,
        session_hash: "orybe0zq5qx"
      };

      const faceVerificationResponse = await fetch("https://web.kby-ai.com/run/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faceVerificationPayload)
      });

      const faceVerificationResult = await faceVerificationResponse.json();

      // Store verification data in Supabase
      const apiResult = faceVerificationResult;
      const htmlContent = apiResult?.data?.[0] || '';

      // Use regex to find "Similarity: <value>"
      const match = htmlContent.match(/Similarity:\s*([\d.]+)/i);

      const verificationScore = parseFloat(match?.[1] || '0');

      // Generate a unique user ID
      const generatedUserId = uuidv4();

      // Store verification data in Supabase
      const { data: verificationData, error: verificationError } = await supabase
        .from('verifications')
        .insert([
          {
            user_id: generatedUserId,
            id_type: idType || 'unknown', // Use the passed idType
            verification_score: verificationScore,
            verification_date: new Date().toISOString(),
            status: verificationScore >= 0.50 ? 'verified' : 'rejected',
            id_front_image: idFront,
            id_back_image: idBack,
            selfie_image: capturedImage,
            portrait_image: extractedPortrait,
          }
        ])
        .select();

      if (verificationError) {
        throw new Error(`Error storing verification data: ${verificationError.message}`);
      }

      console.log('Verification data stored:', verificationData);
      onNextStep();
    } catch (error) {
      console.error("Error during verification:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <Button
          className="w-full h-18 mt-6 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold flex items-center justify-center gap-2 rounded-full py-3"
          onClick={handleVerification}
          disabled={loading || !capturedImage}
        >
          {loading ? t("Processing, please wait...") : t("Verify")}
        </Button>
      </div>
    </div>
  );
};

export default CaptureFrame;
