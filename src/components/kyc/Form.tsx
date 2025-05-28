import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { FiUpload, FiX } from "react-icons/fi";

export default function IDCardUploadForm({ onNextStep }: { onNextStep: () => void }) {
  const { t } = useTranslation();
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIdFront(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setIdFrontPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setIdFrontPreview(null);
    }
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIdBack(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setIdBackPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setIdBackPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFront || !idBack) return;
    setLoading(true);

    // Convert images to base64
    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    };

    try {
      const idFrontBase64 = await fileToBase64(idFront);
      const idBackBase64 = await fileToBase64(idBack);

      // Store images in localStorage
      localStorage.setItem("kyc-id-front", idFrontBase64);
      localStorage.setItem("kyc-id-back", idBackBase64);
      onNextStep();
    } catch (error) {
      console.error("Error processing images:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col gap-2 mx-auto justify-center my-2 w-full max-w-md">
        <h2 className="text-xl font-semibold">{t("Upload your ID Card")}</h2>
        <span className="text-md">{t("Upload the front and back of your ID Card")}</span>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 mx-auto justify-center my-10 w-full max-w-md"
        encType="multipart/form-data"
      >
        <div>
          <label className="block font-medium mb-2">{t("ID Card Front Side")}</label>
          {!idFrontPreview ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition">
              <FiUpload className="text-3xl text-orange-400 mb-2" />
              <span className="text-gray-500 text-sm mb-1">Choose file</span>
              <span className="text-xs text-gray-400">PNG, JPG, JPEG</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFrontChange}
                required
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative w-full h-32">
              <img
                src={idFrontPreview}
                alt="ID Card Front Preview"
                className="object-cover w-full h-full rounded-lg border"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                onClick={() => {
                  setIdFront(null);
                  setIdFrontPreview(null);
                }}
                aria-label="Remove image"
              >
                <FiX className="text-gray-600" />
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2">{t("ID Card Back Side")}</label>
          {!idBackPreview ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition">
              <FiUpload className="text-3xl text-orange-400 mb-2" />
              <span className="text-gray-500 text-sm mb-1">Choose file</span>
              <span className="text-xs text-gray-400">PNG, JPG, JPEG</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleBackChange}
                required
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative w-full h-32">
              <img
                src={idBackPreview}
                alt="ID Card Back Preview"
                className="object-cover w-full h-full rounded-lg border"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                onClick={() => {
                  setIdBack(null);
                  setIdBackPreview(null);
                }}
                aria-label="Remove image"
              >
                <FiX className="text-gray-600" />
              </button>
            </div>
          )}
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold flex items-center justify-center gap-2 rounded-full py-3"
          type="submit"
          disabled={loading || !idFront || !idBack}
        >
          {loading ? t("Processing, please wait...") : t("Next")}
        </Button>
      </form>
    </div>
  );
}

