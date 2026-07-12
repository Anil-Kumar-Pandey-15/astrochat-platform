import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { zodiacSigns } from '@/data/zodiacSigns';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Heart, Briefcase, Award, Coins, Activity, Sparkles, Hash, AlertCircle } from "lucide-react";
import { toast } from 'sonner';

export const BhavisyafalPage = () => {
  const { t, language } = useTranslation();
  
  // Tab 1: Horoscope
  const [sign, setSign] = useState<string>('');
  const [timeframe, setTimeframe] = useState<string>('daily');
  const [showPrediction, setShowPrediction] = useState<boolean>(false);

  // Tab 2: Lal Kitab Remedies
  const [selectedPlanet, setSelectedPlanet] = useState<string>('Sun');
  const [showRemedies, setShowRemedies] = useState<boolean>(false);

  // Tab 3: Numerology
  const [numName, setNumName] = useState<string>('');
  const [numBirthDate, setNumBirthDate] = useState<string>('');
  const [numResult, setNumResult] = useState<any>(null);

  const formatName = (name: string) => {
    return language === 'en' ? name : t(`zodiac.${name.toLowerCase()}.name`);
  };

  const handleHoroscopeSubmit = () => {
    if (sign) {
      setShowPrediction(true);
    }
  };

  const handleRemediesSubmit = () => {
    setShowRemedies(true);
  };

  // Calculate Chaldean/Pythagorean Numerology
  const handleNumerologySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numName || !numBirthDate) {
      toast.error(language === 'en' ? "Please fill in both fields." : "कृपया नाम और जन्म तिथि दोनों भरें।");
      return;
    }

    // 1. Life Path Number
    // Sum all digits in birth date: YYYY-MM-DD
    const digits = numBirthDate.replace(/-/g, '').split('').map(Number);
    const sumDigits = (arr: number[]): number => {
      const sum = arr.reduce((acc, curr) => acc + curr, 0);
      if (sum > 9) {
        return sumDigits(sum.toString().split('').map(Number));
      }
      return sum;
    };
    const lifePath = sumDigits(digits);

    // 2. Destiny Number
    // Convert name characters to values (Pythagorean: A=1, B=2... I=9, J=1, K=2...)
    const nameClean = numName.toUpperCase().replace(/[^A-Z]/g, '');
    const charValues = nameClean.split('').map(char => {
      const code = char.charCodeAt(0) - 64; // A=1...
      return (code % 9) || 9;
    });
    const destiny = sumDigits(charValues);

    // 3. Personality Number (consonants sum)
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const consonantsOnly = nameClean.split('').filter(c => !vowels.includes(c));
    const consValues = consonantsOnly.map(char => {
      const code = char.charCodeAt(0) - 64;
      return (code % 9) || 9;
    });
    const personality = sumDigits(consValues);

    const luckyDatesMap: Record<number, string> = {
      1: "1, 10, 19, 28",
      2: "2, 11, 20, 29",
      3: "3, 12, 21, 30",
      4: "4, 13, 22, 31",
      5: "5, 14, 23",
      6: "6, 15, 24",
      7: "7, 16, 25",
      8: "8, 17, 26",
      9: "9, 18, 27"
    };

    const luckyColorsMap: Record<number, string> = {
      1: "Yellow, Gold, Orange / पीला, सुनहरा",
      2: "White, Green, Silver / सफेद, चांदी, हरा",
      3: "Yellow, Purple, Mauve / पीला, बैंगनी",
      4: "Blue, Grey / नीला, ग्रे",
      5: "Light Green, White / हरा, सफेद",
      6: "Pink, Blue, White / गुलाबी, सफेद",
      7: "Light Green, Silver / हल्का हरा, चांदी",
      8: "Dark Blue, Purple / गहरा नीला, बैंगनी",
      9: "Red, Pink / लाल, गुलाबी"
    };

    const readingMap: Record<number, string> = {
      1: "नेतृत्व और स्वतंत्रता (Leader): आप जन्मजात नेता हैं। साहसी, रचनात्मक और महत्वाकांक्षी स्वभाव आपके लक्ष्यों को पूरा करने में सहायक होता है।",
      2: "सहयोग और कूटनीति (Diplomat): आप संवेदनशील, शांतिप्रिय और सहयोगी हैं। संबंधों को संजोना और दूसरों को समझना आपकी शक्ति है।",
      3: "रचनात्मकता और अभिव्यक्ति (Expressive): कला, लेखन और भाषण में आपकी गहरी रुचि है। सामाजिक स्वभाव और आशावाद आपकी पहचान है।",
      4: "मेहनती और व्यावहारिक (Builder): अनुशासन, व्यावहारिक सोच और कड़ी मेहनत आपकी नींव है। आप स्थिरता और विश्वसनीयता को महत्व देते हैं।",
      5: "स्वतंत्रता और साहसी (Explorer): आपको बदलाव, यात्रा और स्वतंत्रता पसंद है। बहुमुखी और अनुकूलनीय स्वभाव आपको नई चुनौतियों का सामना करने में मदद करता है।",
      6: "पोषण और जिम्मेदारी (Caregiver): आप सेवा, परिवार और प्रेम के प्रतीक हैं। कलात्मक रुचि और दूसरों का ख्याल रखना आपका मुख्य स्वभाव है।",
      7: "विश्लेषणात्मक और आध्यात्मिक (Seeker): सत्य की खोज, एकांत और चिंतन आपका स्वभाव है। आप वैज्ञानिक, दार्शनिक या आध्यात्मिक मार्ग चुनते हैं।",
      8: "भौतिक सफलता और अधिकार (Achiever): व्यवसाय, संगठन और धन प्रबंधन में आप कुशल हैं। आपके पास बड़ी जिम्मेदारी और अधिकार संभालने की शक्ति है।",
      9: "मानवतावादी और उदार (Humanitarian): आप सहानुभूति, कला और निःस्वार्थ सेवा के प्रति समर्पित हैं। विश्व कल्याण और कला में गहरी रुचि रखते हैं।"
    };

    setNumResult({
      lifePath,
      destiny,
      personality,
      luckyDates: luckyDatesMap[lifePath] || "1, 9",
      luckyColor: luckyColorsMap[lifePath] || "Yellow",
      reading: readingMap[lifePath] || "सामान्य शुभ स्वभाव।"
    });
    toast.success(language === 'en' ? "Numerology calculations complete!" : "अंक ज्योतिष फल तैयार है!");
  };

  const getLalKitabRemedies = (planet: string) => {
    const remediesMap: Record<string, any> = {
      Sun: {
        gem: "माणिक्य (Ruby)",
        donation: "लाल मसूर दाल, तांबा, गुड़, लाल कपड़ा रविवार सुबह दान करें।",
        mantra: "ॐ घृणि सूर्याय नमः",
        puja: "आदित्य हृदय स्तोत्र का पाठ करें। सूर्य को जल अर्पित करें।",
        fast: "रविवार व्रत (बिना नमक)",
        color: "लाल, भगवा (Saffron)",
        direction: "पूर्व (East)",
        remedy: "पिता का सम्मान करें, तांबे के लोटे से सूर्य को जल दें।"
      },
      Moon: {
        gem: "मोती (Pearl)",
        donation: "चावल, मिश्री, कपूर, सफेद कपड़ा सोमवार शाम दान करें।",
        mantra: "ॐ सों सोमाय नमः",
        puja: "शिव जी की पूजा करें, शिवलिंग पर दूध चढ़ाएं।",
        fast: "सोमवार व्रत",
        color: "सफेद, चांदी (Silver)",
        direction: "वायव्य (North-West)",
        remedy: "माता का आशीर्वाद लें, चांदी का चौकोर टुकड़ा अपने पास रखें।"
      },
      Mars: {
        gem: "मूंगा (Red Coral)",
        donation: "लाल मसूर, बूंदी, गुड़, तांबा मंगलवार दोपहर दान करें।",
        mantra: "ॐ अं अंगारकाय नमः",
        puja: "हनुमान जी की पूजा, हनुमान चालीसा या बजरंग बाण का पाठ।",
        fast: "मंगलवार व्रत",
        color: "गहरा लाल",
        direction: "दक्षिण (South)",
        remedy: "मीठी रोटियां बनाकर तंदूर में सेकें और पक्षियों या कुत्तों को खिलाएं।"
      },
      Mercury: {
        gem: "पन्ना (Emerald)",
        donation: "हरी मूंग दाल, कांस्य पात्र, हरा वस्त्र बुधवार दोपहर दान करें।",
        mantra: "ॐ बुं बुधाय नमः",
        puja: "दुर्गा सप्तशती का पाठ करें, गणेश जी को दूर्वा चढ़ाएं।",
        fast: "बुधवार व्रत",
        color: "हरा (Green)",
        direction: "उत्तर (North)",
        remedy: "अपनी बहन और बेटी का सम्मान करें, तांबे के पात्र में रात भर पानी रखकर सुबह पिएं।"
      },
      Jupiter: {
        gem: "पुखराज (Yellow Sapphire)",
        donation: "चना दाल, हल्दी, सोने या पीतल की वस्तु, पीला कपड़ा गुरुवार सुबह दान करें।",
        mantra: "ॐ बृं बृहस्पतये नमः",
        puja: "विष्णु सहस्रनाम का पाठ करें, केले के पेड़ की पूजा करें।",
        fast: "गुरुवार व्रत",
        color: "पीला, सुनहरा",
        direction: "ईशान (North-East)",
        remedy: "माथे पर रोजाना केसर या हल्दी का तिलक लगाएं, पीपल वृक्ष को जल दें।"
      },
      Venus: {
        gem: "हीरा या ओपल (Diamond/Opal)",
        donation: "दूध, दही, घी, कपूर, सफेद वस्त्र शुक्रवार शाम दान करें।",
        mantra: "ॐ शुं शुक्राय नमः",
        puja: "लक्ष्मी चालीसा, कनकधारा स्तोत्र का पाठ करें।",
        fast: "शुक्रवार व्रत (संतोषी माता या वैभव लक्ष्मी)",
        color: "चमकदार सफेद, गुलाबी",
        direction: "आग्नेय (South-East)",
        remedy: "इत्र (Perfume) का नियमित प्रयोग करें, जीवनसाथी का आदर करें।"
      },
      Saturn: {
        gem: "नीलम (Blue Sapphire)",
        donation: "काले तिल, उड़द दाल, सरसों तेल, लोहा शनिवार शाम दान करें।",
        mantra: "ॐ शं शनैश्चराय नमः",
        puja: "शनि चालीसा, हनुमान बाहुक का पाठ करें।",
        fast: "शनिवार व्रत",
        color: "काला, गहरा नीला",
        direction: "पश्चिम (West)",
        remedy: "शनिवार को पीपल वृक्ष के नीचे सरसों तेल का चौमुखी दीया जलाएं, कुत्तों को भोजन दें।"
      },
      Rahu: {
        gem: "गोमेद (Hessonite)",
        donation: "जौ, काले तिल, कोयला, नीले कपड़े दान करें।",
        mantra: "ॐ रां राहवे नमः",
        puja: "सरस्वती चालीसा या भैरव जी की पूजा।",
        fast: "शनिवार व्रत (राहु शांति)",
        color: "स्लेटी (Grey), धुआं रंग",
        direction: "नैऋत्य (South-West)",
        remedy: "शीशे की बोतल में गंगाजल भरकर घर में स्थापित करें, बहते पानी में नारियल प्रवाहित करें।"
      },
      Ketu: {
        gem: "लहसुनिया (Cat's Eye)",
        donation: "तिल, दोरंगी कंबल, लोहे की वस्तु दान करें।",
        mantra: "ॐ कें केतवे नमः",
        puja: "गणेश जी की पूजा, गणपति अथर्वशीर्ष का पाठ।",
        fast: "मंगलवार या शनिवार व्रत",
        color: "चितकबरा, भूरा",
        direction: "वायव्य (North-West)",
        remedy: "काले और सफेद कुत्ते को मीठी रोटियां खिलाएं, मंदिर में दोरंगी ध्वजा चढ़ाएं।"
      }
    };
    return remediesMap[planet] || remediesMap.Sun;
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">
            {language === 'en' ? 'Bhavisyafal & Lal Kitab Hub' : 'भविष्यफल एवं लाल किताब उपाय'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'en' ? 'Detailed predictions, customized Vedic remedies, and numerology calculations' : 'राशिफल भविष्यवाणियां, लाल किताब ग्रह दोष शांति उपाय, एवं अंक ज्योतिष फल'}
          </p>
        </div>

        <Tabs defaultValue="horoscope" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-purple-950/20 border border-purple-900/30">
              <TabsTrigger value="horoscope">{language === 'en' ? 'Zodiac Horoscope' : 'दैनिक राशिफल'}</TabsTrigger>
              <TabsTrigger value="lalkitab">{language === 'en' ? 'Lal Kitab Remedies' : 'लाल किताब उपाय'}</TabsTrigger>
              <TabsTrigger value="numerology">{language === 'en' ? 'Numerology' : 'अंक ज्योतिष'}</TabsTrigger>
            </TabsList>
          </div>

          {/* Horoscope Tab */}
          <TabsContent value="horoscope">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-purple-950/10 border-purple-900/30">
                <CardHeader>
                  <CardTitle>{t('common.getBhavisyafal')}</CardTitle>
                  <CardDescription>
                    {t('common.selectZodiacAndTimeframe')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('common.selectZodiac')}</label>
                      <Select value={sign} onValueChange={setSign}>
                        <SelectTrigger className="bg-black/35 border-purple-900/40 text-slate-300">
                          <SelectValue placeholder={t('common.selectZodiacSign')} />
                        </SelectTrigger>
                        <SelectContent>
                          {zodiacSigns.map((sign) => (
                            <SelectItem key={sign.name} value={sign.name}>
                              {sign.symbol} {formatName(sign.name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('common.selectTimeframe')}</label>
                      <Tabs defaultValue="daily" value={timeframe} onValueChange={setTimeframe} className="w-full">
                        <TabsList className="grid grid-cols-3 w-full bg-purple-950/20">
                          <TabsTrigger value="daily">{t('common.daily')}</TabsTrigger>
                          <TabsTrigger value="weekly">{t('common.weekly')}</TabsTrigger>
                          <TabsTrigger value="monthly">{t('common.monthly')}</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>

                  <Button 
                    onClick={handleHoroscopeSubmit} 
                    className="w-full bg-purple-600 hover:bg-purple-700" 
                    disabled={!sign}
                  >
                    {t('common.getBhavisyafal')}
                  </Button>

                  {showPrediction && sign && (
                    <div className="mt-8 space-y-6">
                      <Separator />
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-purple-300">
                          {formatName(sign)} {t('common.bhavisyafal')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 uppercase tracking-widest font-semibold text-purple-400">
                          {timeframe} Prediction
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-purple-950/20 rounded-lg border border-purple-900/10 flex gap-3">
                          <Heart className="h-5 w-5 text-pink-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm text-slate-200">{language === 'en' ? 'Love & Relationship' : 'प्रेम और संबंध'}</h4>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t('predictions.love').replace('{sign}', formatName(sign))}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-purple-950/20 rounded-lg border border-purple-900/10 flex gap-3">
                          <Briefcase className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm text-slate-200">{language === 'en' ? 'Career & Growth' : 'करियर और प्रगति'}</h4>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t('predictions.career').replace('{sign}', formatName(sign))}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-purple-950/20 rounded-lg border border-purple-900/10 flex gap-3">
                          <Coins className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm text-slate-200">{language === 'en' ? 'Finance & Property' : 'वित्त और संपत्ति'}</h4>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t('predictions.finance').replace('{sign}', formatName(sign))}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-purple-950/20 rounded-lg border border-purple-900/10 flex gap-3">
                          <Activity className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm text-slate-200">{language === 'en' ? 'Health & Vigor' : 'स्वास्थ्य और ऊर्जा'}</h4>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t('predictions.health').replace('{sign}', formatName(sign))}</p>
                          </div>
                        </div>
                      </div>

                      {/* Constants */}
                      <div className="grid grid-cols-3 gap-4 text-center mt-4">
                        <div className="bg-purple-950/30 p-2.5 rounded border border-purple-900/20">
                          <span className="text-[10px] text-muted-foreground block uppercase">{language === 'en' ? 'Lucky Colors' : 'भाग्यशाली रंग'}</span>
                          <span className="text-xs font-semibold text-purple-300">{t('predictions.luckyColors')}</span>
                        </div>
                        <div className="bg-purple-950/30 p-2.5 rounded border border-purple-900/20">
                          <span className="text-[10px] text-muted-foreground block uppercase">{language === 'en' ? 'Lucky Numbers' : 'भाग्यशाली अंक'}</span>
                          <span className="text-xs font-semibold text-purple-300">{t('predictions.luckyNumbers')}</span>
                        </div>
                        <div className="bg-purple-950/30 p-2.5 rounded border border-purple-900/20">
                          <span className="text-[10px] text-muted-foreground block uppercase">{language === 'en' ? 'Lucky Days' : 'अनुकूल दिन'}</span>
                          <span className="text-xs font-semibold text-purple-300">{t('predictions.luckyDays')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Lal Kitab Tab */}
          <TabsContent value="lalkitab">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-purple-950/10 border-purple-900/30">
                <CardHeader>
                  <CardTitle>{language === 'en' ? 'Lal Kitab Graha Remedies' : 'लाल किताब ग्रह शांति अचूक उपाय'}</CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Select afflicted planet to view customized Vedic remedies' : 'कमजोर या पीड़ित ग्रह का चयन कर लाल किताब के अचूक उपाय प्राप्त करें'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <Select value={selectedPlanet} onValueChange={setSelectedPlanet}>
                      <SelectTrigger className="bg-black/35 border-purple-900/40 text-slate-300 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button onClick={handleRemediesSubmit} className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap">
                      <Sparkles className="mr-2 h-4 w-4" />
                      {language === 'en' ? 'Get Remedies' : 'उपाय देखें'}
                    </Button>
                  </div>

                  {showRemedies && (
                    <div className="mt-8 space-y-6">
                      <Separator />
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-purple-300">
                          {selectedPlanet} {language === 'en' ? 'Peace Remedies' : 'ग्रह शांति दोष निवारण उपाय'}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 bg-purple-950/20 rounded border border-purple-900/10">
                          <span className="font-bold text-purple-300 text-xs block mb-1">१. रत्न धारण परामर्श (Gemstone)</span>
                          <p className="text-xs text-slate-300 leading-relaxed">{getLalKitabRemedies(selectedPlanet).gem}</p>
                        </div>
                        <div className="p-3.5 bg-purple-950/20 rounded border border-purple-900/10">
                          <span className="font-bold text-purple-300 text-xs block mb-1">२. महादान उपाय (Charity/Donation)</span>
                          <p className="text-xs text-slate-300 leading-relaxed">{getLalKitabRemedies(selectedPlanet).donation}</p>
                        </div>
                        <div className="p-3.5 bg-purple-950/20 rounded border border-purple-900/10">
                          <span className="font-bold text-purple-300 text-xs block mb-1">३. तांत्रिक मंत्र जाप (Mantra)</span>
                          <p className="text-xs text-slate-300 font-mono leading-relaxed">{getLalKitabRemedies(selectedPlanet).mantra}</p>
                        </div>
                        <div className="p-3.5 bg-purple-950/20 rounded border border-purple-900/10">
                          <span className="font-bold text-purple-300 text-xs block mb-1">४. देव आराधन नियम (Puja)</span>
                          <p className="text-xs text-slate-300 leading-relaxed">{getLalKitabRemedies(selectedPlanet).puja}</p>
                        </div>
                        <div className="p-3.5 bg-purple-950/20 rounded border border-purple-900/10">
                          <span className="font-bold text-purple-300 text-xs block mb-1">५. व्रत विधान नियम (Fasting)</span>
                          <p className="text-xs text-slate-300 leading-relaxed">{getLalKitabRemedies(selectedPlanet).fast}</p>
                        </div>
                        <div className="p-3.5 bg-purple-950/20 rounded border border-purple-900/10">
                          <span className="font-bold text-purple-300 text-xs block mb-1">६. अनुकूल रंग और दिशा</span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            शुभ रंग: {getLalKitabRemedies(selectedPlanet).color} | दिशा: {getLalKitabRemedies(selectedPlanet).direction}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-rose-950/15 border border-rose-900/25 rounded-lg flex gap-3">
                        <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-xs text-slate-200">दैनिक लाल किताब व्यवहार उपाय:</h4>
                          <p className="text-xs text-slate-300 mt-1">{getLalKitabRemedies(selectedPlanet).remedy}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Numerology Tab */}
          <TabsContent value="numerology">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-purple-950/10 border-purple-900/30">
                <CardHeader>
                  <CardTitle>{language === 'en' ? 'Vedic & Pythagorean Numerology Calculator' : 'वैदिक एवं पाइथागोरस अंक ज्योतिष'}</CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Enter name and birth date to calculate your core numbers' : 'अपना नाम और जन्म तिथि भरकर मूलांक, भाग्यांक, और शुभ रंग जानें'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleNumerologySubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold mb-1 block">{language === 'en' ? 'Your Name' : 'नाम दर्ज करें'}</label>
                      <Input 
                        value={numName} 
                        onChange={(e) => setNumName(e.target.value)} 
                        placeholder={language === 'en' ? 'John Doe' : 'अमित शर्मा'}
                        className="bg-black/35 border-purple-900/40 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold mb-1 block">{language === 'en' ? 'Birth Date' : 'जन्म तिथि'}</label>
                      <Input 
                        type="date" 
                        value={numBirthDate} 
                        onChange={(e) => setNumBirthDate(e.target.value)}
                        className="bg-black/35 border-purple-900/40 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-end">
                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                        <Hash className="mr-2 h-4 w-4" />
                        {language === 'en' ? 'Calculate Numbers' : 'अंक गणना करें'}
                      </Button>
                    </div>
                  </form>

                  {numResult && (
                    <div className="mt-8 space-y-6">
                      <Separator />
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/10">
                          <span className="text-[10px] text-muted-foreground block uppercase">मूलांक (Life Path)</span>
                          <span className="text-3xl font-extrabold text-purple-400">{numResult.lifePath}</span>
                        </div>
                        <div className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/10">
                          <span className="text-[10px] text-muted-foreground block uppercase">भाग्यांक (Destiny)</span>
                          <span className="text-3xl font-extrabold text-purple-400">{numResult.destiny}</span>
                        </div>
                        <div className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/10">
                          <span className="text-[10px] text-muted-foreground block uppercase">व्यक्तित्व (Personality)</span>
                          <span className="text-3xl font-extrabold text-purple-400">{numResult.personality}</span>
                        </div>
                      </div>

                      <div className="bg-purple-950/20 p-4 rounded-lg border border-purple-900/30">
                        <h4 className="font-semibold text-purple-300 text-sm mb-1.5 flex items-center">
                          <Award className="mr-2 h-4 w-4 text-emerald-400" />
                          {language === 'en' ? 'Numerology Interpretation' : 'अंक फल विश्लेषण रिपोर्ट'}
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-300 font-sans">{numResult.reading}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-purple-950/15 rounded border border-purple-900/10">
                          <span className="text-xs font-bold text-purple-300 block mb-1">भाग्यशाली तिथियां (Lucky Dates)</span>
                          <span className="text-xs text-slate-200 font-mono">{numResult.luckyDates}</span>
                        </div>
                        <div className="p-3 bg-purple-950/15 rounded border border-purple-900/10">
                          <span className="text-xs font-bold text-purple-300 block mb-1">अनुकूल रंग (Lucky Color)</span>
                          <span className="text-xs text-slate-200">{numResult.luckyColor}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};
export default BhavisyafalPage;
