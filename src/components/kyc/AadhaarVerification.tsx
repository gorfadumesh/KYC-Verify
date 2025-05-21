import React from "react";
import { Button } from "../ui/button";
import { FiArrowLeft, FiSun, FiUser, FiEye, FiSmile } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function AadhaarVerification({
  onNextStep,
}: {
  onNextStep: () => void;
}) {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <FiSun className="text-orange-400 text-2xl" />, // Well-lit area
      title: "Find A Well-Lit Area",
      desc: "Make sure you are in a location with good lighting and minimal shadows for optimal facial recognition",
    },
    {
      icon: <FiUser className="text-orange-400 text-2xl" />, // Position face
      title: "Position Your Face",
      desc: "Keep your face centered and maintain a comfortable distance from the camera. Avoid excessive tilting or turning of your head",
    },
    {
      icon: <FiEye className="text-orange-400 text-2xl" />, // Clear view
      title: "Clear View Of Your Face",
      desc: "Remove any items that might obstruct your face such as glasses, face masks, or hats for better recognition",
    },
    {
      icon: <FiSmile className="text-orange-400 text-2xl" />, // Stay still
      title: "Stay Still",
      desc: "Hold your device steady and keep your head still during the authentication process for a successful scan",
    },
  ];

  return (
    <div className="flex flex-col  bg-white px-4 pt-4 pb-8">
      {/* Back Arrow */}
      {/* <button className="mb-4 self-start" aria-label="Back">
        <FiArrowLeft className="text-2xl text-gray-500" />
      </button> */}
      {/* Heading */}
      <h2 className="text-2xl font-bold mb-2">Prepare for camera</h2>
      <p className="text-gray-500 mb-6 max-w-lg">
        In a moment, we'll ask you to take a selfie by smiling, this will let us know it's really you
      </p>
      {/* Steps Card */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8 max-w-lg w-full mx-auto">
        {steps.map((step, idx) => (
          <div key={step.title} className={`flex items-start gap-4 mb-6 last:mb-0`}>
            <div>{step.icon}</div>
            <div>
              <div className="font-semibold mb-1">{step.title}</div>
              <div className="text-gray-500 text-sm leading-snug">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Confirm Button */}
      <div className="mt-auto w-full max-w-lg mx-auto">
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold flex items-center justify-center gap-2 rounded-full py-3"
          onClick={onNextStep}
        >
          Confirm
          <FiArrowLeft style={{ transform: 'rotate(180deg)' }} className="text-2xl" />
        </Button>
      </div>
    </div>
  );
}
