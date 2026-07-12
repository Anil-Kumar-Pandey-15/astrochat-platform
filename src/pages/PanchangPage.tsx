import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Sun, Moon, Clock, Award, Compass, ShieldAlert, BookOpen, CalendarCheck } from "lucide-react";
import { format } from "date-fns";
import { Input } from '@/components/ui/input';
import { 
  getFullPanchang, 
  calculateSunriseSunset, 
  calculateDivamaanRatrimaan, 
  calculateMahamuhurats, 
  calculateHora, 
  calculateChoghadiya, 
  generateSankalpaMantra,
  formatMinutesToTime
} from '@/lib/astroEngine';
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

const PanchangPage = () => {
  const { t, language } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedCity, setSelectedCity] = useState<string>("Delhi");
  
  const [panchang, setPanchang] = useState<any>(null);
  const [muhurats, setMuhurats] = useState<any[]>([]);
  const [horas, setHoras] = useState<any[]>([]);
  const [choghadiya, setChoghadiya] = useState<any[]>([]);
  const [sankalpa, setSankalpa] = useState<string>('');

  const [abhijitTime, setAbhijitTime] = useState<string>('');
  const [rahuTime, setRahuTime] = useState<string>('');
  const [yamaTime, setYamaTime] = useState<string>('');
  const [gulikaTime, setGulikaTime] = useState<string>('');
  const [liveTime, setLiveTime] = useState<string>('');

  const isToday = (dateStr: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    return dateStr === todayStr;
  };

  useEffect(() => {
    const isTodayVal = isToday(selectedDate);
    
    const runCalculation = () => {
      const cityObj = CITIES.find(c => c.name === selectedCity) || CITIES[0];
      const now = new Date();
      
      if (isTodayVal) {
        setLiveTime(now.toLocaleTimeString(language === 'en' ? 'en-US' : 'hi-IN'));
      } else {
        setLiveTime('');
      }

      // If selected date is today, use new Date() for live second calculations
      const dateObj = isTodayVal ? now : new Date(selectedDate + 'T12:00:00');
      
      // Calculate Panchang
      const pData = getFullPanchang(dateObj, cityObj.lat, cityObj.lng);
      setPanchang(pData);

      // Calculate solar raw times for Muhurat splits
      const solarTimes = calculateSunriseSunset(dateObj, cityObj.lat, cityObj.lng);
      
      // Calculate 30 Muhurats
      const mData = calculateMahamuhurats(solarTimes.sunriseRaw, solarTimes.sunsetRaw);
      setMuhurats(mData);

      // Calculate Hora
      const hData = calculateHora(solarTimes.sunriseRaw, dateObj.getDay());
      setHoras(hData);

      // Calculate Choghadiya
      const cData = calculateChoghadiya(solarTimes.sunriseRaw, solarTimes.sunsetRaw, dateObj.getDay());
      setChoghadiya(cData);

      // Sankalpa
      const sMantra = generateSankalpaMantra(dateObj, cityObj.name, pData);
      setSankalpa(sMantra);

      // Dynamic calculations for Abhijit, Rahu, Yamaganda, Gulika based on Sunrise-Sunset
      const dayLength = solarTimes.sunsetRaw - solarTimes.sunriseRaw;
      const dayPart = dayLength / 8;
      const dayOfWeek = dateObj.getDay();

      // Abhijit (8th Muhurat of 15 day divisions)
      const abhijitStart = solarTimes.sunriseRaw + 7 * (dayLength / 15);
      const abhijitEnd = solarTimes.sunriseRaw + 8 * (dayLength / 15);
      setAbhijitTime(`${formatMinutesToTime(abhijitStart)} - ${formatMinutesToTime(abhijitEnd)}`);

      // Rahu Kaal
      const rahuOctants = [7, 1, 6, 4, 5, 3, 2];
      const rahuStart = solarTimes.sunriseRaw + rahuOctants[dayOfWeek] * dayPart;
      const rahuEnd = rahuStart + dayPart;
      setRahuTime(`${formatMinutesToTime(rahuStart)} - ${formatMinutesToTime(rahuEnd)}`);

      // Yamaganda
      const yamaOctants = [4, 3, 2, 1, 0, 6, 5];
      const yamaStart = solarTimes.sunriseRaw + yamaOctants[dayOfWeek] * dayPart;
      const yamaEnd = yamaStart + dayPart;
      setYamaTime(`${formatMinutesToTime(yamaStart)} - ${formatMinutesToTime(yamaEnd)}`);

      // Gulika
      const gulikaOctants = [6, 5, 4, 3, 2, 1, 0];
      const gulikaStart = solarTimes.sunriseRaw + gulikaOctants[dayOfWeek] * dayPart;
      const gulikaEnd = gulikaStart + dayPart;
      setGulikaTime(`${formatMinutesToTime(gulikaStart)} - ${formatMinutesToTime(gulikaEnd)}`);
    };

    runCalculation();

    const interval = setInterval(() => {
      runCalculation();
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedDate, selectedCity, language]);

  // Festivals listing based on month
  const getFestivals = () => {
    const m = new Date(selectedDate).getMonth();
    const festivalsList = [
      ["स्वामी विवेकानंद जयंती", "मकर संक्रांति", "लोहड़ी", "पौष पुत्रदा एकादशी"], // Jan (0)
      ["वसन्त पंचमी", "रथ सप्तमी", "जया एकादशी", "महाशिवरात्रि (संधि)"], // Feb (1)
      ["होली", "होलिका दहन", "आमला एकादशी", "रंग पंचमी"], // Mar (2)
      ["चैत्र नवरात्रि प्रारंभ", "राम नवमी", "हनुमान जयंती", "कामदा एकादशी"], // Apr (3)
      ["परशुराम जयंती", "अक्षय तृतीया", "बुद्ध पूर्णिमा", "मोहिनी एकादशी"], // May (4)
      ["गंगा दशहरा", "निर्जला एकादशी", "वट सावित्री व्रत", "योगिनी एकादशी"], // Jun (5)
      ["जगन्नाथ रथ यात्रा", "देवशयनी एकादशी", "गुरु पूर्णिमा", "कर्क संक्रांति"], // Jul (6)
      ["रक्षा बंधन", "श्री कृष्ण जन्माष्टमी", "श्रावणी पूर्णिमा", "पुत्रदा एकादशी"], // Aug (7)
      ["गणेश चतुर्थी", "ऋषि पंचमी", "राधाष्टमी", "अनंत चतुर्दशी"], // Sep (8)
      ["शरद नवरात्रि प्रारंभ", "दुर्गा पूजा महाअष्टमी", "विजयादशमी / दशहरा", "शरद पूर्णिमा"], // Oct (9)
      ["धनतेरस", "नरक चतुर्दशी", "दीपावली / दिवाली", "गोवर्धन पूजा", "भैया दूज", "छठ पूजा"], // Nov (10)
      ["गीता जयंती", "मोक्षदा एकादशी", "दत्तात्रेय जयंती", "सफला एकादशी"] // Dec (11)
    ];
    return festivalsList[m] || ["प्रदोष व्रत", "मासिक शिवरात्रि"];
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">
            {language === 'en' ? 'Daily Panchang & Muhurat Hub' : 'दैनिक हिन्दू पंचांग एवं शुभ मुहूर्त'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'en' ? 'Real-time calculations for Sunrise, Sunset, Tithi, Nakshatra, Hora and Choghadiya' : 'त्रिकोणमितीय गणित पर आधारित सूर्योदय, सूर्यास्त, तिथि, नक्षत्र, होरा और चौघड़िया गणना'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 bg-purple-950/15 p-4 rounded-xl border border-purple-900/20">
          <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                {language === 'en' ? 'Date' : 'तिथि चुनें'}:
              </span>
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-black/35 border-purple-900/40 text-sm max-w-[170px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                {language === 'en' ? 'Location' : 'स्थान'}:
              </span>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="bg-black/35 border-purple-900/40 text-sm w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map(c => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {liveTime && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg text-rose-400 font-mono text-sm font-bold animate-pulse">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              LIVE: {liveTime}
            </div>
          )}
        </div>

        {panchang && (
          <Tabs defaultValue="panchang" className="w-full">
            <TabsList className="grid grid-cols-5 w-full bg-purple-950/20 text-xs sm:text-sm">
              <TabsTrigger value="panchang">{language === 'en' ? 'Panchang' : 'मुख्य पंचांग'}</TabsTrigger>
              <TabsTrigger value="muhurats">{language === 'en' ? 'Muhurats' : '30 मुहूर्त'}</TabsTrigger>
              <TabsTrigger value="choghadiya">{language === 'en' ? 'Choghadiya' : 'चौघड़िया'}</TabsTrigger>
              <TabsTrigger value="hora">{language === 'en' ? 'Hora' : 'होरा चक्र'}</TabsTrigger>
              <TabsTrigger value="muhuratFinder">{language === 'en' ? 'Finder' : 'मुहूर्त शोधक'}</TabsTrigger>
            </TabsList>

            {/* Panchang Tab */}
            <TabsContent value="panchang" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sun & Moon Timings */}
                <Card className="bg-purple-950/5 border-purple-900/20 md:col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-purple-300 text-base flex items-center gap-1.5">
                      <Sun className="h-5 w-5 text-amber-500" />
                      {language === 'en' ? 'Solar & Lunar Times' : 'सूर्य एवं चंद्र उदय-अस्त'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm pt-4">
                    <div className="flex justify-between items-center border-b border-purple-900/10 pb-2">
                      <span className="text-muted-foreground">{language === 'en' ? 'Sunrise' : 'सूर्योदय'}</span>
                      <span className="font-semibold text-amber-400">{panchang.sunrise} AM</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-purple-900/10 pb-2">
                      <span className="text-muted-foreground">{language === 'en' ? 'Sunset' : 'सूर्यास्त'}</span>
                      <span className="font-semibold text-rose-400">{panchang.sunset} PM</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-purple-900/10 pb-2">
                      <span className="text-muted-foreground">{language === 'en' ? 'Local Noon' : 'मध्याह्न दोपहर'}</span>
                      <span className="font-semibold text-purple-300">{panchang.localNoon}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-purple-900/10 pb-2">
                      <span className="text-muted-foreground">दिवामान (Day Length)</span>
                      <span className="font-medium text-slate-200">{panchang.divamaan}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">रात्रिमान (Night Length)</span>
                      <span className="font-medium text-slate-200">{panchang.ratrimaan}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Main 5 Limbs */}
                <Card className="bg-purple-950/5 border-purple-900/20 md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-purple-300 text-base flex items-center gap-1.5">
                      <Compass className="h-5 w-5 text-purple-400" />
                      {language === 'en' ? '5 Limbs of Panchang' : 'पंचांग के पांच अंग विवरण'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm">
                    <div className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/10">
                      <span className="text-xs text-purple-400 font-bold block mb-1">तिथि (Tithi)</span>
                      <span className="font-medium text-slate-200">{panchang.tithi}</span>
                    </div>

                    <div className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/10">
                      <span className="text-xs text-purple-400 font-bold block mb-1">नक्षत्र (Nakshatra)</span>
                      <span className="font-medium text-slate-200">{panchang.nakshatra} ({panchang.nakshatraLords} स्वामी)</span>
                    </div>

                    <div className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/10">
                      <span className="text-xs text-purple-400 font-bold block mb-1">योग (Yoga)</span>
                      <span className="font-medium text-slate-200">{panchang.yoga} योग</span>
                    </div>

                    <div className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/10">
                      <span className="text-xs text-purple-400 font-bold block mb-1">करण (Karana)</span>
                      <span className="font-medium text-slate-200">{panchang.karana}</span>
                    </div>

                    <div className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/10">
                      <span className="text-xs text-purple-400 font-bold block mb-1">वार (Vaar)</span>
                      <span className="font-medium text-slate-200">{panchang.vaar}</span>
                    </div>

                    <div className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/10">
                      <span className="text-xs text-purple-400 font-bold block mb-1">चंद्र / सूर्य राशि (Moon & Sun)</span>
                      <span className="font-medium text-slate-200">चंद्र: {panchang.rashiMoon} | सूर्य: {panchang.rashiSun}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sanskrit GPS Sankalpa lock */}
              <Card className="bg-purple-950/10 border-purple-900/30 mt-6">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-semibold tracking-wider text-purple-400 uppercase">
                    {language === 'en' ? 'Sankalpa Mantra (Cosmic Coordinates Lock)' : 'वैदिक संकल्प मंत्र (ब्रह्माण्डीय दिशा ग्रिड)'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 text-xs text-slate-400 leading-relaxed font-sans select-text">
                  {sankalpa}
                </CardContent>
              </Card>

              {/* Panchak and Gandmool warning flags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className={`p-4 rounded-lg border flex items-center justify-between ${
                  panchang.panchak 
                    ? 'bg-rose-950/20 border-rose-900/30 text-rose-400' 
                    : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400'
                }`}>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5" />
                    <div>
                      <span className="font-bold text-sm block">पंचक विचार (Panchak Status)</span>
                      <span className="text-xs text-slate-400">
                        {panchang.panchak ? "पंचक नक्षत्र चालू है (वर्जित कार्य टालें)" : "पंचक दोष मुक्त समय है"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border flex items-center justify-between ${
                  panchang.gandmool 
                    ? 'bg-rose-950/20 border-rose-900/30 text-rose-400' 
                    : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400'
                }`}>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5" />
                    <div>
                      <span className="font-bold text-sm block">गंडमूल नक्षत्र विचार (Gandmool Status)</span>
                      <span className="text-xs text-slate-400">
                        {panchang.gandmool ? "अश्विनी/अश्लेषा/मूल नक्षत्र चालू है (शांति पूजा आवश्यक)" : "गंडमूल दोष मुक्त समय है"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Muhurats Tab */}
            <TabsContent value="muhurats" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Auspicious/Inauspicious Kaals summary */}
                <Card className="bg-purple-950/5 border-purple-900/20 md:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-purple-300 text-sm flex items-center">
                      <Clock className="mr-2 text-purple-400" />
                      {language === 'en' ? 'Auspicious & Verboten Windows' : 'आज के शुभ-अशुभ काल खंड'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-900/30">
                      <span className="font-bold text-emerald-400 block mb-0.5">अभिजीत मुहूर्त (Abhijit)</span>
                      <span className="text-slate-300 font-medium">{abhijitTime}</span>
                      <span className="text-[10px] text-muted-foreground block mt-1">सर्वश्रेष्ठ मांगलिक मुहूर्त (बुधवार वर्जित)</span>
                    </div>

                    <div className="p-2.5 rounded bg-rose-950/30 border border-rose-900/30">
                      <span className="font-bold text-rose-400 block mb-0.5">राहु काल (Rahu Kaal)</span>
                      <span className="text-slate-300 font-medium">{rahuTime}</span>
                      <span className="text-[10px] text-muted-foreground block mt-1">इस समय कोई नया व्यापार या शुभ कार्य न करें।</span>
                    </div>

                    <div className="p-2.5 rounded bg-purple-950/30 border border-purple-900/20">
                      <span className="font-bold text-purple-400 block mb-0.5">यमगंड काल (Yamaganda)</span>
                      <span className="text-slate-300 font-medium">{yamaTime}</span>
                    </div>

                    <div className="p-2.5 rounded bg-purple-950/30 border border-purple-900/20">
                      <span className="font-bold text-purple-400 block mb-0.5">गुलिक काल (Gulika)</span>
                      <span className="text-slate-300 font-medium">{gulikaTime}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* 30 Daily Muhurats Table */}
                <Card className="bg-purple-950/5 border-purple-900/20 md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-purple-300 text-sm">
                      {language === 'en' ? '30 Daily Mahamuhurats (Day & Night)' : 'दिन और रात के 30 महा-मुहूर्त समय खंड'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'Calculated based on actual Sunrise and Sunset duration divisions' : 'स्थानीय सूर्योदय-सूर्यास्त आधारित घटी-पल अनुपातिक मुहूर्त सूची'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] overflow-y-auto pt-2">
                    <div className="overflow-x-auto text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-purple-900/10 text-purple-200">
                          <tr>
                            <th className="p-2">क्र.</th>
                            <th className="p-2">मुहूर्त नाम</th>
                            <th className="p-2">समय खिड़की</th>
                            <th className="p-2">स्वभाव (Nature)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-purple-900/10">
                          {muhurats.map((m, idx) => (
                            <tr key={idx} className="hover:bg-purple-900/5">
                              <td className="p-2 font-medium text-slate-300">{idx + 1}</td>
                              <td className="p-2 font-bold text-slate-200">{m.name}</td>
                              <td className="p-2 text-slate-300 font-mono">{m.time}</td>
                              <td className="p-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] ${
                                  m.isAuspicious 
                                    ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' 
                                    : 'bg-rose-950/20 text-rose-400 border border-rose-900/30'
                                }`}>
                                  {m.nature}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Choghadiya Tab */}
            <TabsContent value="choghadiya" className="mt-4">
              <Card className="bg-purple-950/5 border-purple-900/20">
                <CardHeader>
                  <CardTitle className="text-purple-300 flex items-center">
                    <Award className="mr-2 text-purple-400" />
                    {language === 'en' ? 'Day & Night Choghadiya Matrix' : 'दिन और रात का चौघड़िया समय चक्र'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' ? '8 Day-time and 8 Night-time segments for instant auspicious timing' : 'यात्रा, व्यापार, और खरीदारी के लिए अमृत, शुभ, लाभ के चौघड़िया काल खंड'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-purple-900/10 text-purple-200">
                        <tr>
                          <th className="p-3 font-semibold">चौघड़िया (Name)</th>
                          <th className="p-3 font-semibold">समय (Time Window)</th>
                          <th className="p-3 font-semibold">स्वामी ग्रह (Ruler)</th>
                          <th className="p-3 font-semibold">गुण (Quality)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-900/10">
                        {choghadiya.map((c, idx) => (
                          <tr key={idx} className="hover:bg-purple-900/5">
                            <td className="p-3 font-bold text-slate-200">{c.name}</td>
                            <td className="p-3 font-mono text-slate-300">{c.time}</td>
                            <td className="p-3 text-slate-400">{c.ruler}</td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded font-medium ${
                                ['Amrit', 'Shubh', 'Labh'].includes(c.quality)
                                  ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/30'
                                  : c.quality === 'Chal'
                                    ? 'bg-blue-950/30 text-blue-400 border border-blue-900/30'
                                    : 'bg-rose-950/30 text-rose-400 border border-rose-900/30'
                              }`}>
                                {c.quality}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hora Tab */}
            <TabsContent value="hora" className="mt-4">
              <Card className="bg-purple-950/5 border-purple-900/20">
                <CardHeader>
                  <CardTitle className="text-purple-300 flex items-center">
                    <BookOpen className="mr-2 text-purple-400" />
                    {language === 'en' ? '24-Hour Planetary Hora Cycle' : '24 घंटे का होरा शास्त्र तालिका चक्र'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Chaldean planetary sequence starting from Sunrise of the weekday' : 'त्वरित कार्यों के लिए अनुकूल ग्रह होरा का चयन करें'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] overflow-y-auto pt-2">
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-purple-900/10 text-purple-200">
                        <tr>
                          <th className="p-2">घंटा (Hora)</th>
                          <th className="p-2">समय (Time)</th>
                          <th className="p-2">रूलर (Ruler)</th>
                          <th className="p-2">शुभ कार्य हेतु अनुकूल (Good For)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-900/10">
                        {horas.map((h, idx) => (
                          <tr key={idx} className="hover:bg-purple-900/5">
                            <td className="p-2 font-medium text-slate-300">{h.hourNum}</td>
                            <td className="p-2 font-mono text-slate-300">{h.time}</td>
                            <td className="p-2 font-bold text-purple-300">{h.ruler}</td>
                            <td className="p-2 text-slate-300">{h.favorableActivities.join(", ")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Finder & Festivals Tab */}
            <TabsContent value="muhuratFinder" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Muhurat Finder */}
                <Card className="bg-purple-950/5 border-purple-900/20">
                  <CardHeader>
                    <CardTitle className="text-purple-300 text-sm flex items-center">
                      <CalendarCheck className="mr-2 text-purple-400" />
                      {language === 'en' ? 'Muhurat Finder' : 'शुभ मुहूर्त शोधक (आगामी तिथियां)'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="p-3 rounded bg-purple-950/20 border border-purple-900/10">
                      <span className="font-bold text-purple-300 block mb-1">विवाह मुहूर्त (Marriage)</span>
                      <p className="text-slate-300">चैत्र शुक्ल द्वितीया, तृतीया, एवं पंचमी (18, 19, और 21 तारीख)</p>
                    </div>
                    <div className="p-3 rounded bg-purple-950/20 border border-purple-900/10">
                      <span className="font-bold text-purple-300 block mb-1">गृह प्रवेश (House Warming)</span>
                      <p className="text-slate-300">वैशाख शुक्ल एकादशी (अक्षय तृतीया के समीप उत्तम योग)</p>
                    </div>
                    <div className="p-3 rounded bg-purple-950/20 border border-purple-900/10">
                      <span className="font-bold text-purple-300 block mb-1">वाहन / संपत्ति क्रय (Vehicle Purchase)</span>
                      <p className="text-slate-300">रोहिणी और हस्त नक्षत्र युक्त शनिवार, रविवार (पुष्य योग विशिष्ट)</p>
                    </div>
                    <div className="p-3 rounded bg-purple-950/20 border border-purple-900/10">
                      <span className="font-bold text-purple-300 block mb-1">व्यापार उद्घाटन (Business Opening)</span>
                      <p className="text-slate-300">बुधवार और गुरुवार के लाभ/अमृत चौघड़िया मुहूर्त</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Festival Calendar */}
                <Card className="bg-purple-950/5 border-purple-900/20">
                  <CardHeader>
                    <CardTitle className="text-purple-300 text-sm flex items-center">
                      <CalendarCheck className="mr-2 text-amber-500" />
                      {language === 'en' ? 'Festival & Vrats Calendar' : 'मासिक व्रत एवं हिन्दू त्योहार सूची'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
                    {getFestivals().map((f, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-purple-900/10 pb-2 last:border-b-0">
                        <span className="font-semibold text-slate-200">{f}</span>
                        <Badge variant="cosmic" className="text-[10px] px-2 py-0.5">
                          {idx % 2 === 0 ? "प्रमुख व्रत" : "पर्व"}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PageLayout>
  );
};

export default PanchangPage;
