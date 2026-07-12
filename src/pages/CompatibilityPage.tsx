import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getCompatibility, zodiacSigns } from '@/data/zodiacSigns';
import { calculateGunaMilan, HINDI_NAKSHATRAS, NAKSHATRAS } from '@/lib/astroEngine';
import { Heart, Sparkles, AlertCircle, FileText, CheckCircle2, XCircle, Users } from 'lucide-react';
import { toast } from 'sonner';

const CITIES = [
  { name: "Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "Patna", lat: 25.5941, lng: 85.1376 }
];

const CompatibilityPage = () => {
  const { t, language } = useTranslation();
  
  // Zodiac quick match state
  const [sign1, setSign1] = useState('');
  const [sign2, setSign2] = useState('');
  const [zResult, setZResult] = useState('');
  const [showZResult, setShowZResult] = useState(false);

  // Guna Milan matching state
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [brideNak, setBrideNak] = useState('0'); // Index
  const [groomNak, setGroomNak] = useState('0'); // Index
  const [milanResult, setMilanResult] = useState<any>(null);

  const formatName = (name: string) => {
    return language === 'en' ? name : t(`zodiac.${name.toLowerCase()}.name`);
  };

  const checkQuickCompatibility = () => {
    if (sign1 && sign2) {
      const comp = getCompatibility(sign1, sign2);
      setZResult(comp);
      setShowZResult(true);
    }
  };

  const checkGunaMilan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName || !groomName) {
      toast.error(language === 'en' ? "Please enter names." : "कृपया वधू और वर के नाम दर्ज करें।");
      return;
    }

    const bIndex = parseInt(brideNak);
    const gIndex = parseInt(groomNak);
    const res = calculateGunaMilan(bIndex, gIndex);
    setMilanResult(res);
    toast.success(language === 'en' ? "Ashtakoot Guna Milan calculated!" : "अष्टकूट गुण मिलान की गणना पूर्ण हुई!");
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">
            {language === 'en' ? 'Marriage Compatibility (Kundali Matching)' : 'कुंडली मिलान (विवाह अनुकूलता)'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'en' ? 'Check compatibility using Vedic Guna Milan or Zodiac signs' : 'अष्टकूट ३६ गुण मिलान एवं राशि के अनुसार विवाह अनुकूलता परीक्षण करें'}
          </p>
        </div>

        <Tabs defaultValue="guna" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-purple-950/20 border border-purple-900/30">
              <TabsTrigger value="guna">{language === 'en' ? 'Ashtakoot Guna Milan (36 Points)' : 'अष्टकूट ३६ गुण मिलान'}</TabsTrigger>
              <TabsTrigger value="zodiac">{language === 'en' ? 'Zodiac Match (Quick)' : 'राशि अनुसार (त्वरित)'}</TabsTrigger>
            </TabsList>
          </div>

          {/* Guna Milan Tab */}
          <TabsContent value="guna">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Card */}
              <div className="lg:col-span-1">
                <Card className="bg-purple-950/10 border-purple-900/30">
                  <CardHeader>
                    <CardTitle className="text-purple-300 flex items-center">
                      <Users className="mr-2 text-purple-400" />
                      {language === 'en' ? 'Enter Details' : 'विवरण दर्ज करें'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'Select birth Nakshatras for bride & groom' : 'वर और वधू के जन्म नक्षत्र का चयन करें'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={checkGunaMilan} className="space-y-5">
                      {/* Bride Section */}
                      <div className="space-y-2.5 p-3 rounded-lg border border-pink-900/20 bg-pink-950/5">
                        <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block">
                          {language === 'en' ? 'Bride Details' : 'वधू विवरण'}
                        </span>
                        <div>
                          <label className="text-xs font-medium text-slate-300 block mb-1">
                            {language === 'en' ? 'Bride Name' : 'वधू का नाम'}
                          </label>
                          <Input 
                            value={brideName} 
                            onChange={(e) => setBrideName(e.target.value)} 
                            placeholder={language === 'en' ? 'Bride Name' : 'वधू का नाम'}
                            className="bg-black/35 border-pink-900/30 text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-300 block mb-1">
                            {language === 'en' ? 'Birth Nakshatra' : 'जन्म नक्षत्र'}
                          </label>
                          <Select value={brideNak} onValueChange={setBrideNak}>
                            <SelectTrigger className="bg-black/35 border-pink-900/30 text-slate-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {NAKSHATRAS.map((nak, idx) => (
                                <SelectItem key={idx} value={idx.toString()}>
                                  {idx + 1}. {language === 'en' ? nak : HINDI_NAKSHATRAS[idx]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Groom Section */}
                      <div className="space-y-2.5 p-3 rounded-lg border border-blue-900/20 bg-blue-950/5">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                          {language === 'en' ? 'Groom Details' : 'वर विवरण'}
                        </span>
                        <div>
                          <label className="text-xs font-medium text-slate-300 block mb-1">
                            {language === 'en' ? 'Groom Name' : 'वर का नाम'}
                          </label>
                          <Input 
                            value={groomName} 
                            onChange={(e) => setGroomName(e.target.value)} 
                            placeholder={language === 'en' ? 'Groom Name' : 'वर का नाम'}
                            className="bg-black/35 border-blue-900/30 text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-300 block mb-1">
                            {language === 'en' ? 'Birth Nakshatra' : 'जन्म नक्षत्र'}
                          </label>
                          <Select value={groomNak} onValueChange={setGroomNak}>
                            <SelectTrigger className="bg-black/35 border-blue-900/30 text-slate-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {NAKSHATRAS.map((nak, idx) => (
                                <SelectItem key={idx} value={idx.toString()}>
                                  {idx + 1}. {language === 'en' ? nak : HINDI_NAKSHATRAS[idx]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                        <Heart className="mr-2 h-4 w-4" />
                        {language === 'en' ? 'Calculate Milan Score' : 'मिलान जांचें'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Guna Results Card */}
              <div className="lg:col-span-2">
                {!milanResult ? (
                  <div className="flex flex-col items-center justify-center border border-purple-900/20 rounded-xl p-12 h-full text-center bg-purple-950/5">
                    <Heart className="h-16 w-16 text-rose-800/40 mb-4 animate-pulse" />
                    <h3 className="text-xl font-medium text-purple-200">
                      {language === 'en' ? 'Marriage Guna Score' : 'गुण मिलान स्कोर'}
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                      {language === 'en' ? 'Fill out the names and select birth stars to run the Ashtakoot calculations' : 'वर और वधू के विवरण भरकर अष्टकूट ३६ गुणों की जांच करें'}
                    </p>
                  </div>
                ) : (
                  <Card className="bg-purple-950/5 border-purple-900/20">
                    <CardHeader className="border-b border-purple-900/10">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                          <CardTitle className="text-purple-200">
                            {brideName} & {groomName} {language === 'en' ? 'Milan Report' : 'अनुकूलता रिपोर्ट'}
                          </CardTitle>
                          <CardDescription>
                            {language === 'en' ? 'Vedic Ashtakoot compatibility details' : 'अष्टकूट ३६ गुण मिलान के आधार पर संपूर्ण फल विश्लेषण'}
                          </CardDescription>
                        </div>

                        {/* circular progress score */}
                        <div className="flex items-center gap-3 bg-purple-950/30 border border-purple-900/30 p-3 rounded-xl">
                          <div className="relative w-16 h-16 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="32" cy="32" r="28" fill="transparent" stroke="#3b0764" strokeWidth="4" />
                              <circle cx="32" cy="32" r="28" fill="transparent" stroke="#a855f7" strokeWidth="4" 
                                strokeDasharray={175} 
                                strokeDashoffset={175 - (175 * milanResult.score) / 36}
                              />
                            </svg>
                            <span className="absolute text-sm font-bold text-slate-100">{milanResult.score}/36</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block">{language === 'en' ? 'Match Percent' : 'अनुकूलता प्रतिशत'}</span>
                            <span className="text-lg font-extrabold text-purple-400">{milanResult.compatibilityPercentage}%</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      {/* Prediction text */}
                      <div className="bg-purple-950/20 border border-purple-900/30 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-300 text-sm mb-1.5 flex items-center">
                          <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                          {language === 'en' ? 'Marriage Prediction' : 'विवाह भविष्यवाणी निष्कर्ष'}
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-300 font-sans">{milanResult.prediction}</p>
                      </div>

                      {/* Doshas Check */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-purple-950/10 p-3 rounded-lg border border-purple-900/10 flex items-center gap-2">
                          {milanResult.nadiDosha ? <XCircle className="h-5 w-5 text-rose-500 shrink-0" /> : <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">नाड़ी दोष (Nadi Dosha)</span>
                            <span className="text-[10px] text-muted-foreground">{milanResult.nadiDosha ? "अशुभ दोष उपस्थित है" : "दोष मुक्त"}</span>
                          </div>
                        </div>
                        <div className="bg-purple-950/10 p-3 rounded-lg border border-purple-900/10 flex items-center gap-2">
                          {milanResult.bhakootDosha ? <XCircle className="h-5 w-5 text-rose-500 shrink-0" /> : <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">भकूट दोष (Bhakoot Dosha)</span>
                            <span className="text-[10px] text-muted-foreground">{milanResult.bhakootDosha ? "अशुभ दोष उपस्थित है" : "दोष मुक्त"}</span>
                          </div>
                        </div>
                        <div className="bg-purple-950/10 p-3 rounded-lg border border-purple-900/10 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">मंगल दोष मिलान</span>
                            <span className="text-[10px] text-muted-foreground">अनुकूल स्थिति</span>
                          </div>
                        </div>
                      </div>

                      {/* Ashtakoot Grid */}
                      <div>
                        <h4 className="font-semibold text-purple-300 text-sm mb-3 flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          {language === 'en' ? 'Ashtakoot Breakdown' : 'अष्टकूट मिलान अंक तालिका'}
                        </h4>
                        <div className="overflow-x-auto border border-purple-900/20 rounded">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-purple-950/30 text-purple-200">
                              <tr>
                                <th className="p-2.5 font-semibold">कूटा (Koota)</th>
                                <th className="p-2.5 font-semibold">अधिकतम अंक</th>
                                <th className="p-2.5 font-semibold">प्राप्त अंक</th>
                                <th className="p-2.5 font-semibold">स्थिति</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-purple-900/10">
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">वर्ण (Varna) - मानसिक विकास</td>
                                <td className="p-2.5 text-slate-400">1</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.varnaScore}</td>
                                <td className="p-2.5">{milanResult.varnaScore > 0 ? "शुभ" : "अशुभ"}</td>
                              </tr>
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">वश्य (Vashya) - आपसी आकर्षण</td>
                                <td className="p-2.5 text-slate-400">2</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.vashyaScore}</td>
                                <td className="p-2.5">{milanResult.vashyaScore >= 1.5 ? "उत्तम" : milanResult.vashyaScore > 0 ? "मध्यम" : "शून्य"}</td>
                              </tr>
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">तारा (Tara) - स्वास्थ्य व आयु</td>
                                <td className="p-2.5 text-slate-400">3</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.taraScore}</td>
                                <td className="p-2.5">{milanResult.taraScore === 3 ? "अमृत" : milanResult.taraScore > 0 ? "मध्यम" : "अशुभ"}</td>
                              </tr>
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">योनि (Yoni) - शारीरिक अनुकूलता</td>
                                <td className="p-2.5 text-slate-400">4</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.yoniScore}</td>
                                <td className="p-2.5">{milanResult.yoniScore === 4 ? "परम मित्र" : milanResult.yoniScore > 1 ? "सामान्य" : "शत्रु योनि"}</td>
                              </tr>
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">ग्रह मैत्री (Graha Maitri) - वैचारिक मित्र</td>
                                <td className="p-2.5 text-slate-400">5</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.maitriScore}</td>
                                <td className="p-2.5">{milanResult.maitriScore >= 4 ? "परम मित्र" : milanResult.maitriScore >= 2 ? "तटस्थ" : "शत्रु"}</td>
                              </tr>
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">गण (Gana) - स्वभाव व व्यवहार</td>
                                <td className="p-2.5 text-slate-400">6</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.ganaScore}</td>
                                <td className="p-2.5">{milanResult.ganaScore === 6 ? "अनुकूल" : milanResult.ganaScore > 0 ? "मध्यम" : "विपरीत स्वभाव"}</td>
                              </tr>
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">भकूट (Bhakoot) - समृद्धि व प्रेम</td>
                                <td className="p-2.5 text-slate-400">7</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.bhakootScore}</td>
                                <td className="p-2.5">{milanResult.bhakootDosha ? <span className="text-rose-400">भकूट महादोष</span> : "शुभ योग"}</td>
                              </tr>
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">नाड़ी (Nadi) - स्वास्थ्य व संतान</td>
                                <td className="p-2.5 text-slate-400">8</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.nadiScore}</td>
                                <td className="p-2.5">{milanResult.nadiDosha ? <span className="text-rose-400">नाड़ी महादोष</span> : "उत्तम स्वास्थ्य"}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Zodiac Tab */}
          <TabsContent value="zodiac">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-purple-950/10 border-purple-900/30">
                <CardHeader>
                  <CardTitle>{t('common.checkCompatibility')}</CardTitle>
                  <CardDescription>
                    {t('common.selectTwoSigns')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('common.yourZodiac')}</label>
                      <Select value={sign1} onValueChange={setSign1}>
                        <SelectTrigger className="bg-black/35 border-purple-900/40 text-slate-300">
                          <SelectValue placeholder={t('common.selectZodiac')} />
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
                      <label className="text-sm font-medium">{t('common.partner')}</label>
                      <Select value={sign2} onValueChange={setSign2}>
                        <SelectTrigger className="bg-black/35 border-purple-900/40 text-slate-300">
                          <SelectValue placeholder={t('common.selectZodiac')} />
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
                  </div>

                  <Button 
                    onClick={checkQuickCompatibility} 
                    className="w-full bg-purple-600 hover:bg-purple-700" 
                    disabled={!sign1 || !sign2 || sign1 === sign2}
                  >
                    {t('common.checkCompatibility')}
                  </Button>

                  {showZResult && (
                    <div className="mt-8 space-y-4">
                      <Separator />
                      <h3 className="text-lg font-semibold text-center text-purple-300">
                        {formatName(sign1)} & {formatName(sign2)}
                      </h3>
                      <div className="text-center p-4 rounded-lg bg-purple-900/10 border border-purple-900/20">
                        <p className="text-xl font-bold text-purple-400">{zResult}</p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-slate-200">{t('common.compatibilityDetail')}</h4>
                        <p className="text-xs text-muted-foreground">{t('compatibility.description')}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-3 bg-purple-950/20 rounded border border-purple-900/10">
                            <span className="font-bold text-xs text-purple-300 block mb-1">
                              {language === 'en' ? 'Love' : 'प्रेम संबंध'}
                            </span>
                            <p className="text-[11px] text-slate-300">{t('compatibility.love')}</p>
                          </div>
                          <div className="p-3 bg-purple-950/20 rounded border border-purple-900/10">
                            <span className="font-bold text-xs text-purple-300 block mb-1">
                              {language === 'en' ? 'Trust & Intimacy' : 'विश्वास एवं सामंजस्य'}
                            </span>
                            <p className="text-[11px] text-slate-300">{t('compatibility.trust')}</p>
                          </div>
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

export default CompatibilityPage;
