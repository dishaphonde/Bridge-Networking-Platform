"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, Lock, Loader2, X, CreditCard, Building2, Smartphone, Receipt, Check } from "lucide-react";
import { toast } from "sonner";

type Step = 1 | 2 | 3;

interface Props {
  open: boolean;
  onClose: () => void;
}

const ROLE_COLORS: Record<string, string> = {
  startup: "#1D6FF2",
  investor: "#F4A91F",
  b2b: "#10B981",
};

export default function UpgradeModal({ open, onClose }: Props) {
  const { user, upgradeToPremium } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [payTab, setPayTab] = useState("card");
  const [gstin, setGstin] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [payState, setPayState] = useState<"idle" | "processing" | "verifying" | "success">("idle");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upi, setUpi] = useState("");
  const [bank, setBank] = useState("");
  const [txnId] = useState(`TXN-20260406-${Math.floor(10000 + Math.random() * 90000)}`);

  const accentColor = ROLE_COLORS[user?.role ?? "startup"];
  const isAnnual = billing === "annual";
  const monthlyBase = 15000;
  const annualBase = 12000;
  const base = isAnnual ? annualBase : monthlyBase;
  const gst = Math.round(base * 0.18);
  const total = base + gst;
  const annualTotal = 144000;
  const annualGst = Math.round(annualTotal * 0.18);
  const annualDue = annualTotal + annualGst;

  useEffect(() => {
    if (open) {
      setStep(1);
      setPayState("idle");
      setAgreed(false);
      setCardNum("");
      setCardName("");
      setExpiry("");
      setCvv("");
      setUpi("");
      setBilling("monthly");
    }
  }, [open]);

  const handlePay = () => {
    setPayState("processing");
    setTimeout(() => setPayState("verifying"), 1500);
    setTimeout(() => {
      setPayState("success");
      upgradeToPremium(billing);
      setStep(3);
    }, 3000);
  };

  const formatCard = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) =>
    val.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

  const displayAmount = isAnnual ? annualDue.toLocaleString("en-IN") : total.toLocaleString("en-IN");
  const displayBase = isAnnual ? annualTotal.toLocaleString("en-IN") : base.toLocaleString("en-IN");
  const displayGst = isAnnual ? annualGst.toLocaleString("en-IN") : gst.toLocaleString("en-IN");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border border-border text-foreground max-w-[520px] p-0 overflow-hidden rounded-3xl shadow-2xl transition-all duration-300" aria-describedby={undefined}>
        {/* Step indicator */}
        {step < 3 && (
          <div className="flex items-center justify-between px-6 pt-6 pb-0">
            <div className="flex items-center gap-3">
              {([1, 2, 3] as Step[]).map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border-2 transition-all duration-300 ${
                    step >= s ? "text-white border-transparent" : "text-muted-foreground/40 border-border"
                  }`} style={step >= s ? { backgroundColor: accentColor } : {}}>
                    {step > s ? <Check size={14} /> : s}
                  </div>
                  {s < 3 && <div className={`w-8 h-0.5 rounded-full ${step > s ? "bg-primary/30" : "bg-border"}`} />}
                </div>
              ))}
              <span className="text-muted-foreground text-[11px] ml-1 font-black uppercase tracking-widest">
                {step === 1 ? "Billing" : step === 2 ? "Payment" : "Details"}
              </span>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/50">
              <X size={20} />
            </button>
          </div>
        )}

        {/* ── STEP 1 : Billing Cycle ── */}
        {step === 1 && (
          <div className="p-8 pt-6 space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-foreground text-2xl font-black tracking-tight">Select Billing Plan</h2>
              <p className="text-muted-foreground text-sm font-medium mt-1">Unlock premium connections & enterprise features.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: "monthly", label: "Monthly", price: "₹15,000", sub: "/ month", desc: "Billed monthly. Cancel anytime." },
                { id: "annual", label: "Annual", price: "₹12,000", sub: "/ month", desc: "Billed yearly. Save ₹36,000.", badge: "Best Value" },
              ].map((opt) => (
                <button key={opt.id} onClick={() => setBilling(opt.id as "monthly" | "annual")}
                  className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-300 group ${billing === opt.id ? "bg-primary/5 shadow-inner" : "bg-card border-border hover:border-primary/30"}`}
                  style={billing === opt.id ? { borderColor: accentColor } : {}}>
                  {opt.badge && (
                    <span className="absolute -top-2.5 right-4 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white shadow-sm" style={{ backgroundColor: accentColor }}>
                      {opt.badge}
                    </span>
                  )}
                  <p className="text-foreground font-black text-sm mb-1 uppercase tracking-wider">{opt.label}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <p style={{ color: accentColor }} className="text-2xl font-black">{opt.price}</p>
                    <span className="text-[10px] text-muted-foreground font-bold">{opt.sub}</span>
                  </div>
                  <p className="text-muted-foreground text-[10px] font-medium leading-relaxed">{opt.desc}</p>
                  {billing === opt.id && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: accentColor }}>
                      <Check size={12} className="text-white font-bold" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Order summary */}
            <div className="bg-muted/30 border border-border rounded-2xl p-5 space-y-3">
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-4">Invoice Summary</p>
              <div className="flex justify-between items-center"><span className="text-muted-foreground text-xs font-medium">Plan</span><span className="text-foreground font-bold text-sm">BRIDGE Premium</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground text-xs font-medium">Billing Period</span><span className="text-foreground font-bold text-sm capitalize">{billing}</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground text-xs font-medium">Base Amount</span><span className="text-foreground font-bold text-sm">₹{displayBase}</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground text-xs font-medium">GST (18%)</span><span className="text-foreground font-bold text-sm">₹{displayGst}</span></div>
              <div className="border-t border-border mt-3 pt-4 flex justify-between items-center">
                <span className="text-foreground font-black uppercase tracking-widest text-xs">Total Due</span>
                <span className="text-foreground font-black text-xl italic">₹{displayAmount}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1">GSTIN (Optional)</Label>
              <Input value={gstin} onChange={e => setGstin(e.target.value.toUpperCase().slice(0, 15))}
                placeholder="e.g. 22AAAAA0000A1Z5"
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/30 h-10 text-sm focus:border-primary font-mono tracking-widest rounded-xl" />
            </div>

            <Button onClick={() => setStep(2)} className="w-full h-12 font-black text-sm rounded-xl shadow-xl transition-transform active:scale-[0.98] uppercase tracking-widest" style={{ backgroundColor: accentColor, color: "#fff" }}>
              Secure Payment →
            </Button>
          </div>
        )}

        {/* ── STEP 2 : Payment ── */}
        {step === 2 && (
          <div className="p-8 pt-6 space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-foreground text-2xl font-black tracking-tight">Complete Payment</h2>
              <p className="text-muted-foreground text-xs mt-1 flex items-center gap-2 font-bold uppercase tracking-tighter opacity-70">
                <Lock size={12} className="text-primary"/> 256-bit SSL encryption · Secure Checkout
              </p>
            </div>

            <Tabs value={payTab} onValueChange={setPayTab} className="w-full">
              <TabsList className="grid grid-cols-4 bg-muted border border-border rounded-xl h-11 p-1">
                {[
                  { id: "card", icon: <CreditCard size={14} />, label: "Card" },
                  { id: "netbanking", icon: <Building2 size={14} />, label: "Bank" },
                  { id: "upi", icon: <Smartphone size={14} />, label: "UPI" },
                  { id: "emi", icon: <Receipt size={14} />, label: "EMI" },
                ].map(t => (
                  <TabsTrigger key={t.id} value={t.id} disabled={t.id === "emi" && !isAnnual}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-muted-foreground rounded-lg transition-all">
                    {t.icon}{t.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="card" className="space-y-4 mt-6">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1">Card Number</Label>
                  <Input value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))}
                    placeholder="0000 0000 0000 0000" className="bg-muted/50 border-border text-foreground h-11 text-sm focus:border-primary font-mono tracking-widest rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1">Cardholder Name</Label>
                  <Input value={cardName} onChange={e => setCardName(e.target.value)}
                    placeholder="Full Name on Card" className="bg-muted/50 border-border text-foreground h-11 text-sm focus:border-primary rounded-xl font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1">Expiry Date</Label>
                    <Input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM / YY" maxLength={5} className="bg-muted/50 border-border text-foreground h-11 text-sm focus:border-primary font-mono rounded-xl text-center" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1">CVV Code</Label>
                    <Input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      type="password" placeholder="•••" maxLength={3} className="bg-muted/50 border-border text-foreground h-11 text-sm focus:border-primary rounded-xl text-center" />
                  </div>
                </div>
              </TabsContent>

              {/* ... other tab contents simplified but theme-aware ... */}
              <TabsContent value="upi" className="space-y-5 mt-6">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-1">VPA / UPI ID</Label>
                  <Input value={upi} onChange={e => setUpi(e.target.value)}
                    placeholder="username@bank" className="bg-muted/50 border-border text-foreground h-11 text-sm focus:border-primary rounded-xl font-bold" />
                </div>
                <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-border">
                   <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-border shadow-sm p-1">
                      <Smartphone className="text-slate-400" />
                   </div>
                   <p className="text-[10px] text-muted-foreground font-medium italic">Paying via UPI app? Enter your ID above or scan the QR code in the next step.</p>
                </div>
              </TabsContent>
            </Tabs>

            <label className="flex items-start gap-3 cursor-pointer group mt-4">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-1 accent-primary w-4 h-4 rounded border-border" />
              <span className="text-muted-foreground text-[11px] leading-relaxed font-medium group-hover:text-foreground transition-colors">
                I agree to the <span className="text-primary font-bold hover:underline">Membership Terms</span> and authorize this recurring payment for BRIDGE Premium services.
              </span>
            </label>

            <div className="pt-2">
              {payState === "idle" && (
                <Button disabled={!agreed} onClick={handlePay}
                  className="w-full h-14 font-black text-base rounded-xl disabled:opacity-40 disabled:cursor-not-allowed shadow-2xl transition-all uppercase tracking-[0.1em]"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, color: "#fff" }}>
                  Process ₹{displayAmount} →
                </Button>
              )}
              {payState === "processing" && (
                <Button disabled className="w-full h-14 rounded-xl flex items-center justify-center gap-3 font-black text-sm text-white uppercase tracking-widest opacity-90" style={{ backgroundColor: accentColor }}>
                  <Loader2 size={20} className="animate-spin" /> Authorizing...
                </Button>
              )}
              {payState === "verifying" && (
                <Button disabled className="w-full h-14 rounded-xl flex items-center justify-center gap-3 font-black text-sm text-muted-foreground border-2 border-border bg-muted/50 uppercase tracking-widest">
                  <Loader2 size={20} className="animate-spin text-primary" />
                  Finalizing with Bank...
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3 : Success ── */}
        {step === 3 && (
          <div className="p-10 text-center space-y-8 animate-fadeIn">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-[0_10px_40px_rgba(34,197,94,0.3)] animate-bounce-once overflow-hidden relative group" style={{ backgroundColor: accentColor + "10", border: `3px solid ${accentColor}` }}>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CheckCircle2 size={48} style={{ color: accentColor }} className="relative z-10" />
              </div>
            </div>

            <div>
              <h2 className="text-foreground text-3xl font-black tracking-tight mb-2">Upgrade Successful!</h2>
              <p className="text-muted-foreground text-sm font-medium">Welcome to <span className="text-foreground font-black italic">Premium</span>. Your enterprise features are now active.</p>
            </div>

            <div className="bg-muted/40 border border-border rounded-3xl p-6 text-left space-y-3 shadow-inner">
               <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60 text-center">Invoice Confirmation</p>
              {[
                { l: "Transaction ID", v: txnId, mono: true },
                { l: "Payment Method", v: "Credit Card (Secure)" },
                { l: "Subscription", v: billing === "monthly" ? "Premium Monthly" : "Premium Annual" },
                { l: "Amount Paid", v: `₹${displayAmount}`, bold: true },
              ].map(row => (
                <div key={row.l} className={`flex justify-between items-center ${row.bold ? "border-t border-border pt-4 mt-3" : ""}`}>
                  <span className="text-muted-foreground text-[11px] font-black uppercase tracking-tighter">{row.l}</span>
                  <span className={`${row.bold ? "text-foreground font-black text-lg" : "text-foreground font-bold text-sm"} ${row.mono ? "font-mono text-[10px] opacity-70" : ""}`}>{row.v}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => toast.success("Invoice PDF generated.")}
                className="h-12 border-border text-muted-foreground hover:bg-muted font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">
                Get PDF Receipt
              </Button>
              <Button onClick={() => { onClose(); toast.success("Feature Unlock Complete! Enjoy your Premium benefits.", { duration: 5000 }); }}
                className="h-12 font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl transition-all active:scale-95" style={{ backgroundColor: accentColor, color: "#fff" }}>
                Start Scaling →
              </Button>
            </div>
            
            <p className="text-muted-foreground text-[10px] font-medium italic opacity-60">
              A detailed GST invoice has been sent to your business email.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
