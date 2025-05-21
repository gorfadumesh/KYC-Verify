import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from 'next/dynamic';
import "@/components/translations/Translations";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useEffect, useState } from "react";

const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then(mod => mod.Player), {
  ssr: false
});

const StyledHtmlContent = styled.div`
  margin-bottom: 2rem;
  div, table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    background: #fff;
  }
  th, td {
    border: 1px solid #d1d5db;
    padding: 8px 12px;
    text-align: left;
    font-size: 15px;
  }
  th {
    background: #f3f4f6;
    font-weight: bold;
  }
  tr:nth-child(even) {
    background: #f9fafb;
  }
  tr:hover {
    background: #e5e7eb;
  }
`;

export default function VerifyAndComplete() {
  const { t } = useTranslation();
  const [similarity, setSimilarity] = useState<string | null>(null);
  // Read API response from localStorage
  const apiResult = JSON.parse(localStorage.getItem("kyc-verify-result") || '{}');
  const htmlContent = apiResult?.data?.[0] || '';

  useEffect(() => {
    if (!htmlContent) return;

    // Use regex to find "Similarity: <value>"
    const match = htmlContent.match(/Similarity:\s*([\d.]+)/i);

    if (match && match[1]) {
      setSimilarity(match[1]);
    }
  }, [htmlContent]);

  const isVerificationSuccessful = similarity ? parseFloat(similarity) >= 0.50 : false;

  return (
    <div className="flex flex-col justify-center items-center my-20">
      <StyledHtmlContent>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t("Similarity Score")}</h2>
          <p className="text-md">
            {t("Your similarity score is")} <strong>{similarity}</strong>
          </p>
          <p className="text-md">
            {t("This score indicates the level of similarity between your ID and the live photo.")}
          </p>
        </div>
      </StyledHtmlContent>

      {isVerificationSuccessful ? (
        <>
          <Player
            src="https://lottie.host/be80b83b-a760-406a-a878-5f3a4fc56d90/b8XPSjnqBM.json"
            className="player w-[200px] h-[200px]"
            loop
            autoplay
          />
          <h2 className="text-2xl font-bold mb-2">{t("KYC Process Completed!")}</h2>
          <p className="text-md">
            {t("Congrats your KYC Process has been completed.")}
          </p>
          <p className="text-md">
            {t("Your KYC Status will be updated after inspection.")}
          </p>
          <Button asChild className="w-full h-18 mt-6 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold flex items-center justify-center gap-2 rounded-full py-3">
            <Link href="/dashboard">{t("Return to Dashboard")}</Link>
          </Button>
        </>
      ) : (
        <>
          <Player
            src="https://lottie.host/71686c66-4784-47f5-b611-11fb76a30500/3SDCJzmZ6H.json"
            className="player w-[200px] h-[200px]"
            loop
            autoplay
          />
          <h2 className="text-2xl font-bold mb-2 text-red-600">{t("Verification Failed")}</h2>
          <p className="text-md">
            {t("We couldn't verify your identity with sufficient confidence.")}
          </p>
          <p className="text-md">
            {t("Please try again with better lighting and ensure your face is clearly visible.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
            <Button asChild className="h-18 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold flex items-center justify-center gap-2 rounded-full py-3 px-6 w-full sm:w-auto">
              <Link href="/kyc">{t("Verify Again")}</Link>
            </Button>
            <Button asChild className="h-18 bg-gray-500 hover:bg-gray-600 text-white text-lg font-semibold flex items-center justify-center gap-2 rounded-full py-3 px-6 w-full sm:w-auto">
              <Link href="/dashboard">{t("Return to Dashboard")}</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
