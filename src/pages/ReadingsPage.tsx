import React, { useState, useRef, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Sparkles, RefreshCw, Layers, ShieldAlert, Award } from 'lucide-react';
import { toast } from 'sonner';

// Major Arcana Tarot Cards
const TAROT_DECK = [
  { name: "The Fool (मूर्ख)", meaning: "New beginnings, optimism, trust in life, spontaneous decisions.", cardImage: "🃏" },
  { name: "The Magician (जादूगर)", meaning: "Manifestation, resourcefulness, power, inspired action.", cardImage: "🧙‍♂️" },
  { name: "The High Priestess (उच्च पुजारिन)", meaning: "Intuition, sacred knowledge, divine feminine, subconscious mind.", cardImage: "🧝‍♀️" },
  { name: "The Empress (महारानी)", meaning: "Femininity, beauty, nature, nurturing, abundance.", cardImage: "👑" },
  { name: "The Emperor (महाराजा)", meaning: "Authority, establishment, structure, protective father figure.", cardImage: "🏰" },
  { name: "The Hierophant (गुरु)", meaning: "Spiritual wisdom, religious beliefs, conformity, tradition.", cardImage: "🙏" },
  { name: "The Lovers (प्रेमी)", meaning: "Love, harmony, relationships, values alignment, choices.", cardImage: "❤️" },
  { name: "The Chariot (रथ)", meaning: "Control, willpower, victory, assertion, determination.", cardImage: "🏎️" },
  { name: "Strength (बल)", meaning: "Strength, courage, persuasion, influence, compassion.", cardImage: "🦁" },
  { name: "The Hermit (सन्यासी)", meaning: "Soul searching, inner guidance, spiritual mentor, solitude.", cardImage: "🕯️" },
  { name: "Wheel of Fortune (भाग्य चक्र)", meaning: "Good luck, karma, life cycles, destiny, turning point.", cardImage: "🎡" },
  { name: "Justice (न्याय)", meaning: "Justice, fairness, truth, cause and effect, law.", cardImage: "⚖️" }
];

