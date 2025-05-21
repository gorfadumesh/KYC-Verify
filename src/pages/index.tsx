import { useState } from "react";
import { AnimatedTooltipPreview } from "@/components/landing/Avatars";
import { LandingPage } from "@/components/landing/Landing";
import SignUp from "@/components/auth/SignUp";
import VerifyOTP from "@/components/auth/VerifyOTP";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const [signedUp, setSignedUp] = useState(false);

  const handleSignUpSuccess = () => {
    setSignedUp(true);
  };
  return (
    <div className="flex flex  h-screen items-center justify-center"  >
      {/* <div className="flex w-[50%] h-screen items-center justify-center">
        <div className="w-full max-w-3xl">
          <LandingPage />
          <div className="flex flex-col w-full items-center gap-5">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Developed by
            </h3>
            <AnimatedTooltipPreview />
          </div>
        </div>
      </div> */}
      {/* <div className="w-[50%]">
        {!signedUp ? <SignUp onSuccess={handleSignUpSuccess} /> : <VerifyOTP />}
      </div> */}
      <Button asChild >
        <Link href="/kyc" className="bg-blue-600">
          Start your KYC
        </Link>
      </Button>
    </div>
  );
}
