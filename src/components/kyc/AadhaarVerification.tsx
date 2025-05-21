import React from "react";
import styled from "styled-components";
import { Button } from "../ui/button";
import "@/components/translations/Translations";
import { useTranslation } from "react-i18next";

const AadhaarContainer = styled.div`
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const AadhaarDetails = styled.div`
  background-color: #f4f4f4;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Field = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: bold;
`;

const Value = styled.span`
  margin-left: 10px;
`;

const StyledHtmlContent = styled.div`
  table {
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

export default function AadhaarVerification({
  onNextStep,
}: {
  onNextStep: () => void;
}) {
  const { t } = useTranslation();
  const speakMessage = (message: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = message;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      window.speechSynthesis.speak(speech);
    }
  };

  const onSubmit = () => {
    onNextStep();
    // speakMessage(
    //   "Position your face in the center of the frame and click the capture button to take a picture of your face. After capturing the picture, proceed to the next step.",
    // );
  };

  // Read API response from localStorage
  const apiResult = JSON.parse(localStorage.getItem("kyc-verification-data") || '{}');
  // The API returns HTML in data[0]
  console.log(apiResult,"apiResult");
  const htmlContent = apiResult?.data?.[0] || '';
  const htmlContent2 = apiResult?.data?.[1] || '';

  return (
    <AadhaarContainer>
      <h2 className="text-lg font-semibold mb-4">
        {t("Here are the details we fetched from your ID card:")}
      </h2>
      <AadhaarDetails>
        {/* Render the HTML content from the API response with custom styling */}
        <StyledHtmlContent>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          <div dangerouslySetInnerHTML={{ __html: htmlContent2 }} />
        </StyledHtmlContent>
      </AadhaarDetails>
      <Button className="my-10 bg-blue-600" onClick={onSubmit}>
        {t("Verify & Continue")}
      </Button>
    </AadhaarContainer>
  );
}
