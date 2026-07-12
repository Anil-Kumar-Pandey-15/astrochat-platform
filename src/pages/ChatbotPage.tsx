import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, User, Bot, HelpCircle, Key, Link2 } from "lucide-react";
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const ChatbotPage = () => {
  const { t, language } = useTranslation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Saved Kundalis Context
  const [savedKundalis, setSavedKundalis] = useState<any[]>([]);
  const [selectedChartId, setSelectedChartId] = useState<string>('none');
  
  // Custom API Key
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyPanel, setShowKeyPanel] = useState<boolean>(false);

  useEffect(() => {
    // Load saved Kundalis from localStorage
    const saved = JSON.parse(localStorage.getItem('saved_kundalis') || '[]');
    setSavedKundalis(saved);

    // Initial greeting
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: language === 'en'
          ? "Welcome! I am AstroChat AI, your Vedic Astrologer. You can link your birth chart from the dropdown above and ask me questions about your Career, Marriage, Travel, or Health."
          : "स्वागत है! मैं एस्ट्रोचैट एआई हूं, आपका व्यक्तिगत वैदिक ज्योतिषी। आप ऊपर दिए गए ड्रॉपडाउन से अपनी जन्म कुंडली लिंक कर सकते हैं और मुझसे करियर, विवाह, विदेश यात्रा या स्वास्थ्य से जुड़े प्रश्न पूछ सकते हैं।",
        timestamp: new Date()
      }
    ]);

    // Load API key from localStorage if it exists
    const savedKey = localStorage.getItem('astro_openai_key');
    if (savedKey) setApiKey(savedKey);
  }, [language]);

  const handleSaveApiKey = () => {
    localStorage.setItem('astro_openai_key', apiKey);
    toast.success(language === 'en' ? "OpenAI API Key saved!" : "ओपनएआई एपीआई कुंजी सहेज ली गई है!");
    setShowKeyPanel(false);
  };

  const getAIResponse = async (question: string, chart: any): Promise<string> => {
    // Simulating API Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // If custom API Key is set, try to fetch real OpenAI response
    if (apiKey.trim().startsWith('sk-')) {
      try {
        const systemPrompt = `You are a professional Vedic Astrologer. Answer the user's questions clearly in ${
          language === 'hi' ? 'Hindi' : 'English'
        }. If chart details are supplied, use them in your predictions.
        Chart Details: Name: ${chart?.name || 'Unknown'}, Lagna Sign: ${chart?.data?.planets[0]?.sign || 'Aries'}, Moon Sign: ${
          chart?.data?.panchang?.rashiMoon || 'Taurus'
        }, Nakshatra: ${chart?.data?.panchang?.nakshatra || 'Rohini'}, Current Dasha: ${
          chart?.data?.dashas[0]?.planet || 'Saturn'
        }. Make your answers sound authentic, warm, and astrologically precise.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: question }
            ],
            max_tokens: 300
          })
        });

        if (response.ok) {
          const resData = await response.json();
          return resData.choices[0].message.content;
        } else {
          console.warn("OpenAI API response error, falling back to local reasoning.");
        }
      } catch (err) {
        console.error("OpenAI Fetch failed", err);
      }
    }

    // Local Astro-Reasoning Fallback Engine
    const isHindi = ['hi', 'mr', 'ta', 'te', 'gu', 'bn', 'kn'].includes(language);
    const qLower = question.toLowerCase();

    const lagna = chart?.data?.planets[0]?.sign || "Virgo";
    const moonSign = chart?.data?.panchang?.rashiMoon || "Cancer";
    const currentDasha = chart?.data?.dashas?.[0]?.planet || "Saturn";
    const name = chart?.name || (isHindi ? "यजमान" : "seeker");

    if (qLower.includes('job') || qLower.includes('career') || qLower.includes('work') || qLower.includes('नौकरी') || qLower.includes('करियर')) {
      if (chart) {
        return isHindi
          ? `नमस्ते ${name}, आपकी जन्म कुंडली के अनुसार आपका लग्न ${lagna} है और वर्तमान में आप ${currentDasha} की महादशा से गुजर रहे हैं। 2026 में, गोचर में देवगुरु बृहस्पति आपके कर्म भाव (10वें भाव) पर शुभ दृष्टि डालेंगे। यह गोचर आपके करियर के लिए अत्यंत फलदायी साबित होगा, विशेष रूप से 2026 के मध्य में आपको तकनीकी या सॉफ्टवेयर क्षेत्र में नया पद प्राप्त होने के प्रबल योग हैं। शनिवार को सरसों तेल का दीया जलाएं ताकि राह की रुकावटें दूर हों।`
          : `Hello ${name}. According to your birth chart (Lagna: ${lagna}, Moon Sign: ${moonSign}), you are currently running the ${currentDasha} Mahadasha. In 2026, Jupiter will transit through Taurus, casting a positive aspect on your 10th house of career. This creates an extremely auspicious window for software and technical job placements, particularly around the second quarter of 2026. Chant Saturn mantras on Saturdays for removing blockages.`;
      } else {
        return isHindi
          ? "करियर के लिए यह समय कौशल विकास और योजना बनाने का है। बृहस्पति का गोचर आपके दशम भाव को अनुकूल बल दे रहा है, जिससे आगामी महीनों में नौकरी के अच्छे अवसर प्राप्त होंगे।"
          : "For career, this is a period for skill enhancement. The upcoming transits look promising, opening doors for growth in the next few months.";
      }
    }

    if (qLower.includes('marriage') || qLower.includes('partner') || qLower.includes('शादी') || qLower.includes('विवाह')) {
      if (chart) {
        return isHindi
          ? `प्रिय ${name}, आपकी जन्म कुंडली में विवाह का स्वामी अनुकूल स्थिति में है। ${currentDasha} महादशा और गोचर बल के अनुसार, वर्ष 2026 के उत्तरार्ध में विवाह वार्ता सफल होने के मजबूत संकेत हैं। बृहस्पति का गोचर आपके संबंधों को मधुरता देगा और मांगलिक कार्यों का मार्ग प्रशस्त करेगा।`
          : `Dear ${name}. In your birth chart, the lord of the 7th house (Marriage) is placed in a favorable position. Under the current ${currentDasha} Dasha and transits, the latter half of 2026 shows highly favorable prospects for marriage and matching proposals.`;
      } else {
        return isHindi
          ? "विवाह के लिए वर्ष का दूसरा हिस्सा अधिक अनुकूल है। बृहस्पति का गोचर आपके सप्तम भाव पर शुभ दृष्टि डालेगा, जिससे संबंध परिपक्व होंगे।"
          : "The second half of the year is more favorable for relationships. Jupiter's aspect on the 7th house will smooth out marriage prospects.";
      }
    }

    if (qLower.includes('abroad') || qLower.includes('travel') || qLower.includes('विदेश') || qLower.includes('यात्रा')) {
      if (chart) {
        return isHindi
          ? `आपकी कुंडली में 12वां भाव विदेश यात्रा का प्रतिनिधित्व करता है। आपके ${lagna} लग्न के अनुसार, 9वें स्वामी और 12वें स्वामी के बीच सुंदर युति संबंध है, जो दर्शाता है कि आप ${currentDasha} दशा के अंतर्गत 2026-2027 के मध्य विदेश गमन या विदेशी संस्था से जुड़कर लाभ कमाने में सफल होंगे।`
          : `The 12th house in your birth chart represents foreign lands. With ${lagna} Lagna, the connection between your 9th and 12th lords indicates a strong likelihood of overseas travel or joining a global firm during 2026-2027 under the ${currentDasha} period.`;
      } else {
        return isHindi
          ? "विदेश यात्रा के लिए वर्तमान गोचर सामान्य है। जन्म कुंडली में यदि राहु और 12वें भाव के स्वामी मजबूत हों, तो विदेश जाने के मार्ग शीघ्र खुल जाते हैं।"
          : "The current transits show average support for foreign travel. A detailed analysis of the 12th house and Rahu is required to confirm exact dates.";
      }
    }

    // Default response
    return isHindi
      ? `हे ${name}, ब्रह्मांडीय ऊर्जाएं आपके जीवन में एक महत्वपूर्ण परिवर्तन काल की ओर संकेत कर रही हैं। वर्तमान में ${currentDasha} महादशा का प्रभाव है। शांत रहकर ध्यान करें, और अपने दैनिक पंचांग के अनुसार शुभ चौघड़िया में ही कार्य शुरू करें।`
      : `Dear ${name}, the cosmic transits indicate a period of transformation. You are currently running the ${currentDasha} Mahadasha. Practice mindfulness and try to align your major decisions with the auspicious Choghadiya and Hora hours.`;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Find active chart if selected
      const activeChart = savedKundalis.find(k => k.id.toString() === selectedChartId);
      const response = await getAIResponse(userMessage.text, activeChart);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      toast.error(language === 'en' ? "Something went wrong" : "कुछ त्रुटि हुई");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = language === 'en'
    ? ["Will I get a software job in 2026?", "How is my marriage compatibility?", "Will I go abroad?", "Remedies for current Dasha"]
    : ["क्या मुझे 2026 में सॉफ्टवेयर की नौकरी मिलेगी?", "मेरी शादी के योग कब हैं?", "क्या मैं विदेश यात्रा कर पाऊंगा?", "दशा निवारण के उपाय बताएं"];

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">
            {language === 'en' ? 'AstroChat AI Guidance' : 'एस्ट्रोचैट एआई परामर्श'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'en' ? 'Vedic Astrological AI guide combining birth charts, dashas and transits' : 'आपकी जन्म कुंडली, गोचर और महादशा का विश्लेषण कर मार्गदर्शन देने वाला एआई परामर्शदाता'}
          </p>
        </div>

        {/* Configurations Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-purple-950/15 p-4 rounded-xl border border-purple-900/20 mb-6">
          {/* Chart Linker */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link2 className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-200 whitespace-nowrap">
              {language === 'en' ? 'Link Chart' : 'कुंडली लिंक करें'}:
            </span>
            <Select value={selectedChartId} onValueChange={setSelectedChartId}>
              <SelectTrigger className="bg-black/35 border-purple-900/40 text-xs w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{language === 'en' ? 'No Chart Linked' : 'कोई कुंडली लिंक नहीं'}</SelectItem>
                {savedKundalis.map(k => (
                  <SelectItem key={k.id} value={k.id.toString()}>{k.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* API Key Configure */}
          <div className="w-full sm:w-auto text-right">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowKeyPanel(!showKeyPanel)}
              className="text-xs text-purple-300 hover:text-purple-200"
            >
              <Key className="mr-1 h-3.5 w-3.5" />
              {language === 'en' ? 'Configure OpenAI API Key' : 'ओपनएआई एपीआई की सेट करें'}
            </Button>
          </div>
        </div>

        {/* API Key panel toggle */}
        {showKeyPanel && (
          <Card className="border-purple-800 bg-purple-950/20 mb-6 p-4">
            <h4 className="text-sm font-semibold text-purple-200 mb-2">{language === 'en' ? 'Enter OpenAI API Key (sk-...)' : 'ओपनएआई एपीआई की दर्ज करें (sk-...)'}</h4>
            <p className="text-xs text-muted-foreground mb-4">
              {language === 'en' ? 'If provided, the AI Chatbot will fetch live, high-precision Vedic analysis from OpenAI. Leave blank to use our built-in Vedic simulation.' : 'दर्ज करने पर चैटबॉट सीधे जीपीटी-४ द्वारा सटीक फल कथन लाएगा। खाली रखने पर स्थानीय वैदिक एआई सिमुलेटर काम करेगा।'}
            </p>
            <div className="flex gap-2">
              <Input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="sk-proj-..."
                className="bg-black/45 border-purple-900/40"
              />
              <Button onClick={handleSaveApiKey} className="bg-purple-600 hover:bg-purple-700">
                {language === 'en' ? 'Save Key' : 'कुंजी सहेजें'}
              </Button>
            </div>
          </Card>
        )}

        {/* Chat Window */}
        <Card className="border-purple-900/30 bg-purple-950/10">
          <CardContent className="pt-6 h-[400px] overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start max-w-[80%] p-3 rounded-xl border ${
                  m.sender === 'user' 
                    ? 'bg-purple-600 border-purple-500 text-white' 
                    : 'bg-purple-950/40 border-purple-900/20 text-slate-100'
                }`}>
                  {m.sender === 'bot' && (
                    <Avatar className="h-6 w-6 mr-2 bg-purple-900 flex items-center justify-center text-xs">
                      <Bot className="h-4 w-4 text-purple-300" />
                    </Avatar>
                  )}
                  <div>
                    <span className="text-[10px] text-muted-foreground block mb-1">
                      {m.sender === 'user' ? t('common.you') : 'Astro AI'}
                    </span>
                    <p className="text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line">{m.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 p-3 bg-purple-950/30 border border-purple-900/20 rounded-xl">
                  <RefreshCw className="h-4 w-4 text-purple-400 animate-spin" />
                  <span className="text-xs text-muted-foreground">{language === 'en' ? 'Astro AI is scanning your chart...' : 'एस्ट्रो एआई आपकी कुंडली देख रहा है...'}</span>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-3 border-t border-purple-900/10 flex flex-col gap-4">
            {/* suggestions */}
            <div className="w-full">
              <span className="text-xs font-semibold text-purple-400 block mb-2 flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" />
                {language === 'en' ? 'Suggested Astro Queries:' : 'सुझाए गए प्रश्न:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setInput(s)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-purple-900/30 bg-purple-950/15 hover:bg-purple-900/25 text-slate-300 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="flex w-full gap-2">
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={handleKeyDown}
                placeholder={language === 'en' ? "Ask about your job, career or marriage..." : "करियर, नौकरी या विवाह के योग के बारे में पूछें..."}
                className="bg-black/35 border-purple-900/40 text-sm"
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ChatbotPage;
