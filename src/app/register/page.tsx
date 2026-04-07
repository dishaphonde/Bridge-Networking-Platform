"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, Check, Building2, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ThemeToggle";

type Role = "Startup" | "Investor" | "B2B Connect" | null;
type Step = "form" | "otp";

const STEPS = ["Registration", "OTP Verify", "Profile Setup", "KYC Submission", "Pending Verification", "Discovery Access"];

function getPasswordStrength(pwd: string) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

const roles = [
  { id: "Startup", label: "Startup", subtitle: "Founder / Co-Founder", icon: <TrendingUp size={24}/> },
  { id: "Investor", label: "Investor", subtitle: "Angel / VC / Family Office", icon: <Building2 size={24}/> },
  { id: "B2B Connect", label: "B2B Connect", subtitle: "Enterprise / Vendor", icon: <Users size={24}/> },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [role, setRole] = useState<Role>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const strengthScore = getPasswordStrength(password);
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-blue-500", "bg-green-500"];

  useEffect(() => {
    if (step !== "otp") return;
    const timer = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(timer); setCanResend(true); return 0; } return c - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!email) e.email = "Email is required";
    else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)) e.email = "Enter a valid business email (RFC 5321)";
    if (!mobile) e.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(mobile)) e.mobile = "Enter a valid 10-digit Indian mobile number";
    if (!password) e.password = "Password is required";
    else if (strengthScore < 4) e.password = "Password must include uppercase, lowercase, digit, and special character";
    if (!confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!role) e.role = "Please select a role";
    if (!agreed) e.agreed = "You must agree to the Terms & Privacy Policy";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendOtp = () => {
    if (!validate()) return;
    setStep("otp");
    setCountdown(300);
    setCanResend(false);
  };

  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const arr = [...otp]; arr[i] = v; setOtp(arr);
    if (v && i < 3) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleVerifyOtp = () => {
    if (otp.join("").length < 4) { setOtpError("Please enter all 4 digits"); return; }
    router.push("/profile/setup");
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden px-4 py-10 transition-colors duration-300">
      {/* Theme Toggle (Top Right) */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#1D6FF2]/5 blur-3xl"/>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#F4A91F]/5 blur-3xl"/>
      </div>

      <div className="relative z-10 max-w-xl mx-auto animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#1D6FF2] flex items-center justify-center shadow-[0_0_20px_rgba(29,111,242,0.3)]">
              <span className="text-white font-black text-xl">B</span>
            </div>
            <span className="text-foreground text-2xl font-black tracking-tight">BRIDGE</span>
          </Link>
        </div>

        {/* Progress Stepper */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex items-center min-w-max mx-auto justify-center gap-0">
            {STEPS.map((s, i) => {
              const done = (step === "form" && i === 0) || (step === "otp" && i <= 1);
              const active = (step === "form" && i === 0) || (step === "otp" && i === 1);
              return (
                <div key={s} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                      ${active ? "bg-[#1D6FF2] border-[#1D6FF2] text-white" :
                        done ? "bg-[#1D6FF2]/20 border-[#1D6FF2] text-[#1D6FF2]" : "bg-muted border-border text-muted-foreground"}`}>
                      {done && !active ? <Check size={12}/> : i + 1}
                    </div>
                    <span className={`text-[10px] mt-1 text-center max-w-[60px] leading-tight ${active ? "text-primary font-bold" : done ? "text-muted-foreground" : "text-muted-foreground/60"}`}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`h-px w-8 mx-1 mb-5 transition-all ${i < (step === "otp" ? 1 : 0) ? "bg-primary" : "bg-border"}`}/>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl transition-colors duration-300">

          {/* ── STEP 1: FORM ── */}
          {step === "form" && (
            <>
              <h1 className="text-foreground text-2xl font-bold mb-1">Create Your Account</h1>
              <p className="text-muted-foreground text-sm mb-6 font-medium">Join BRIDGE — verified by default, connected by design.</p>

              {/* Role selector */}
              <div className="mb-6">
                <Label className="text-muted-foreground text-sm mb-2 block">I am a <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((r) => (
                    <button key={r.id} onClick={() => setRole(r.id as Role)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all group
                        ${role === r.id ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border bg-muted/40 text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
                      {r.icon}
                      <div className="text-center">
                        <p className="text-xs font-bold leading-tight">{r.label}</p>
                        <p className="text-[10px] leading-tight opacity-70 font-medium">{r.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.role && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.role}</p>}
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-sm mb-1 block">Full Name <span className="text-destructive">*</span></Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe"
                    className="bg-input border-input-border text-foreground placeholder:text-muted-foreground focus:border-primary h-11"/>
                  {errors.fullName && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.fullName}</p>}
                </div>

                <div>
                  <Label className="text-muted-foreground text-sm mb-1 block">Business Email <span className="text-destructive">*</span></Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
                    className="bg-input border-input-border text-foreground placeholder:text-muted-foreground focus:border-primary h-11"/>
                  {errors.email && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.email}</p>}
                </div>

                <div>
                  <Label className="text-muted-foreground text-sm mb-1 block">Mobile Number <span className="text-destructive">*</span></Label>
                  <div className="flex gap-2">
                    <div className="h-11 px-3 bg-muted border border-border rounded-md flex items-center text-muted-foreground text-sm font-bold whitespace-nowrap">🇮🇳 +91</div>
                    <Input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210"
                      className="bg-input border-input-border text-foreground placeholder:text-muted-foreground focus:border-primary h-11 flex-1"/>
                  </div>
                  {errors.mobile && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.mobile}</p>}
                </div>

                <div>
                  <Label className="text-muted-foreground text-sm mb-1 block">Password <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password"
                      className="bg-input border-input-border text-foreground placeholder:text-muted-foreground focus:border-primary h-11 pr-11"/>
                    <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strengthScore ? strengthColors[strengthScore] : "bg-muted"}`}/>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Strength: <span className="font-bold">{strengthLabels[strengthScore]}</span></p>
                    </div>
                  )}
                  {errors.password && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.password}</p>}
                </div>

                <div>
                  <Label className="text-muted-foreground text-sm mb-1 block">Confirm Password <span className="text-destructive">*</span></Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password"
                    className="bg-input border-input-border text-foreground placeholder:text-muted-foreground focus:border-primary h-11"/>
                  {errors.confirmPassword && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <button onClick={() => setAgreed(!agreed)}
                    className={`w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${agreed ? "bg-primary border-primary shadow-[0_0_10px_rgba(29,111,242,0.3)]" : "border-border bg-transparent"}`}>
                    {agreed && <Check size={12} className="text-white font-bold"/>}
                  </button>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                    I agree to BRIDGE&apos;s <a href="#" className="text-primary hover:underline font-bold">Terms of Service</a> and <a href="#" className="text-primary hover:underline font-bold">Privacy Policy</a>
                  </p>
                </div>
                {errors.agreed && <p className="text-destructive text-xs flex items-center gap-1"><AlertCircle size={12}/>{errors.agreed}</p>}
              </div>

              <Button onClick={handleSendOtp} className="w-full mt-6 h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-xl">
                Send OTP →
              </Button>

              <p className="text-center text-muted-foreground text-sm mt-4 font-medium">
                Already have an account? <Link href="/login" className="text-primary hover:underline font-bold">Sign in</Link>
              </p>
            </>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === "otp" && (
            <>
              <button onClick={() => setStep("form")} className="text-muted-foreground text-sm hover:text-foreground mb-4 flex items-center gap-1 font-bold">← Back</button>
              <h1 className="text-foreground text-2xl font-bold mb-1">Verify Your Mobile</h1>
              <p className="text-muted-foreground text-sm mb-2 font-medium">A 4-digit OTP has been sent to <span className="text-foreground font-black">+91-{mobile}</span></p>
              <p className="text-muted-foreground text-xs mb-8 font-medium">Please check your messages and enter the code below.</p>

              <div className="flex gap-3 justify-center mb-4">
                {otp.map((digit, i) => (
                  <input key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    className="w-12 h-14 text-center text-foreground text-2xl font-bold bg-input border-2 border-input-border rounded-xl focus:border-primary focus:bg-primary/5 focus:outline-none transition-all shadow-sm"
                  />
                ))}
              </div>

              {otpError && <p className="text-destructive text-xs text-center mb-3 flex items-center justify-center gap-1"><AlertCircle size={12}/>{otpError}</p>}

              <div className="text-center mb-8">
                {canResend ? (
                  <button onClick={() => { setCountdown(300); setCanResend(false); setOtp(["","","",""]); }} className="text-primary text-sm hover:underline font-bold">Resend OTP</button>
                ) : (
                  <p className="text-muted-foreground text-sm font-medium">Resend available in <span className="text-accent font-mono font-black">{formatTime(countdown)}</span></p>
                )}
              </div>

              <Button onClick={handleVerifyOtp} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-xl">
                Verify & Continue
              </Button>
              <p className="text-center text-muted-foreground text-xs mt-4 font-medium italic opacity-70">Demo: Enter any 4 digits to proceed</p>
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
