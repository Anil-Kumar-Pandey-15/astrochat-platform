import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Video, Mic, MicOff, VideoOff, Phone, PhoneOff, MessageSquare, Star, Calendar, CreditCard, Send, Sparkles } from "lucide-react";
import { toast } from 'sonner';

const ASTROLOGERS = [
  {
    id: 1,
    name: "Jyotishacharya Anand (ज्योतिषाचार्य आनंद)",
    specialty: "Vedic Astrology & Janam Kundali",
    experience: "15+ Years",
    rating: 4.9,
    reviews: 1240,
    price: 15,
    languages: ["Hindi", "English", "Sanskrit"],
    isOnline: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 2,
    name: "Pandit Shastri (पंडित शास्त्री)",
    specialty: "Lal Kitab Remedies & Vastu",
    experience: "12+ Years",
    rating: 4.8,
    reviews: 890,
    price: 12,
    languages: ["Hindi", "Marathi", "Gujarati"],
    isOnline: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 3,
    name: "Dr. K. Swaminathan (डॉ. स्वामीनाथन)",
    specialty: "Nadi Astrology & Prasna",
    experience: "20+ Years",
    rating: 4.95,
    reviews: 3200,
    price: 20,
    languages: ["Tamil", "Telugu", "Kannada", "English"],
    isOnline: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 4,
    name: "Shruti Banerjee (श्रुति बनर्जी)",
    specialty: "Numerology & Tarot Card Reading",
    experience: "8+ Years",
    rating: 4.7,
    reviews: 640,
    price: 10,
    languages: ["Bengali", "Hindi", "English"],
    isOnline: false,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  }
];