export const ReadingsPage: React.FC = () => {
  const { t, language } = useTranslation();
  
  // Tarot State
  const [tarotCategory, setTarotCategory] = useState('Love');
  const [shuffled, setShuffled] = useState(false);
  const [drawnCards, setDrawnCards] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false]);

  // Palm Reading State
  const [palmImage, setPalmImage] = useState<string | null>(null);
  const [scanningPalm, setScanningPalm] = useState(false);
  const [palmReport, setPalmReport] = useState<any>(null);
  const palmCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Face Reading State
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [scanningFace, setScanningFace] = useState(false);
  const [faceReport, setFaceReport] = useState<any>(null);
  const faceCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Tarot Drawing
  const handleShuffle = () => {
    setShuffled(true);
    setDrawnCards([]);
    setFlippedCards([false, false, false]);
    toast.success(language === 'en' ? "Tarot deck shuffled!" : "टैरो कार्ड अच्छी तरह से फेंट दिए गए हैं!");
  };

  const handleDrawCard = () => {
    if (!shuffled) {
      toast.error(language === 'en' ? "Shuffle the deck first!" : "कृपया पहले कार्ड को फेंट लें (Shuffle)!");
      return;
    }
    
    // Draw 3 unique cards
    const indices: number[] = [];
    while (indices.length < 3) {
      const rand = Math.floor(Math.random() * TAROT_DECK.length);
      if (!indices.includes(rand)) {
        indices.push(rand);
      }
    }
    setDrawnCards(indices);
    toast.success(language === 'en' ? "3 Cards drawn! Click to reveal them." : "३ कार्ड निकाले गए हैं! उन पर क्लिक कर फल जानें।");
  };

  const handleFlip = (idx: number) => {
    const updated = [...flippedCards];
    updated[idx] = true;
    setFlippedCards(updated);
  };

  // 2. Palm Scanning Simulation
  const handlePalmUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPalmImage(reader.result as string);
        setPalmReport(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startPalmScan = () => {
    if (!palmImage) return;
    setScanningPalm(true);
    setTimeout(() => {
      setScanningPalm(false);
      setPalmReport({
        lifeLine: language === 'en' ? "Strong, long and clear. Indicates excellent health, high vitality, and a long prosperous life." : "स्पष्ट और लंबी जीवन रेखा - उत्तम स्वास्थ्य, उच्च जीवनी शक्ति और दीर्घायु होने का संकेत देती है।",
        heartLine: language === 'en' ? "Curved and ending near the index finger. Shows a deeply emotional, passionate, and loving nature." : "बृहस्पति पर्वत तक जाने वाली हृदय रेखा - भावुक, संवेदनशील और वफादार स्वभाव दर्शाती है।",
        headLine: language === 'en' ? "Straight and long. Denotes sharp analytical intelligence, focus, and logical decision-making skills." : "सीधी और लंबी मस्तिष्क रेखा - तीक्ष्ण बुद्धि, गहरी एकाग्रता और निर्णय क्षमता दर्शाती है।",
        fateLine: language === 'en' ? "Rising from the wrist straight to the middle finger. Suggests a stable career with early success and financial security." : "कलाई से सीधे शनि पर्वत तक जाने वाली भाग्य रेखा - व्यवसाय या करियर में शीघ्र सफलता और वित्तीय समृद्धि दर्शाती है।"
      });
      drawPalmOverlays();
      toast.success(language === 'en' ? "Palm scan complete!" : "हस्तरेखा स्कैन पूर्ण हो गया है!");
    }, 3000);
  };

  const drawPalmOverlays = () => {
    const canvas = palmCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw lines over the uploaded palm image
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    // 1. Life Line (Green curve)
    ctx.strokeStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(130, 150);
    ctx.quadraticCurveTo(100, 240, 200, 320);
    ctx.stroke();

    // 2. Head Line (Blue straight)
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(130, 150);
    ctx.lineTo(260, 200);
    ctx.stroke();

    // 3. Heart Line (Pink straight/curve)
    ctx.strokeStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(120, 120);
    ctx.quadraticCurveTo(200, 130, 280, 100);
    ctx.stroke();

    // 4. Fate Line (Yellow vertical)
    ctx.strokeStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(200, 340);
    ctx.lineTo(200, 160);
    ctx.stroke();
  };

  // 3. Face Scanning Simulation
  const handleFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFaceImage(reader.result as string);
        setFaceReport(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startFaceScan = () => {
    if (!faceImage) return;
    setScanningFace(true);
    setTimeout(() => {
      setScanningFace(false);
      setFaceReport({
        forehead: language === 'en' ? "Broad and flat. Represents high wisdom, analytical thinking, and learning capabilities." : "चौड़ा और समतल मस्तक - उच्च बौद्धिक क्षमता, गहरी सूझ-बूझ और रचनात्मकता का परिचायक है।",
        eyes: language === 'en' ? "Deep-set and sharp. Suggests a focused, intuitive, and secretive nature with strong observation." : "गहरी और तीक्ष्ण आँखें - अत्यधिक केंद्रित, अंतर्ज्ञानी और दूसरों को परखने की अद्भुत क्षमता दर्शाती हैं।",
        nose: language === 'en' ? "Straight with a rounded tip. Indicates high financial success, ambition, and career growth." : "सीधी और सुडौल नासिका - वित्तीय समृद्धि, महत्वाकांक्षा और नेतृत्व क्षमता का संकेत देती है।",
        chin: language === 'en' ? "Strong and prominent. Denotes willpower, determination, and a happy settled late life." : "सुदृढ़ और उभरी हुई ठोड़ी - दृढ़ संकल्प, इच्छाशक्ति और बुढ़ापे में सुखी व शांत जीवन दर्शाती है।"
      });
      drawFaceOverlays();
      toast.success(language === 'en' ? "Face scan complete!" : "चेहरा स्कैन पूर्ण हो गया है!");
    }, 3000);
  };

  const drawFaceOverlays = () => {
    const canvas = faceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw circular tracker nodes
    ctx.fillStyle = '#a855f7';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;

    const drawNode = (cx: number, cy: number, r: number) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    };

    // Forehead node
    drawNode(150, 60, 6);
    // Left eye node
    drawNode(110, 110, 5);
    // Right eye node
    drawNode(190, 110, 5);
    // Nose tip node
    drawNode(150, 160, 6);
    // Mouth node
    drawNode(150, 210, 5);
    // Chin node
    drawNode(150, 260, 6);
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">
            {language === 'en' ? 'AI Readings Lab (Tarot, Palm & Face)' : 'एआई पठन प्रयोगशाला (टैरो, हस्तरेखा एवं मुखाकृति)'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'en' ? 'Get instant cosmic guidance using our interactive scanning and drawing interfaces' : 'सुंदर इंटरफेस और एआई स्कैनिंग के माध्यम से अपने भविष्य की जानकारी प्राप्त करें'}
          </p>
        </div>

        <Tabs defaultValue="tarot" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-purple-950/20 border border-purple-900/30">
              <TabsTrigger value="tarot">{language === 'en' ? 'AI Tarot Reading' : 'एआई टैरो पठन'}</TabsTrigger>
              <TabsTrigger value="palm">{language === 'en' ? 'Palmistry Scan' : 'हस्तरेखा स्कैन'}</TabsTrigger>
              <TabsTrigger value="face">{language === 'en' ? 'Face Reading' : 'फेस रीडिंग (मुखाकृति)'}</TabsTrigger>
            </TabsList>
          </div>

          {/* Tarot Tab */}
          <TabsContent value="tarot">
            <Card className="bg-purple-950/10 border-purple-900/30">
              <CardHeader className="text-center">
                <CardTitle className="text-purple-300">{language === 'en' ? 'Vedic 3-Card Tarot Reading' : '३-कार्ड टैरो भविष्य पठन'}</CardTitle>
                <CardDescription>
                  {language === 'en' ? 'Focus on your question, shuffle, draw 3 cards for Past, Present, and Future' : 'अपने मन में सवाल सोचें, फेंटें, और भूत, वर्तमान व भविष्य के ३ कार्ड निकालें'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Control Panel */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">{language === 'en' ? 'Focus Area' : 'कार्यक्षेत्र'}:</span>
                    <Select value={tarotCategory} onValueChange={setTarotCategory}>
                      <SelectTrigger className="bg-black/35 border-purple-900/40 text-sm w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Love">{language === 'en' ? 'Love' : 'प्रेम जीवन'}</SelectItem>
                        <SelectItem value="Career">{language === 'en' ? 'Career' : 'नौकरी-व्यवसाय'}</SelectItem>
                        <SelectItem value="Finance">{language === 'en' ? 'Finance' : 'धन संपत्ति'}</SelectItem>
                        <SelectItem value="Health">{language === 'en' ? 'Health' : 'स्वास्थ्य'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleShuffle} variant="outline" className="border-purple-800/40">
                      <RefreshCw className="mr-2 h-4 w-4 text-purple-400" />
                      {language === 'en' ? 'Shuffle Deck' : 'कार्ड फेंटें'}
                    </Button>
                    <Button onClick={handleDrawCard} className="bg-purple-600 hover:bg-purple-700" disabled={!shuffled}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {language === 'en' ? 'Draw 3 Cards' : '३ कार्ड निकालें'}
                    </Button>
                  </div>
                </div>

                {/* Cards Board */}
                {drawnCards.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    {["अतीत (PAST)", "वर्तमान (PRESENT)", "भविष्य (FUTURE)"].map((position, idx) => {
                      const card = TAROT_DECK[drawnCards[idx]];
                      const isFlipped = flippedCards[idx];

                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <span className="text-[11px] font-bold text-purple-400 mb-2 uppercase tracking-widest">{position}</span>
                          
                          {/* Card Flip Container */}
                          <div 
                            onClick={() => handleFlip(idx)}
                            className="w-[150px] h-[230px] cursor-pointer relative transition-transform duration-500 transform-style-3d hover:scale-105"
                            style={{
                              transform: isFlipped ? 'rotateY(180deg)' : 'none'
                            }}
                          >
                            {/* Front Side (Card Image & meaning) - Backface hidden handles rotation */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 to-purple-950 rounded-xl border border-purple-800 flex flex-col items-center justify-center p-3 text-center rotate-y-180 backface-hidden">
                              <span className="text-4xl mb-4">{card.cardImage}</span>
                              <h4 className="text-xs font-bold text-purple-300">{card.name}</h4>
                              <p className="text-[10px] text-slate-300 mt-2 leading-relaxed">{card.meaning}</p>
                            </div>

                            {/* Back Side (Cosmic Pattern) */}
                            <div className="absolute inset-0 bg-slate-900 border border-purple-800 rounded-xl flex flex-col items-center justify-center p-3 text-center backface-hidden">
                              <div className="w-full h-full rounded-lg border border-purple-900/30 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black">
                                <span className="text-2xl text-purple-600 opacity-60">✨🌀✨</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Palm Reading Tab */}
          <TabsContent value="palm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Scan interface */}
              <Card className="bg-purple-950/10 border-purple-900/30">
                <CardHeader>
                  <CardTitle>{language === 'en' ? 'Upload Hand' : 'हाथ का चित्र अपलोड करें'}</CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Ensure your palm lines are clearly visible under good light' : 'स्पष्ट रोशनी में अपने हाथ की लकीरें दिखाने वाला फोटो अपलोड करें'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-6">
                  {/* Upload box */}
                  <div className="relative w-[300px] h-[300px] border border-purple-900/30 bg-black/45 rounded-lg overflow-hidden flex items-center justify-center">
                    {palmImage ? (
                      <>
                        <img src={palmImage} alt="Palm" className="w-full h-full object-cover" />
                        <canvas 
                          ref={palmCanvasRef} 
                          width={300} 
                          height={300} 
                          className="absolute inset-0 w-full h-full pointer-events-none" 
                        />
                        {/* Laser Scanner Effect */}
                        {scanningPalm && (
                          <div className="absolute inset-x-0 h-1 bg-purple-500 shadow-[0_0_15px_#a855f7] animate-scanner" />
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                        <Upload className="h-10 w-10 text-purple-800/40 mb-3" />
                        <span className="text-xs">{language === 'en' ? 'Click to select hand image' : 'हाथ की इमेज चुनने के लिए क्लिक करें'}</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePalmUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  <Button 
                    onClick={startPalmScan} 
                    className="w-[200px] bg-purple-600 hover:bg-purple-700"
                    disabled={!palmImage || scanningPalm}
                  >
                    {scanningPalm ? (
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Scanning...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" />
                        {language === 'en' ? 'Scan Palm' : 'स्कैन शुरू करें'}
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Scan Result */}
              <div>
                {!palmReport ? (
                  <div className="flex flex-col items-center justify-center border border-purple-900/20 rounded-xl p-12 h-full text-center bg-purple-950/5">
                    <Layers className="h-16 w-16 text-purple-800/40 mb-4" />
                    <h3 className="text-xl font-medium text-purple-200">
                      {language === 'en' ? 'Palmistry Report' : 'हस्तरेखा फल विवरण'}
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                      {language === 'en' ? 'Upload an image and run the scanner to draw and analyze the palm lines' : 'हाथ का चित्र अपलोड कर एआई लकीरों का फल देखें'}
                    </p>
                  </div>
                ) : (
                  <Card className="bg-purple-950/5 border-purple-900/20">
                    <CardHeader>
                      <CardTitle className="text-purple-300 flex items-center">
                        <Award className="mr-2 text-emerald-400" />
                        {language === 'en' ? 'Palm Line Interpretations' : 'एआई हस्तरेखा फल विश्लेषण'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs select-text">
                      <div className="border-l-2 border-emerald-500 pl-3">
                        <span className="font-bold text-slate-200 text-sm block">जीवन रेखा (Life Line)</span>
                        <p className="text-slate-300 mt-1 leading-relaxed">{palmReport.lifeLine}</p>
                      </div>

                      <div className="border-l-2 border-pink-500 pl-3">
                        <span className="font-bold text-slate-200 text-sm block">हृदय रेखा (Heart Line)</span>
                        <p className="text-slate-300 mt-1 leading-relaxed">{palmReport.heartLine}</p>
                      </div>

                      <div className="border-l-2 border-blue-500 pl-3">
                        <span className="font-bold text-slate-200 text-sm block">मस्तिष्क रेखा (Head Line)</span>
                        <p className="text-slate-300 mt-1 leading-relaxed">{palmReport.headLine}</p>
                      </div>

                      <div className="border-l-2 border-yellow-500 pl-3">
                        <span className="font-bold text-slate-200 text-sm block">भाग्य रेखा (Fate Line)</span>
                        <p className="text-slate-300 mt-1 leading-relaxed">{palmReport.fateLine}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Face Reading Tab */}
          <TabsContent value="face">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Scan interface */}
              <Card className="bg-purple-950/10 border-purple-900/30">
                <CardHeader>
                  <CardTitle>{language === 'en' ? 'Upload Face Image' : 'अपना चेहरा अपलोड करें'}</CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Front-facing portrait with neutral expression yields best results' : 'स्पष्ट मुखाकृति की सीधी फोटो अपलोड करें'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-6">
                  {/* Upload box */}
                  <div className="relative w-[300px] h-[300px] border border-purple-900/30 bg-black/45 rounded-lg overflow-hidden flex items-center justify-center">
                    {faceImage ? (
                      <>
                        <img src={faceImage} alt="Face" className="w-full h-full object-cover" />
                        <canvas 
                          ref={faceCanvasRef} 
                          width={300} 
                          height={300} 
                          className="absolute inset-0 w-full h-full pointer-events-none" 
                        />
                        {/* Circular Scanning Node box overlay */}
                        {scanningFace && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 border border-purple-400 rounded-full border-dashed animate-spin opacity-60" />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                        <Upload className="h-10 w-10 text-purple-800/40 mb-3" />
                        <span className="text-xs">{language === 'en' ? 'Click to select face image' : 'चेहरे की इमेज चुनने के लिए क्लिक करें'}</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFaceUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  <Button 
                    onClick={startFaceScan} 
                    className="w-[200px] bg-purple-600 hover:bg-purple-700"
                    disabled={!faceImage || scanningFace}
                  >
                    {scanningFace ? (
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Scanning Face...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" />
                        {language === 'en' ? 'Scan Face' : 'चेहरा स्कैन करें'}
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Scan Result */}
              <div>
                {!faceReport ? (
                  <div className="flex flex-col items-center justify-center border border-purple-900/20 rounded-xl p-12 h-full text-center bg-purple-950/5">
                    <Sparkles className="h-16 w-16 text-purple-800/40 mb-4" />
                    <h3 className="text-xl font-medium text-purple-200">
                      {language === 'en' ? 'Face Reading Report' : 'मुखाकृति फल विश्लेषण'}
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                      {language === 'en' ? 'Upload photo and run the face detector nodes' : 'फोटो अपलोड कर एआई नोड्स द्वारा चरित्र और भाग्य का फल देखें'}
                    </p>
                  </div>
                ) : (
                  <Card className="bg-purple-950/5 border-purple-900/20">
                    <CardHeader>
                      <CardTitle className="text-purple-300 flex items-center">
                        <Award className="mr-2 text-emerald-400" />
                        {language === 'en' ? 'Facial Features Analysis' : 'एआई मुखाकृति लक्षण फल'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs select-text">
                      <div className="border-l-2 border-purple-500 pl-3">
                        <span className="font-bold text-slate-200 text-sm block">मस्तक लक्षण (Forehead)</span>
                        <p className="text-slate-300 mt-1 leading-relaxed">{faceReport.forehead}</p>
                      </div>

                      <div className="border-l-2 border-purple-500 pl-3">
                        <span className="font-bold text-slate-200 text-sm block">नेत्र लक्षण (Eyes)</span>
                        <p className="text-slate-300 mt-1 leading-relaxed">{faceReport.eyes}</p>
                      </div>

                      <div className="border-l-2 border-purple-500 pl-3">
                        <span className="font-bold text-slate-200 text-sm block">नासिका लक्षण (Nose)</span>
                        <p className="text-slate-300 mt-1 leading-relaxed">{faceReport.nose}</p>
                      </div>

                      <div className="border-l-2 border-purple-500 pl-3">
                        <span className="font-bold text-slate-200 text-sm block">ठोड़ी लक्षण (Chin & Mouth)</span>
                        <p className="text-slate-300 mt-1 leading-relaxed">{faceReport.chin}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};
export default ReadingsPage;
