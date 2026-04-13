"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, Globe, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ThemeToggle";

type LoginStep = "credentials" | "mfa" | "forgotEmail" | "forgotOtp" | "forgotReset";

function getPasswordStrength(pwd: string) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

export default function LoginPage() {
  const { login } = useAuth();
  const [step, setStep] = useState<LoginStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);

  useEffect(() => {
    if (step === "mfa" || step === "forgotOtp") {
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) { clearInterval(timer); setCanResend(true); return 0; }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const validateCredentials = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (!validateCredentials()) return;
    if (email !== "demo@bridge.com" || password !== "Bridge@123") {
      setErrors({ password: "Invalid email or password" });
      return;
    }
    setCountdown(300);
    setCanResend(false);
    setStep("mfa");
  };

  const handleOtpChange = (i: number, v: string, otpArr: string[], setOtpArr: (o: string[]) => void) => {
    if (!/^\d?$/.test(v)) return;
    const arr = [...otpArr];
    arr[i] = v;
    setOtpArr(arr);
    if (v && i < 3) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleVerifyMfa = () => {
    const code = otp.join("");
    if (code.length < 4) { setOtpError("Please enter all 4 digits"); return; }
    // Accept any 4-digit OTP for the demo
    login(email, "startup");
  };

  const strengthScore = getPasswordStrength(newPassword);
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-blue-500", "bg-green-500"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground relative overflow-hidden px-4 transition-colors duration-300">
      {/* Theme Toggle (Top Right) */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#1D6FF2]/5 blur-3xl transition-opacity duration-500" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#F4A91F]/5 blur-3xl transition-opacity duration-500" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fadeIn transition-all">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#1D6FF2] flex items-center justify-center shadow-[0_0_20px_rgba(29,111,242,0.3)]">
              <span className="text-white font-black text-xl">B</span>
            </div>
            <span className="text-foreground text-2xl font-black tracking-tight">BRIDGE</span>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Verify. Connect. Scale.</p>
        </div>

        <div className="bg-card border border-border p-8 rounded-3xl shadow-2xl relative overflow-hidden transition-colors duration-300">

          {/* ── CREDENTIALS ── */}
          {step === "credentials" && (
            <>
              <h1 className="text-foreground text-2xl font-bold mb-1">Welcome back</h1>
              <p className="text-muted-foreground text-sm mb-6">Sign in to your BRIDGE account</p>

              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-sm mb-1 block">Business Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-input-border text-foreground placeholder:text-muted-foreground focus:border-primary h-11"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.email}</p>}
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="text-muted-foreground text-sm">Password</Label>
                    <button onClick={() => setStep("forgotEmail")} className="text-primary text-xs hover:underline">Forgot Password?</button>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="bg-input border-input-border text-foreground placeholder:text-muted-foreground focus:border-primary h-11 pr-11"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.password}</p>}
                </div>
              </div>

              <Button onClick={handleLogin} className="w-full mt-6 h-11 bg-primary hover:bg-primary/90 text-white font-semibold transition-all">
                Sign In
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"/></div>
                <div className="relative flex justify-center text-xs text-muted-foreground bg-card px-3">or continue with</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[{ icon: <Globe size={16}/>, label: "Google" }, { icon: <Activity size={16}/>, label: "LinkedIn" }].map((s) => (
                  <div key={s.label} className="relative">
                    <button disabled className="w-full h-10 flex items-center justify-center gap-2 border border-border rounded-lg text-muted-foreground cursor-not-allowed opacity-60 bg-muted/30">
                      {s.icon}<span className="text-sm">{s.label}</span>
                    </button>
                    <span className="absolute -top-2 right-1 bg-accent text-accent-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">SOON</span>
                  </div>
                ))}
              </div>

              <p className="text-center text-muted-foreground text-sm mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">Create one</Link>
              </p>
            </>
          )}

          {/* ── MFA OTP ── */}
          {step === "mfa" && (
            <>
              <button onClick={() => setStep("credentials")} className="text-muted-foreground text-sm hover:text-foreground mb-4 flex items-center gap-1">← Back</button>
              <h1 className="text-foreground text-2xl font-bold mb-1">Verify your identity</h1>
              <p className="text-muted-foreground text-sm mb-6">Enter the 4-digit OTP sent to your registered mobile number.</p>

              <div className="flex gap-2 justify-center mb-4">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value, otp, setOtp)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    className="w-11 h-12 text-center text-foreground text-xl font-bold bg-input border-2 border-input-border rounded-xl focus:border-primary focus:outline-none transition-colors"
                  />
                ))}
              </div>

              {otpError && <p className="text-red-400 text-xs text-center mb-3 flex items-center justify-center gap-1"><AlertCircle size={12}/>{otpError}</p>}

              <div className="text-center mb-6">
                <p className="text-muted-foreground text-sm">
                  {canResend ? (
                    <button onClick={() => { setCountdown(300); setCanResend(false); }} className="text-primary hover:underline">Resend OTP</button>
                  ) : (
                    <>OTP expires in <span className="text-accent font-mono font-semibold">{formatTime(countdown)}</span></>
                  )}
                </p>
              </div>

              <Button onClick={handleVerifyMfa} className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold">
                Verify & Sign In
              </Button>
              <p className="text-muted-foreground text-xs text-center mt-3">Demo: Enter any 4 digits to proceed</p>
            </>
          )}

          {/* ── FORGOT: EMAIL ── */}
          {step === "forgotEmail" && (
            <>
              <button onClick={() => setStep("credentials")} className="text-muted-foreground text-sm hover:text-foreground mb-4 flex items-center gap-1">← Back to Login</button>
              <h1 className="text-foreground text-2xl font-bold mb-1">Reset Password</h1>
              <p className="text-muted-foreground text-sm mb-6">Enter your registered email to receive a reset OTP.</p>
              <Label className="text-muted-foreground text-sm mb-1 block">Business Email</Label>
              <Input type="email" placeholder="you@company.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="bg-input border-input-border text-foreground placeholder:text-muted-foreground focus:border-primary h-11 mb-4"/>
              <Button onClick={() => { setCountdown(300); setCanResend(false); setStep("forgotOtp"); }} className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold" disabled={!forgotEmail}>
                Send Reset OTP
              </Button>
            </>
          )}

          {/* ── FORGOT: OTP ── */}
          {step === "forgotOtp" && (
            <>
              <button onClick={() => setStep("forgotEmail")} className="text-muted-foreground text-sm hover:text-foreground mb-4 flex items-center gap-1">← Back</button>
              <h1 className="text-foreground text-2xl font-bold mb-1">Enter OTP</h1>
              <p className="text-muted-foreground text-sm mb-6">A 4-digit code was sent to your email/mobile.</p>
              <div className="flex gap-2 justify-center mb-4">
                {forgotOtp.map((digit, i) => (
                  <input key={i} type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={(e) => { if (!/^\d?$/.test(e.target.value)) return; const arr=[...forgotOtp]; arr[i]=e.target.value; setForgotOtp(arr); if(e.target.value && i<3) otpRefs.current[i+1]?.focus(); }}
                    onKeyDown={(e) => { if(e.key==="Backspace"&&!forgotOtp[i]&&i>0) otpRefs.current[i-1]?.focus(); }}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    className="w-11 h-12 text-center text-foreground text-xl font-bold bg-input border-2 border-input-border rounded-xl focus:border-primary focus:outline-none"
                  />
                ))}
              </div>
              <p className="text-center text-muted-foreground text-sm mb-4">
                {canResend ? <button onClick={() => { setCountdown(300); setCanResend(false); }} className="text-primary hover:underline">Resend OTP</button>
                : <>Expires in <span className="text-accent font-mono font-semibold">{formatTime(countdown)}</span></>}
              </p>
              <Button onClick={() => setStep("forgotReset")} className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold" disabled={forgotOtp.join("").length < 4}>
                Verify OTP
              </Button>
            </>
          )}

          {/* ── FORGOT: NEW PASSWORD ── */}
          {step === "forgotReset" && (
            <>
              <h1 className="text-foreground text-2xl font-bold mb-1">Set New Password</h1>
              <p className="text-muted-foreground text-sm mb-6">Choose a strong password for your account.</p>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-sm mb-1 block">New Password</Label>
                  <div className="relative">
                    <Input type={showNewPwd ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-input border-input-border text-foreground h-11 pr-11 focus:border-primary" placeholder="Min 8 chars"/>
                    <button onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showNewPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strengthScore ? strengthColors[strengthScore] : "bg-muted"}`}/>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{strengthLabels[strengthScore]}</p>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm mb-1 block">Confirm Password</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-input border-input-border text-foreground h-11 focus:border-primary" placeholder="Repeat password"/>
                  {confirmPassword && newPassword !== confirmPassword && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>Passwords do not match</p>}
                </div>
              </div>
              <Button onClick={() => setStep("credentials")} disabled={strengthScore < 4 || newPassword !== confirmPassword}
                className="w-full mt-6 h-11 bg-primary hover:bg-primary/90 text-white font-semibold">
                Update Password
              </Button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease forwards; }
      `}</style>
    </div>
  );
}
