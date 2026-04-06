"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import {
  CheckCircle2, AlertCircle, Upload, Edit2, ArrowLeft, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const KYC_STEPS = ["Identity Verification", "Business Verification", "Review & Submit"];

interface UploadedFile { name: string; size: number; }

function FileUploadBox({ id, label, onChange, file, accept = "image/*, .pdf" }: {
  id: string; label: string;
  onChange: (f: UploadedFile | null) => void;
  file: UploadedFile | null;
  accept?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { alert("File size must not exceed 10MB"); return; }
    onChange({ name: f.name, size: f.size });
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">{label}</Label>
      <label htmlFor={id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all
        ${file ? "border-green-500/40 bg-green-500/5 shadow-inner" : "border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/5 shadow-sm"}`}>
        {file ? (
          <>
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
               <CheckCircle2 size={18} className="text-green-600"/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-foreground text-xs font-black truncate tracking-tight">{file.name}</p>
              <p className="text-muted-foreground text-[10px] font-bold">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={(e) => { e.preventDefault(); onChange(null); }} className="text-muted-foreground hover:text-red-500 text-[10px] font-black uppercase tracking-widest px-2 transition-colors">Remove</button>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
               <Upload size={18} className="text-muted-foreground/60"/>
            </div>
            <div>
              <p className="text-foreground text-xs font-black uppercase tracking-tight">Click to upload</p>
              <p className="text-muted-foreground text-[10px] font-medium opacity-60">JPG, PNG, PDF — max 10MB</p>
            </div>
          </>
        )}
        <input id={id} type="file" accept={accept} className="hidden" onChange={handleChange}/>
      </label>
    </div>
  );
}

export default function KycPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1 state
  const [panNumber, setPanNumber] = useState("");
  const [panFile, setPanFile] = useState<UploadedFile | null>(null);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarFront, setAadhaarFront] = useState<UploadedFile | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<UploadedFile | null>(null);
  const [aadhaarConsent, setAadhaarConsent] = useState(false);

  // Step 2 state
  const [gstin, setGstin] = useState("");
  const [gstFile, setGstFile] = useState<UploadedFile | null>(null);
  const [cin, setCin] = useState("");

  const isInvestor = user?.role === "investor";

  const validateStep0 = () => {
    const e: Record<string, string> = {};
    if (!panNumber) e.panNumber = "PAN Number is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber.toUpperCase())) e.panNumber = "Format: ABCDE1234F";
    if (!panFile) e.panFile = "Please upload your PAN card";
    if (!aadhaarNumber) e.aadhaarNumber = "Aadhaar Number is required";
    else if (!/^\d{12}$/.test(aadhaarNumber.replace(/\s/g, ""))) e.aadhaarNumber = "Enter a valid 12-digit Aadhaar number";
    if (!aadhaarFront) e.aadhaarFront = "Please upload Aadhaar front";
    if (!aadhaarBack) e.aadhaarBack = "Please upload Aadhaar back";
    if (!aadhaarConsent) e.aadhaarConsent = "Aadhaar consent is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep1 = () => {
    if (isInvestor) return true;
    const e: Record<string, string> = {};
    if (!gstin) e.gstin = "GSTIN is required";
    else if (!/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin.toUpperCase())) e.gstin = "Enter a valid GSTIN";
    if (!gstFile) e.gstFile = "Please upload GST Certificate";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    setErrors({});
    setStep(step + 1);
  };

  const handleSubmit = () => {
    toast.success("KYC Submitted! We'll notify you within 1–2 business days.", {
      description: "Your documents are now under review.",
      duration: 4000,
    });
    setTimeout(() => router.push("/dashboard"), 2000);
  };

  const maskedAadhaar = aadhaarNumber
    ? `XXXX XXXX ${aadhaarNumber.replace(/\s/g, "").slice(-4)}`
    : "—";

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto pb-24">
      <DashboardHeader 
        title="KYC Verification" 
        description="Verify your identity and business to start networking securely."
        showBack={true}
      />

      <div className="relative z-10">
        {/* Step indicators */}
        <div className="flex items-center gap-0 mb-10 px-4">
          {KYC_STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black border-2 transition-all flex-shrink-0 shadow-sm
                  ${i < step ? "bg-green-500 border-green-500 text-white shadow-green-500/20" :
                    i === step ? "bg-primary border-primary text-white shadow-primary/20 scale-110" : "bg-card border-border text-muted-foreground/40"}`}>
                  {i < step ? <CheckCircle2 size={16}/> : i + 1}
                </div>
                <span className={`text-[8px] mt-2 text-center uppercase tracking-widest font-black leading-tight ${i === step ? "text-primary" : i < step ? "text-green-600" : "text-muted-foreground/40"}`}>{s}</span>
              </div>
              {i < KYC_STEPS.length - 1 && (
                <div className={`h-1 flex-1 mx-2 mb-6 rounded-full transition-all ${i < step ? "bg-green-500/30 shadow-inner" : "bg-border opacity-50"}`}/>
              )}
            </div>
          ))}
        </div>

        <Card className="bg-card border-border shadow-2xl shadow-foreground/5 rounded-3xl overflow-hidden">
          <CardContent className="p-8 space-y-8">

            {/* ── STEP 1: Identity Verification ── */}
            {step === 0 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                   <h2 className="text-foreground text-sm font-black uppercase tracking-widest opacity-80">Personal Identification</h2>
                   <p className="text-muted-foreground text-xs font-medium opacity-60">Upload your government-issued identity documents.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5 block ml-1 opacity-60">PAN Number <span className="text-red-500">*</span></Label>
                    <Input value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F" maxLength={10}
                      className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/30 focus:border-primary h-12 font-black tracking-[0.2em] rounded-2xl shadow-sm uppercase"/>
                    {errors.panNumber && <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1.5 ml-1 animate-fadeIn"><AlertCircle size={10}/>{errors.panNumber}</p>}
                  </div>

                  <FileUploadBox id="pan-upload" label="PAN Card Image *" onChange={setPanFile} file={panFile}/>
                  {errors.panFile && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1.5 ml-1 animate-fadeIn"><AlertCircle size={10}/>{errors.panFile}</p>}
                </div>

                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div>
                    <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5 block ml-1 opacity-60">Aadhaar Number <span className="text-red-500">*</span></Label>
                    <Input value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, "").slice(0, 12))}
                      placeholder="1234 5678 9012"
                      className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/30 focus:border-primary h-12 font-black tracking-[0.2em] rounded-2xl shadow-sm"/>
                    {aadhaarNumber.length === 12 && (
                      <p className="text-muted-foreground text-[10px] mt-2 font-black uppercase tracking-widest ml-1 opacity-40">Privacy Mask: <span className="text-primary tracking-tighter">{maskedAadhaar}</span></p>
                    )}
                    {errors.aadhaarNumber && <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1.5 ml-1 animate-fadeIn"><AlertCircle size={10}/>{errors.aadhaarNumber}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FileUploadBox id="aadhaar-front" label="Aadhaar Front *" onChange={setAadhaarFront} file={aadhaarFront}/>
                    <FileUploadBox id="aadhaar-back" label="Aadhaar Back *" onChange={setAadhaarBack} file={aadhaarBack}/>
                  </div>
                  {(errors.aadhaarFront || errors.aadhaarBack) && (
                    <p className="text-red-500 text-[10px] font-bold flex items-center gap-1.5 ml-1 animate-fadeIn"><AlertCircle size={10}/>{errors.aadhaarFront || errors.aadhaarBack}</p>
                  )}
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-border group transition-all hover:bg-muted/50">
                  <button onClick={() => setAadhaarConsent(!aadhaarConsent)}
                    className={`w-6 h-6 mt-0.5 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${aadhaarConsent ? "bg-primary border-primary shadow-lg shadow-primary/20" : "border-border bg-card group-hover:border-primary/40"}`}>
                    {aadhaarConsent && <CheckCircle2 size={14} className="text-white"/>}
                  </button>
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest leading-loose opacity-60">
                    I consent to Aadhaar-based verification as per UIDAI guidelines. My information will be used solely for KYC purposes.
                  </p>
                </div>
                {errors.aadhaarConsent && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1.5 ml-1 animate-fadeIn"><AlertCircle size={10}/>{errors.aadhaarConsent}</p>}
              </div>
            )}

            {/* ── STEP 2: Business Verification ── */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                   <h2 className="text-foreground text-sm font-black uppercase tracking-widest opacity-80">Business Identification</h2>
                   <p className="text-muted-foreground text-xs font-medium opacity-60">Verify your enterprise status to unlock networking capabilities.</p>
                </div>

                {isInvestor ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-xl shadow-primary/5">
                      <CheckCircle2 size={36} className="text-primary"/>
                    </div>
                    <div>
                      <p className="text-foreground font-black text-xl tracking-tight uppercase">Investor Exemption</p>
                      <p className="text-muted-foreground text-xs font-medium max-w-xs mt-2 opacity-60">As a verified Investor, business documentation is handled post-connection. You can proceed to final review.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5 block ml-1 opacity-60">GSTIN <span className="text-red-500">*</span></Label>
                      <Input value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        placeholder="22AAAAA0000A1Z5" maxLength={15}
                        className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/30 focus:border-primary h-12 font-black tracking-[0.2em] rounded-2xl shadow-sm uppercase"/>
                      {errors.gstin && <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1.5 ml-1 animate-fadeIn"><AlertCircle size={10}/>{errors.gstin}</p>}
                    </div>
                    <FileUploadBox id="gst-cert" label="GST Registration Certificate *" onChange={setGstFile} file={gstFile}/>
                    {errors.gstFile && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1.5 ml-1 animate-fadeIn"><AlertCircle size={10}/>{errors.gstFile}</p>}
                  </div>
                )}

                <div className="pt-6 border-t border-border/50">
                  <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5 block ml-1 opacity-60">CIN (Company ID Number) <span className="text-primary/40 ml-1">Optional</span></Label>
                  <Input value={cin} onChange={(e) => setCin(e.target.value.toUpperCase())}
                    placeholder="U74999DL2020PTC123456" maxLength={21}
                    className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/30 focus:border-primary h-12 font-black tracking-widest rounded-2xl shadow-sm uppercase"/>
                  <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest mt-2 ml-1 opacity-40">21-character alphanumeric company registration number</p>
                </div>
              </div>
            )}

            {/* ── STEP 3: Review & Submit ── */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                   <h2 className="text-foreground text-sm font-black uppercase tracking-widest opacity-80">Final Review</h2>
                   <p className="text-muted-foreground text-xs font-medium opacity-60">Ensure all information is correct before final submission.</p>
                </div>

                <div className="grid gap-4">
                {[
                  {
                    title: "Identity Details",
                    step: 0,
                    items: [
                      { label: "PAN", value: panNumber || "—" },
                      { label: "Aadhaar", value: maskedAadhaar },
                    ]
                  },
                  {
                    title: "Business Details",
                    step: 1,
                    items: isInvestor
                      ? [{ label: "Role Status", value: "Verified Investor Exemption" }]
                      : [
                          { label: "GSTIN", value: gstin || "—" },
                          { label: "CIN", value: cin || "Not provided" },
                        ]
                  }
                ].map((section) => (
                  <div key={section.title} className="p-5 rounded-2xl bg-muted/20 border border-border group hover:bg-muted/40 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{section.title}</h3>
                      <button onClick={() => setStep(section.step)} className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                        <Edit2 size={10}/>Edit
                      </button>
                    </div>
                    <div className="space-y-3">
                      {section.items.map((item) => (
                        <div key={item.label} className="flex justify-between items-center gap-4">
                          <span className="text-muted-foreground text-[11px] font-black uppercase tracking-tight opacity-50">{item.label}</span>
                          <span className="text-foreground text-xs font-black tracking-tight text-right uppercase opacity-90">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-4 items-start shadow-inner">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                     <AlertCircle size={16} className="text-amber-600 opacity-80"/>
                  </div>
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.1em] leading-relaxed opacity-60">
                    By submitting, you confirm all data is accurate. Bridge uses industry-standard encryption to protect your identity documents.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={`flex gap-4 pt-4 border-t border-border/50 ${step > 0 ? "justify-between" : "justify-end"}`}>
              {step > 0 && (
                <Button onClick={() => setStep(step - 1)} variant="outline"
                  className="border-border text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em] hover:text-foreground hover:bg-muted h-12 px-8 rounded-2xl transition-all">
                  <ArrowLeft size={14} className="mr-2"/>Back
                </Button>
              )}
              {step < 2 ? (
                <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-[0.2em] h-12 px-10 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Next Step<ArrowRight size={14} className="ml-2"/>
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-500 text-white font-black text-[10px] uppercase tracking-[0.2em] h-12 px-12 rounded-2xl shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Submit Verification ✓
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Toaster/>
    </div>
  );
}
