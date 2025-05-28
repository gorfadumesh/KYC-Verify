import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaIdCard, FaPassport } from "react-icons/fa";
import { MdCreditCard } from "react-icons/md";
import { FiArrowRight, FiCamera } from "react-icons/fi";

export default function Dashboard() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<"id" | "passport" | "license" | null>(null);
  const router = useRouter();

  const options = [
    {
      key: "id",
      label: "ID Card",
      icon: <FaIdCard className="text-xl" />,
    },
    {
      key: "passport",
      label: "Passport",
      icon: <FaPassport className="text-xl" />,
    },
    {
      key: "license",
      label: "Driving License",
      icon: <MdCreditCard className="text-xl" />,
    },
  ];

  const handleContinue = () => {
    // Optionally, you can store the selected type in localStorage or context
    // localStorage.setItem("kyc-doc-type", selected);
    router.push("/kyc");
  };

  // Step 1: Onboarding (Verify with Ease)
  if (step === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        {/* Top Illustration */}
        <div className="mb-6">
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/kyc-3d-icon-download-in-png-blend-fbx-gltf-file-formats--bitcoin-logo-document-costumer-id-cryptocurrency-pack-science-technology-icons-9276089.png?f=webp"
            alt="Onboarding Illustration"
            className="w-32 h-32 mx-auto"
          />
        </div>
        {/* Title */}
        <div className="uppercase text-sm font-semibold tracking-widest mb-1">
          COMPLETE <span className="text-orange-500">VERIFICATION</span>
        </div>
        {/* Main Heading */}
        <h2 className="text-3xl font-bold mb-6 text-center">
          Verify <span className="text-orange-500">with E-KYC</span>
        </h2>
        {/* Steps */}
        <div className="w-full max-w-sm space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="mt-1 text-xl text-gray-700">
              <FaIdCard />
            </span>
            <div>
              <div className="font-semibold">Take a picture of your valid ID</div>
              <div className="text-gray-500 text-sm">
                To check your personal informations are correct
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="mt-1 text-xl text-gray-700">
              <FiCamera />
            </span>
            <div>
              <div className="font-semibold">Take a selfie of yourself</div>
              <div className="text-gray-500 text-sm">
                To match your face to your passport or ID Photo
              </div>
            </div>
          </div>
        </div>
        {/* Powered by Faceonlive */}
        {/* <div className="flex items-center gap-3 mb-8">
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-black flex items-center justify-center">
            <span className="w-3 h-3 bg-white rounded-full"></span>
          </span>
          <div>
            <div className="font-semibold text-sm">Powered by Faceonlive</div>
            <div className="text-xs text-gray-500">
              On-premises ID Verification, Biometric Authentication Solution Provider
            </div>
          </div>
        </div> */}
        {/* Footer Note */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6V10L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Your data will be encrypted and stored securely
        </div>
        {/* Confirm Button */}
        <button
          className="w-full max-w-sm bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold flex items-center justify-center gap-2 rounded-full py-3"
          onClick={() => setStep(2)}
        >
          Confirm
          <FiArrowRight className="text-2xl" />
        </button>
        {/* go to verification-list */}
      <div className="mt-6">
        <Link href="/verification-list" className="text-sm text-blue-600 hover:underline">
          View Verification List
        </Link>
    </div>
      </div>
    );
  }

  // Step 2: Document selection
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Top Illustration */}
      <div className="mb-8">
        <img
          src="https://thumb.ac-illust.com/c3/c332ce72fc87cf1e1f2eaa38cd6f3057_t.jpeg"
          alt="ID Card"
          className="w-40 h-32 mx-auto"
        />
      </div>
      {/* Title */}
      <h2 className="text-2xl font-bold mb-2 text-center">Upload proof of your identity</h2>
      {/* Subtitle */}
      <p className="text-gray-500 mb-8 text-center">Please submit a document below</p>
      {/* Options */}
      <div className="w-full max-w-xs space-y-3 mb-8">
        {options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setSelected(opt.key as any)}
            className={`flex items-center w-full p-4 border rounded-lg transition cursor-pointer ${
              selected === opt.key
                ? "bg-orange-50 border-orange-500"
                : "hover:bg-orange-50"
            }`}
          >
            <span className="mr-4">{opt.icon}</span>
            <span className="flex-1 text-left font-medium">{opt.label}</span>
            {selected === opt.key ? (
              <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
            ) : (
              <span className="w-3 h-3 rounded-full border border-gray-300 mr-2"></span>
            )}
            <FiArrowRight className="text-gray-400 text-xl" />
          </button>
        ))}
      </div>
      {/* Footer Note */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6V10L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        Your information is only used for identity verification
      </div>
      {/* Continue Button */}
      <button
        className={`w-full max-w-xs bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold flex items-center justify-center gap-2 rounded-full py-3 transition ${
          !selected ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!selected}
        onClick={handleContinue}
      >
        Continue
        <FiArrowRight className="text-2xl" />
      </button>

      
    </div>
  );
}
