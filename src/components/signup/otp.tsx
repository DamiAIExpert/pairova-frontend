import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect, useRef } from "react";
import { AuthService } from "@/services/auth.service";

interface OtpProps {
  setStep: (step: { stepThree: boolean }) => void;
  email: string;
}

const Otp = ({ setStep, email }: OtpProps) => {
  const [otpValue, setOtpValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const emailSentRef = useRef(false);

  // Automatically send verification email when component mounts (once only)
  useEffect(() => {
    const sendInitialEmail = async () => {
      // Check both ref and sessionStorage to prevent duplicates across remounts
      const sessionKey = `otp_sent_${email}`;
      const alreadySent = sessionStorage.getItem(sessionKey);
      
      if (!email || emailSentRef.current || alreadySent) {
        if (alreadySent) {
          setEmailSent(true); // Update UI if already sent in this session
        }
        return;
      }

      emailSentRef.current = true; // Prevent duplicate sends in current mount
      sessionStorage.setItem(sessionKey, 'true'); // Prevent duplicates across remounts

      try {
        await AuthService.resendVerificationEmail(email);
        setEmailSent(true); // Update UI state
      } catch (err: any) {
        console.error("Failed to send initial verification email:", err);
        setError("Failed to send verification code. Please click 'Resend Code'.");
        emailSentRef.current = false; // Allow retry on error
        sessionStorage.removeItem(sessionKey); // Allow retry
      }
    };

    sendInitialEmail();
  }, [email]);

  const handleVerify = async () => {
    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    if (!email) {
      setError("Email not found. Please go back and try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Verify the OTP code with email
      await AuthService.verifyEmail(email, otpValue);
      
      // Clear the session storage flag after successful verification
      sessionStorage.removeItem(`otp_sent_${email}`);
      
      // Move to success step
      setStep({ stepThree: true });
    } catch (err: any) {
      console.error("OTP verification error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Invalid code. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Email not found. Please go back and try again.");
      return;
    }

    setResending(true);
    setError("");

    try {
      await AuthService.resendVerificationEmail(email);
      setError(""); // Clear any errors
      // You could show a success message here
      alert("A new code has been sent to your email!");
    } catch (err: any) {
      console.error("Resend error:", err);
      setError(err.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="w-[50%] bg-[url(/Images/man-bg.AVIF)] min-h-screen bg-cover hidden md:block">
          {/* <img src="/Images/man-bg.AVIF" alt="man" className="w-full min-h-screen " /> */}
          <div className="w-full min-h-screen bg-black/50" />
        </div>

        <div className="w-full md:w-auto py-[50px] md:py-[150px] px-5 md:px-[100px]">
          <img src="/Images/logo.AVIF" alt="pairova" className="w-[100px]" />

          <div>
            <h2 className="text-4xl font-semibold">Enter the six digit code</h2>
            <p className="text-xs py-3 text-[#808080]">
              {!emailSent ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></span>
                  Sending verification code...
                </span>
              ) : (
                <>
                  Check your email for the code sent
                  {email && (
                    <span className="block font-medium text-black mt-1">
                      to {email}
                    </span>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="my-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="my-4">
            <InputOTP 
              maxLength={6} 
              value={otpValue} 
              onChange={(value) => {
                setOtpValue(value);
                setError(""); // Clear error when typing
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <div className="my-5">
              <button
                className="text-[#8A8A8A] text-xs w-full hover:text-black transition-colors"
                onClick={handleResendCode}
                disabled={resending || loading}
              >
                {resending ? "Resending..." : "Resend Code"}
              </button>
              <button
                className={`bg-[#2F2F2F] text-white w-full py-3 rounded-md my-3 cursor-pointer hover:bg-black transition-colors ${
                  loading || otpValue.length !== 6 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleVerify}
                disabled={loading || otpValue.length !== 6}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
