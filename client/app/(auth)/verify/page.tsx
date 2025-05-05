"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const VerifyPage = () => {
  const router = useRouter();

  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isResendDisabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
      setCountdown(30);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isResendDisabled, countdown]);

  return (
    <Card className="mt-6 max-w-[400px] mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Verify your email</CardTitle>
        <CardDescription>
          We&apos;ve sent you a verification email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            We&apos;ve sent a verification email to your inbox. Please check
            your email and click the verification link.
          </AlertDescription>
        </Alert>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          <Button
            onClick={() => {
              console.log("Resend");
            }}
            disabled={isResendDisabled}
            className="w-full"
          >
            {"Resend Email"}
          </Button>

          <Button
            onClick={() => {
              console.log("Check");
            }}
            disabled={isChecking}
            className="w-full"
          >
            {"I've Verified My Email"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifyPage;
