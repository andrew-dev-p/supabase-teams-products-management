"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const VerifyPage = () => {
  return (
    <Card className="mt-6 max-w-[400px] mx-auto gap-2">
      <CardHeader>
        <CardTitle className="text-xl">Verify your email</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>
            We&apos;ve sent a verification email to your inbox. Please check
            your email and click the verification link.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default VerifyPage;
