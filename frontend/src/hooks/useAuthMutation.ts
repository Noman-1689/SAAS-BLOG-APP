// src/hooks/useAuthMutation.ts
import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser } from "@/services/authService";
import { useRouter } from "next/navigation";
import { SignupData } from "@/types";
import { toast } from "sonner";

export const useSignupMutation = () => {
  const router = useRouter();

  return useMutation({
    // data now includes firstName and lastName via the SignupData type
    mutationFn: (data: SignupData) => registerUser(data),

    onSuccess: (res, variables) => {
      // res is the response from your backend (e.g., { message: "..." })
      toast.success(
        res.message || "User created. Please check your email for OTP.",
      );

      // Redirect to the OTP page with the email in the URL
      const emailParam = encodeURIComponent(variables.email);
      router.push(`/verify-otp?email=${emailParam}`);
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed";
      toast.error(errorMsg);
    },
  });
};

export const useLoginMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) => loginUser(data),
    onSuccess: (res) => {
      toast.success(res.message || "Login successful");
      // Redirect to dashboard or home
      router.push("/");
    },
    onError: (error: any) => {
      const errorData = error.response?.data;

      // Handle the "User exists but not verified" case
      // Note: Added a fallback to check if status is 403 or 401 depending on your backend
      if (error.response?.status === 403 && errorData?.notVerified) {
        toast.error(errorData.message);

        // Redirect to OTP page with the email from the error response
        const emailParam = encodeURIComponent(errorData.email || "");
        router.push(`/verify-otp?email=${emailParam}`);
        return;
      }

      const errorMsg = errorData?.message || errorData?.error || "Login failed";
      toast.error(errorMsg);
    },
  });
};
