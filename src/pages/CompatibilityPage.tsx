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
import { calculateGunaMilan, calculateDetailedMatching, HINDI_NAKSHATRAS, NAKSHATRAS } from '@/lib/astroEngine';
import { INDIAN_CITIES } from '@/data/citiesData';
import { Heart, Sparkles, AlertCircle, FileText, CheckCircle2, XCircle, Users, Calendar, Clock, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';

const CompatibilityPage = () => {
  const { t, language } = useTranslation();
  
  // Zodiac quick match state
  const [sign1, setSign1] = useState('');
  const [sign2, setSign2] = useState('');
  const [zResult, setZResult] = useState('');
  const [showZResult, setShowZResult] = useState(false);

  // Detailed Guna Milan matching state
  const [brideName, setBrideName] = useState('');
  const [brideDob, setBrideDob] = useState('1998-05-15');
  const [brideTime, setBrideTime] = useState('12:00');
  const [brideCitySearch, setBrideCitySearch] = useState('Delhi');
  const [brideCity, setBrideCity] = useState({ name: 'Delhi', lat: 28.6139, lng: 77.2090 });
  const [showBrideCityDropdown, setShowBrideCityDropdown] = useState(false);

  const [groomName, setGroomName] = useState('');
  const [groomDob, setGroomDob] = useState('1995-08-20');
  const [groomTime, setGroomTime] = useState('14:30');
  const [groomCitySearch, setGroomCitySearch] = useState('Mumbai');
  const [groomCity, setGroomCity] = useState({ name: 'Mumbai', lat: 19.0760, lng: 72.8777 });
  const [showGroomCityDropdown, setShowGroomCityDropdown] = useState(false);

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
    if (!brideDob || !groomDob) {
      toast.error(language === 'en' ? "Please select birth dates." : "कृपया जन्म तिथि का चयन करें।");
      return;
    }
    if (!brideTime || !groomTime) {
      toast.error(language === 'en' ? "Please select birth times." : "कृपया जन्म समय का चयन करें।");
      return;
    }

    try {
      const res = calculateDetailedMatching(
        brideName, new Date(brideDob), brideTime, brideCity.lat, brideCity.lng,
        groomName, new Date(groomDob), groomTime, groomCity.lat, groomCity.lng
      );
      setMilanResult(res);
      toast.success(language === 'en' ? "Detailed Ashtakoot Guna Milan calculated!" : "विस्तृत अष्टकूट गुण मिलान की गणना पूर्ण हुई!");
    } catch (err) {
      toast.error(language === 'en' ? "Error calculating compatibility." : "मिलान की गणना में त्रुटि हुई।");
    }
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
                      {language === 'en' ? 'Enter DOB, time & place for bride & groom' : 'वर और वधू के जन्म का विवरण दर्ज करें'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={checkGunaMilan} className="space-y-5">
                      {/* Bride Section */}
                      <div className="space-y-3.5 p-3 rounded-lg border border-pink-900/20 bg-pink-950/5">
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
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-slate-300 block mb-1">
                              {language === 'en' ? 'Birth Date' : 'जन्म तिथि'}
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-2 top-2.5 h-3.5 w-3.5 text-pink-400/70" />
                              <Input 
                                type="date"
                                value={brideDob} 
                                onChange={(e) => setBrideDob(e.target.value)} 
                                className="bg-black/35 border-pink-900/30 text-slate-200 pl-7 text-[11px]"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-300 block mb-1">
                              {language === 'en' ? 'Birth Time' : 'जन्म समय'}
                            </label>
                            <div className="relative">
                              <Clock className="absolute left-2 top-2.5 h-3.5 w-3.5 text-pink-400/70" />
                              <Input 
                                type="time"
                                value={brideTime} 
                                onChange={(e) => setBrideTime(e.target.value)} 
                                className="bg-black/35 border-pink-900/30 text-slate-200 pl-7 text-[11px]"
                              />
                            </div>
                          </div>
                        </div>
                        {/* Bride Birth Place Autocomplete */}
                        <div className="relative">
                          <label className="text-xs font-medium text-slate-300 block mb-1">
                            {language === 'en' ? 'Birth Place' : 'जन्म स्थान'}
                          </label>
                          <div className="flex items-center bg-black/35 border border-pink-900/30 rounded-md px-2 py-1">
                            <MapPin className="h-3.5 w-3.5 text-pink-400/70 mr-1.5 shrink-0" />
                            <Input 
                              type="text"
                              value={brideCitySearch}
                              onChange={(e) => {
                                setBrideCitySearch(e.target.value);
                                setShowBrideCityDropdown(true);
                              }}
                              onFocus={() => setShowBrideCityDropdown(true)}
                              onBlur={() => {
                                setTimeout(() => setShowBrideCityDropdown(false), 250);
                              }}
                              placeholder={language === 'en' ? "Search city..." : "शहर खोजें..."}
                              className="bg-transparent border-0 outline-none p-0 text-xs w-full focus-visible:ring-0 focus-visible:ring-offset-0 h-6 text-slate-100"
                            />
                          </div>
                          {showBrideCityDropdown && (
                            <div className="absolute left-0 right-0 mt-1 bg-purple-950/95 border border-purple-900/60 rounded-md shadow-lg max-h-[150px] overflow-y-auto z-50 divide-y divide-purple-900/20">
                              {INDIAN_CITIES.filter(city => 
                                city.name.toLowerCase().includes(brideCitySearch.toLowerCase()) || 
                                city.state.toLowerCase().includes(brideCitySearch.toLowerCase())
                              ).length > 0 ? (
                                INDIAN_CITIES.filter(city => 
                                  city.name.toLowerCase().includes(brideCitySearch.toLowerCase()) || 
                                  city.state.toLowerCase().includes(brideCitySearch.toLowerCase())
                                ).map(city => (
                                  <button
                                    type="button"
                                    key={`${city.name}-${city.state}`}
                                    onClick={() => {
                                      setBrideCity(city);
                                      setBrideCitySearch(city.name);
                                      setShowBrideCityDropdown(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-[11px] hover:bg-purple-900/40 text-slate-200 transition-colors flex justify-between items-center"
                                  >
                                    <span className="font-medium">{city.name}</span>
                                    <span className="text-[9px] text-purple-400 font-semibold">{city.state}</span>
                                  </button>
                                ))
                              ) : (
                                <div className="p-2 text-[10px] text-muted-foreground text-center">
                                  {language === 'en' ? "No cities found" : "कोई शहर नहीं मिला"}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Groom Section */}
                      <div className="space-y-3.5 p-3 rounded-lg border border-blue-900/20 bg-blue-950/5">
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
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-slate-300 block mb-1">
                              {language === 'en' ? 'Birth Date' : 'जन्म तिथि'}
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-2 top-2.5 h-3.5 w-3.5 text-blue-400/70" />
                              <Input 
                                type="date"
                                value={groomDob} 
                                onChange={(e) => setGroomDob(e.target.value)} 
                                className="bg-black/35 border-blue-900/30 text-slate-200 pl-7 text-[11px]"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-300 block mb-1">
                              {language === 'en' ? 'Birth Time' : 'जन्म समय'}
                            </label>
                            <div className="relative">
                              <Clock className="absolute left-2 top-2.5 h-3.5 w-3.5 text-blue-400/70" />
                              <Input 
                                type="time"
                                value={groomTime} 
                                onChange={(e) => setGroomTime(e.target.value)} 
                                className="bg-black/35 border-blue-900/30 text-slate-200 pl-7 text-[11px]"
                              />
                            </div>
                          </div>
                        </div>
                        {/* Groom Birth Place Autocomplete */}
                        <div className="relative">
                          <label className="text-xs font-medium text-slate-300 block mb-1">
                            {language === 'en' ? 'Birth Place' : 'जन्म स्थान'}
                          </label>
                          <div className="flex items-center bg-black/35 border border-blue-900/30 rounded-md px-2 py-1">
                            <MapPin className="h-3.5 w-3.5 text-blue-400/70 mr-1.5 shrink-0" />
                            <Input 
                              type="text"
                              value={groomCitySearch}
                              onChange={(e) => {
                                setGroomCitySearch(e.target.value);
                                setShowGroomCityDropdown(true);
                              }}
                              onFocus={() => setShowGroomCityDropdown(true)}
                              onBlur={() => {
                                setTimeout(() => setShowGroomCityDropdown(false), 250);
                              }}
                              placeholder={language === 'en' ? "Search city..." : "शहर खोजें..."}
                              className="bg-transparent border-0 outline-none p-0 text-xs w-full focus-visible:ring-0 focus-visible:ring-offset-0 h-6 text-slate-100"
                            />
                          </div>
                          {showGroomCityDropdown && (
                            <div className="absolute left-0 right-0 mt-1 bg-purple-950/95 border border-purple-900/60 rounded-md shadow-lg max-h-[150px] overflow-y-auto z-50 divide-y divide-purple-900/20">
                              {INDIAN_CITIES.filter(city => 
                                city.name.toLowerCase().includes(groomCitySearch.toLowerCase()) || 
                                city.state.toLowerCase().includes(groomCitySearch.toLowerCase())
                              ).length > 0 ? (
                                INDIAN_CITIES.filter(city => 
                                  city.name.toLowerCase().includes(groomCitySearch.toLowerCase()) || 
                                  city.state.toLowerCase().includes(groomCitySearch.toLowerCase())
                                ).map(city => (
                                  <button
                                    type="button"
                                    key={`${city.name}-${city.state}`}
                                    onClick={() => {
                                      setGroomCity(city);
                                      setGroomCitySearch(city.name);
                                      setShowGroomCityDropdown(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-[11px] hover:bg-purple-900/40 text-slate-200 transition-colors flex justify-between items-center"
                                  >
                                    <span className="font-medium">{city.name}</span>
                                    <span className="text-[9px] text-purple-400 font-semibold">{city.state}</span>
                                  </button>
                                ))
                              ) : (
                                <div className="p-2 text-[10px] text-muted-foreground text-center">
                                  {language === 'en' ? "No cities found" : "कोई शहर नहीं मिला"}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                        <Heart className="mr-2 h-4 w-4 text-pink-300" />
                        {language === 'en' ? 'Calculate Compatibility' : 'विस्तृत विवाह अनुकूलता मिलान करें'}
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
                      {language === 'en' ? 'Detailed Kundali Matching' : 'कुंडली मिलान स्कोर (36 गुण)'}
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                      {language === 'en' ? 'Fill out the DOB, time, and birthplace for both to run the Ashtakoot & Manglik calculations' : 'वर और वधु की जन्म तिथि, समय और स्थान भरकर संपूर्ण मिलान चक्र की गणना करें'}
                    </p>
                  </div>
                ) : (
                  <Card className="bg-purple-950/5 border-purple-900/20">
                    <CardHeader className="border-b border-purple-900/10">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                          <CardTitle className="text-purple-200 text-lg">
                            {brideName} & {groomName} {language === 'en' ? 'Milan Report' : 'विवाह अनुकूलता मिलान रिपोर्ट'}
                          </CardTitle>
                          <CardDescription>
                            {language === 'en' ? 'Vedic Ashtakoot compatibility details' : 'अष्टकूट ३६ गुण मिलान एवं मांगलिक/दशा संधि विश्लेषण'}
                          </CardDescription>
                        </div>

                        {/* circular progress score */}
                        <div className="flex items-center gap-3 bg-purple-950/30 border border-purple-900/30 p-3 rounded-xl shrink-0">
                          <div className="relative w-16 h-16 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="32" cy="32" r="28" fill="transparent" stroke="#3b0764" strokeWidth="4" />
                              <circle cx="32" cy="32" r="28" fill="transparent" stroke="#a855f7" strokeWidth="4" 
                                strokeDasharray={175} 
                                strokeDashoffset={175 - (175 * milanResult.gunaMilan.score) / 36}
                              />
                            </svg>
                            <span className="absolute text-sm font-bold text-slate-100">{milanResult.gunaMilan.score}/36</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block">{language === 'en' ? 'Match Percent' : 'अनुकूलता प्रतिशत'}</span>
                            <span className="text-lg font-extrabold text-purple-400">{milanResult.gunaMilan.compatibilityPercentage}%</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      
                      {/* Detailed Kundali Comparison Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Bride Column */}
                        <div className="bg-pink-950/5 border border-pink-900/10 rounded-lg p-3 space-y-2">
                          <span className="text-xs font-bold text-pink-400 block border-b border-pink-900/10 pb-1 uppercase tracking-wider">
                            वधू: {brideName}
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-[10px] text-muted-foreground block">जन्म नक्षत्र (Pada)</span>
                              <span className="font-semibold text-slate-200">{milanResult.bride.nakshatra} ({milanResult.bride.pada})</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground block">चंद्र राशि (Sign)</span>
                              <span className="font-semibold text-slate-200">{milanResult.bride.rashi}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground block">राशि स्वामी (Lord)</span>
                              <span className="font-semibold text-slate-200">{milanResult.bride.rashiLord}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground block">जन्म लग्न (Lagna)</span>
                              <span className="font-semibold text-slate-200">{milanResult.bride.lagna}</span>
                            </div>
                          </div>
                          <div className={`mt-2 text-center text-[10px] py-1 px-2 rounded font-bold uppercase ${
                            milanResult.bride.isManglik ? 'bg-rose-950/40 border border-rose-900/30 text-rose-400' : 'bg-emerald-950/40 border border-emerald-900/30 text-emerald-400'
                          }`}>
                            {milanResult.bride.isManglik ? "मांगलिक कुंडली (Manglik)" : "गैर-मांगलिक (Non-Manglik)"}
                          </div>
                        </div>

                        {/* Groom Column */}
                        <div className="bg-blue-950/5 border border-blue-900/10 rounded-lg p-3 space-y-2">
                          <span className="text-xs font-bold text-blue-400 block border-b border-blue-900/10 pb-1 uppercase tracking-wider">
                            वर: {groomName}
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-[10px] text-muted-foreground block">जन्म नक्षत्र (Pada)</span>
                              <span className="font-semibold text-slate-200">{milanResult.groom.nakshatra} ({milanResult.groom.pada})</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground block">चंद्र राशि (Sign)</span>
                              <span className="font-semibold text-slate-200">{milanResult.groom.rashi}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground block">राशि स्वामी (Lord)</span>
                              <span className="font-semibold text-slate-200">{milanResult.groom.rashiLord}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground block">जन्म लग्न (Lagna)</span>
                              <span className="font-semibold text-slate-200">{milanResult.groom.lagna}</span>
                            </div>
                          </div>
                          <div className={`mt-2 text-center text-[10px] py-1 px-2 rounded font-bold uppercase ${
                            milanResult.groom.isManglik ? 'bg-rose-950/40 border border-rose-900/30 text-rose-400' : 'bg-emerald-950/40 border border-emerald-900/30 text-emerald-400'
                          }`}>
                            {milanResult.groom.isManglik ? "मांगलिक कुंडली (Manglik)" : "गैर-मांगलिक (Non-Manglik)"}
                          </div>
                        </div>
                      </div>

                      {/* Prediction text */}
                      <div className="bg-purple-950/20 border border-purple-900/30 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-300 text-sm mb-1.5 flex items-center">
                          <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                          {language === 'en' ? 'Marriage Prediction' : 'विवाह भविष्यवाणी निष्कर्ष'}
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-300 font-sans">{milanResult.gunaMilan.prediction}</p>
                      </div>

                      {/* Doshas & Checks */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-purple-950/10 p-3 rounded-lg border border-purple-900/10 flex items-center gap-2">
                          {milanResult.gunaMilan.nadiDosha ? <XCircle className="h-5 w-5 text-rose-500 shrink-0" /> : <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">नाड़ी दोष (Nadi Dosha)</span>
                            <span className="text-[10px] text-muted-foreground">{milanResult.gunaMilan.nadiDosha ? "अशुभ दोष उपस्थित है" : "दोष मुक्त"}</span>
                          </div>
                        </div>
                        <div className="bg-purple-950/10 p-3 rounded-lg border border-purple-900/10 flex items-center gap-2">
                          {milanResult.gunaMilan.bhakootDosha ? <XCircle className="h-5 w-5 text-rose-500 shrink-0" /> : <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">भकूट दोष (Bhakoot Dosha)</span>
                            <span className="text-[10px] text-muted-foreground">{milanResult.gunaMilan.bhakootDosha ? "अशुभ दोष उपस्थित है" : "दोष मुक्त"}</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg border flex items-center gap-2 ${
                          (milanResult.bride.isManglik !== milanResult.groom.isManglik)
                            ? 'bg-amber-950/10 border-amber-900/20'
                            : 'bg-purple-950/10 border-purple-900/10'
                        }`}>
                          {(milanResult.bride.isManglik !== milanResult.groom.isManglik) ? <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" /> : <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">मंगल दोष मिलान (Mangal)</span>
                            <span className="text-[10px] text-muted-foreground">
                              {milanResult.bride.isManglik !== milanResult.groom.isManglik ? "आंशिक दोष / शांति सुझाव" : "दोष रहित / संतुलित"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Manglik Match Status Description */}
                      <div className="bg-purple-950/10 p-3 rounded-lg border border-purple-900/10 text-xs">
                        <span className="font-bold text-purple-300 block mb-1">मंगल दोष एवं गृह विश्लेषण</span>
                        <p className="text-slate-300 leading-normal">{milanResult.manglikStatus}</p>
                      </div>

                      {/* Dasha Sandhi Check */}
                      <div className="bg-purple-950/10 p-3 rounded-lg border border-purple-900/10 text-xs">
                        <span className="font-bold text-purple-300 block mb-1">दशा संधि चक्र परीक्षण</span>
                        <p className="text-slate-300 leading-normal">{milanResult.dashaSandhiStatus}</p>
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
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.gunaMilan.varnaScore}</td>
                                <td className="p-2.5">{milanResult.gunaMilan.varnaScore > 0 ? "शुभ" : "अशुभ"}</td>
                              </tr>
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">वश्य (Vashya) - आपसी आकर्षण</td>
                                <td className="p-2.5 text-slate-400">2</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.gunaMilan.vashyaScore}</td>
                                <td className="p-2.5">{milanResult.gunaMilan.vashyaScore >= 1.5 ? "उत्तम" : milanResult.gunaMilan.vashyaScore > 0 ? "मध्यम" : "शून्य"}</td>
                              </tr>
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">तारा (Tara) - स्वास्थ्य व आयु</td>
                                <td className="p-2.5 text-slate-400">3</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.gunaMilan.taraScore}</td>
                                <td className="p-2.5">{milanResult.gunaMilan.taraScore === 3 ? "अमृत" : milanResult.gunaMilan.taraScore > 0 ? "मध्यम" : "अशुभ"}</td>
                              </tr>
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">योनि (Yoni) - शारीरिक अनुकूलता</td>
                                <td className="p-2.5 text-slate-400">4</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.gunaMilan.yoniScore}</td>
                                <td className="p-2.5">{milanResult.gunaMilan.yoniScore === 4 ? "परम मित्र" : milanResult.gunaMilan.yoniScore > 1 ? "सामान्य" : "शत्रु योनि"}</td>
                              </tr>
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">ग्रह मैत्री (Graha Maitri) - वैचारिक मित्र</td>
                                <td className="p-2.5 text-slate-400">5</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.gunaMilan.maitriScore}</td>
                                <td className="p-2.5">{milanResult.gunaMilan.maitriScore >= 4 ? "परम मित्र" : milanResult.gunaMilan.maitriScore >= 2 ? "तटस्थ" : "शत्रु"}</td>
                              </tr>
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">गण (Gana) - स्वभाव व व्यवहार</td>
                                <td className="p-2.5 text-slate-400">6</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.gunaMilan.ganaScore}</td>
                                <td className="p-2.5">{milanResult.gunaMilan.ganaScore === 6 ? "अनुकूल" : milanResult.gunaMilan.ganaScore > 0 ? "मध्यम" : "विपरीत स्वभाव"}</td>
                              </tr>
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">भकूट (Bhakoot) - समृद्धि व प्रेम</td>
                                <td className="p-2.5 text-slate-400">7</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.gunaMilan.bhakootScore}</td>
                                <td className="p-2.5">{milanResult.gunaMilan.bhakootDosha ? <span className="text-rose-400">भकूट महादोष</span> : "शुभ योग"}</td>
                              </tr>
                              <tr className="hover:bg-purple-900/5">
                                <td className="p-2.5 font-medium text-slate-300">नाड़ी (Nadi) - स्वास्थ्य व संतान</td>
                                <td className="p-2.5 text-slate-400">8</td>
                                <td className="p-2.5 text-purple-300 font-bold">{milanResult.gunaMilan.nadiScore}</td>
                                <td className="p-2.5">{milanResult.gunaMilan.nadiDosha ? <span className="text-rose-400">नाड़ी महादोष</span> : "उत्तम स्वास्थ्य"}</td>
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
