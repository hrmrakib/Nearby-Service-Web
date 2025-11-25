import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import React, { Suspense } from "react";

const ForgotPasswordPage = () => {
  return (
    <>
      <Suspense fallback={<>Loading .....</>}>
        <ForgotPasswordForm />
      </Suspense>
    </>
  );
};

export default ForgotPasswordPage;