export const VideoChatPage = () => {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState('find');
  
  // Booking flow state
  const [selectedAstro, setSelectedAstro] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [bookingType, setBookingType] = useState<'chat' | 'voice' | 'video'>('video');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [checkoutModal, setCheckoutModal] = useState(false);

  // Active call session state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Simulating Astrologer messages during active consultation
  useEffect(() => {
    let timer: any;
    if (activeTab === 'call' && selectedAstro) {
      setChatMessages([
        { sender: 'astro', text: language === 'en' ? `Pranam seeker! I am ${selectedAstro.name}. Welcome to your consultation.` : `प्रणाम यजमान! मैं ${selectedAstro.name} हूँ। आपका स्वागत है।`, time: 'Just now' }
      ]);

      const simulatedTexts = language === 'en' ? [
        "Please share your primary query or birth details.",
        "Your planetary alignments show strong solar energies today. A good time for decisions.",
        "Based on your Saturn Mahadasha, the obstacles will begin to dissolve after October.",
        "Performing the Lal Kitab mustard oil remedy on Saturday will stabilize your finance."
      ] : [
        "कृपया अपना मुख्य प्रश्न या कुंडली विवरण साझा करें।",
        "आज गोचर में सूर्य देव की स्थिति आपके पक्ष में है। कार्यों के लिए उत्तम समय है।",
        "आपकी शनि महादशा की अवधि अक्टूबर के बाद अनुकूलता की ओर बढ़ेगी।",
        "शनिवार को सरसों तेल का दान उपाय करने से आपकी वित्तीय स्थिति में स्थिरता आएगी।"
      ];

      let msgIndex = 0;
      timer = setInterval(() => {
        if (msgIndex < simulatedTexts.length) {
          setChatMessages(prev => [...prev, {
            sender: 'astro',
            text: simulatedTexts[msgIndex],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          msgIndex++;
        }
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [activeTab, selectedAstro, language]);

  const handleOpenBooking = (astro: any) => {
    setSelectedAstro(astro);
    setCheckoutModal(true);
    setDiscountApplied(false);
    setCouponCode('');
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'ASTRO50') {
      setDiscountApplied(true);
      toast.success(language === 'en' ? "50% Discount Applied!" : "५०% छूट कोड लागू हो गया है!");
    } else {
      toast.error(language === 'en' ? "Invalid Coupon Code" : "अमान्य कूपन कोड");
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(language === 'en' ? "Payment Authorized successfully!" : "भुगतान सफलतापूर्वक पूर्ण हो गया है!");
    setCheckoutModal(false);
    setActiveTab('call'); // Transition to active call
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, {
      sender: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatInput('');
  };

  const handleEndCall = () => {
    setActiveTab('find');
    setSelectedAstro(null);
    toast.success(language === 'en' ? "Consultation session closed." : "परामर्श सत्र समाप्त कर दिया गया है।");
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-purple-950/20 border border-purple-900/30">
              <TabsTrigger value="find">{language === 'en' ? 'Astrologers Index' : 'ज्योतिषी सूची'}</TabsTrigger>
              <TabsTrigger value="call" disabled={!selectedAstro}>
                {language === 'en' ? 'Active Consultation Room' : 'सक्रिय परामर्श कक्ष'}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Astrologers Index */}
          <TabsContent value="find" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ASTROLOGERS.map((astro) => (
                <Card key={astro.id} className="bg-purple-950/5 border-purple-900/20 hover:border-purple-800/40 transition-colors overflow-hidden">
                  <div className="p-6 flex gap-4">
                    <Avatar className="w-20 h-20 rounded-full border border-purple-800/30">
                      <AvatarImage src={astro.avatar} alt={astro.name} />
                      <AvatarFallback>{astro.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div className="space-y-1 w-full">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-200 text-sm sm:text-base">{astro.name}</h3>
                        <Badge variant={astro.isOnline ? "cosmic" : "secondary"} className="text-[10px]">
                          {astro.isOnline ? "Online" : "Offline"}
                        </Badge>
                      </div>

                      <p className="text-xs text-purple-400 font-semibold">{astro.specialty}</p>
                      
                      <div className="flex items-center gap-1 text-xs text-slate-300">
                        <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                        <span className="font-bold">{astro.rating}</span>
                        <span className="text-muted-foreground">({astro.reviews} reviews) • {astro.experience} exp</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {astro.languages.map((l, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950/20 text-slate-400 border border-purple-900/20">
                            {l}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-purple-900/10 mt-3">
                        <div>
                          <span className="text-sm font-extrabold text-purple-300">₹{astro.price * 10}/min</span>
                          <span className="text-[9px] text-muted-foreground block">{language === 'en' ? 'Video/Voice' : 'चैट/वीडियो दर'}</span>
                        </div>
                        <Button size="sm" onClick={() => handleOpenBooking(astro)} className="bg-purple-600 hover:bg-purple-700 text-xs">
                          {language === 'en' ? 'Consult Now' : 'बात करें'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Active Call Room */}
          <TabsContent value="call">
            {selectedAstro && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live stream panel */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="bg-black/80 border-purple-900/30 overflow-hidden relative aspect-video flex items-center justify-center">
                    {isVideoOn ? (
                      <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600')]" />
                    ) : (
                      <div className="absolute inset-0 bg-slate-950" />
                    )}

                    {/* Simulating Astrologer avatar frame inside videocall */}
                    <div className="z-10 text-center space-y-4">
                      <Avatar className="w-28 h-28 mx-auto border-2 border-purple-500 animate-pulse">
                        <AvatarImage src={selectedAstro.avatar} />
                        <AvatarFallback>{selectedAstro.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-slate-200">{selectedAstro.name}</h4>
                        <span className="text-xs text-purple-400 font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                          {language === 'en' ? 'Live WebRTC Connected' : 'सक्रिय वीडियो संपर्क चालू है'}
                        </span>
                      </div>
                    </div>

                    {/* Small user picture-in-picture frame */}
                    <div className="absolute bottom-4 right-4 w-24 h-24 rounded border border-purple-800 bg-slate-900/80 flex items-center justify-center overflow-hidden">
                      <span className="text-[10px] text-muted-foreground">{language === 'en' ? 'Your Video' : 'आपकी वीडियो'}</span>
                    </div>
                  </Card>

                  {/* Call Controls */}
                  <div className="flex justify-center gap-4 bg-purple-950/15 p-4 rounded-xl border border-purple-900/20">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={!isMicOn ? 'bg-rose-950/20 border-rose-900/40 text-rose-400' : 'border-purple-800/40'}
                    >
                      {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      className={!isVideoOn ? 'bg-rose-950/20 border-rose-900/40 text-rose-400' : 'border-purple-800/40'}
                    >
                      {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                    <Button variant="destructive" onClick={handleEndCall}>
                      <PhoneOff className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Consultation Chat pane */}
                <div className="lg:col-span-1">
                  <Card className="border-purple-900/30 bg-purple-950/10 h-[480px] flex flex-col">
                    <CardHeader className="py-3.5 border-b border-purple-900/10 bg-purple-950/20">
                      <CardTitle className="text-xs font-bold text-purple-300 uppercase tracking-widest">
                        {language === 'en' ? 'Consultation Chat' : 'परामर्श लाइव संदेश'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-4 overflow-y-auto space-y-4">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-2.5 rounded-lg text-xs max-w-[85%] border ${
                            msg.sender === 'user'
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'bg-purple-950/40 border-purple-900/20 text-slate-100'
                          }`}>
                            <span className="text-[9px] text-muted-foreground block mb-0.5">
                              {msg.sender === 'user' ? 'You' : 'Astrologer'}
                            </span>
                            <p className="font-sans leading-relaxed">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter className="p-3 border-t border-purple-900/10 bg-purple-950/10 flex gap-2">
                      <Input 
                        value={chatInput} 
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                        placeholder={language === 'en' ? "Type a message..." : "अपना संदेश टाइप करें..."}
                        className="bg-black/35 border-purple-900/40 text-xs flex-grow"
                      />
                      <Button onClick={handleSendChatMessage} className="bg-purple-600 hover:bg-purple-700" size="icon">
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Checkout & Booking Flow Modal */}
        {checkoutModal && selectedAstro && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-900 border border-purple-800/60 shadow-2xl relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-purple-300">
                      {language === 'en' ? 'Confirm Consultation' : 'परामर्श बुकिंग विवरण'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'en' ? `Book a session with ${selectedAstro.name}` : `${selectedAstro.name} के साथ समय आरक्षित करें`}
                    </CardDescription>
                  </div>
                  <button 
                    onClick={() => setCheckoutModal(false)}
                    className="text-xs text-muted-foreground hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                {/* Form Details */}
                <div className="grid grid-cols-2 gap-3 bg-purple-950/20 p-3 rounded border border-purple-900/10">
                  <div>
                    <label className="text-[10px] text-muted-foreground block">DATE</label>
                    <Input 
                      type="date" 
                      value={bookingDate} 
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="bg-black/45 border-purple-900/40 text-xs h-8 mt-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block font-bold">SLOT</label>
                    <Select value={bookingTime} onValueChange={setBookingTime}>
                      <SelectTrigger className="bg-black/45 border-purple-900/40 text-xs h-8 mt-0.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "07:00 PM"].map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between items-center p-1">
                  <span>{language === 'en' ? 'Consultation Type' : 'परामर्श प्रकार'}</span>
                  <div className="flex gap-2">
                    {['chat', 'voice', 'video'].map((type) => (
                      <button 
                        key={type}
                        type="button"
                        onClick={() => setBookingType(type as any)}
                        className={`px-3 py-1 rounded border text-[10px] font-bold transition-all uppercase ${
                          bookingType === type 
                            ? 'bg-purple-600 border-purple-500 text-white' 
                            : 'bg-black/35 border-purple-900/30 text-slate-400'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coupon Code section */}
                <div className="flex gap-2">
                  <Input 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={language === 'en' ? "Enter Coupon (e.g. ASTRO50)" : "कूपन कोड डालें (उदा: ASTRO50)"}
                    className="bg-black/45 border-purple-900/40 h-8 text-xs"
                  />
                  <Button onClick={applyCoupon} size="sm" variant="outline" className="border-purple-800/40 h-8 text-xs">
                    {language === 'en' ? 'Apply' : 'लागू करें'}
                  </Button>
                </div>

                {/* Bill Breakdown */}
                <div className="border-t border-purple-900/20 pt-3 space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{language === 'en' ? 'Session rate (15 Mins)' : 'परामर्श शुल्क (15 मिनट)'}</span>
                    <span>₹{selectedAstro.price * 10 * 15}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>{language === 'en' ? '50% Promo Discount' : '५०% कूपन डिस्काउंट'}</span>
                      <span>-₹{(selectedAstro.price * 10 * 15) / 2}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-sm text-purple-300">
                    <span>{language === 'en' ? 'Total Payable' : 'कुल देय राशि'}</span>
                    <span>₹{discountApplied ? (selectedAstro.price * 10 * 15) / 2 : (selectedAstro.price * 10 * 15)}</span>
                  </div>
                </div>

                {/* Simulated credit card checkout form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-3 pt-3 border-t border-purple-900/20">
                  <div className="flex items-center gap-1.5 text-[10px] text-purple-400 font-bold tracking-wider">
                    <CreditCard className="h-4.5 w-4.5" />
                    {language === 'en' ? 'STRIPE / RAZORPAY GATEWAY' : 'सुरक्षित भुगतान गेटवे'}
                  </div>
                  <Input 
                    type="text" 
                    required 
                    placeholder="Card Number / कार्ड नंबर" 
                    className="bg-black/55 border-purple-900/50 h-8 text-xs font-mono"
                    defaultValue="4111 2222 3333 4444"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      type="text" 
                      required 
                      placeholder="MM/YY" 
                      className="bg-black/55 border-purple-900/50 h-8 text-xs" 
                      defaultValue="12/29"
                    />
                    <Input 
                      type="password" 
                      required 
                      placeholder="CVV" 
                      className="bg-black/55 border-purple-900/50 h-8 text-xs font-mono"
                      defaultValue="123" 
                    />
                  </div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 h-9 font-bold mt-2">
                    <Sparkles className="mr-1 h-4 w-4 text-yellow-300" />
                    {language === 'en' ? 'Authorize Payment' : 'सुरक्षित भुगतान करें'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default VideoChatPage;
