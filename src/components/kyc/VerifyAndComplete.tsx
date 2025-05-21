import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Player } from "@lottiefiles/react-lottie-player";
import "@/components/translations/Translations";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

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
  // Read API response from localStorage
  const apiResult = JSON.parse(localStorage.getItem("kyc-verify-result") || '{}');
  const htmlContent = apiResult?.data?.[0] || '';
  return (
    <div className="flex flex-col justify-center items-center my-20">
      <StyledHtmlContent>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </StyledHtmlContent>
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
      <Button asChild className="mt-6 bg-blue-600">
        <Link href="/dashboard">{t("Return to Dashboard")}</Link>
      </Button>
    </div>
  );
}
