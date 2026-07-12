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

import { INDIAN_CITIES } from '@/data/citiesData';
import { Search } from "lucide-react";

const PanchangPage = () => {
  const { t, language } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedCity, setSelectedCity] = useState<string>("Delhi");
  const [citySearch, setCitySearch] = useState("Delhi");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  
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
      const cityObj = INDIAN_CITIES.find(c => c.name === selectedCity) || INDIAN_CITIES[0];
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
      // Jan (0)
      [
        { name: "मकर संक्रांति", date: "14 जनवरी", time: "पुण्यकाल: सुबह 07:15 AM से शाम 05:45 PM", type: "प्रमुख पर्व" },
        { name: "लोहड़ी", date: "13 जनवरी", time: "सायंकाल पूजन: शाम 06:15 PM से रात 08:30 PM", type: "पारंपरिक त्योहार" },
        { name: "स्वामी विवेकानंद जयंती", date: "12 जनवरी", time: "पूरा दिन (राष्ट्रीय युवा दिवस)", type: "जयंती" },
        { name: "पौष पुत्रदा एकादशी", date: "20 जनवरी", time: "पारण: अगले दिन सुबह 07:14 AM से 09:20 AM", type: "महत्वपूर्ण व्रत" }
      ],
      // Feb (1)
      [
        { name: "वसन्त पंचमी", date: "22 फरवरी", time: "सरस्वती पूजा मुहूर्त: सुबह 07:12 AM से दोपहर 12:35 PM", type: "प्रमुख पर्व" },
        { name: "महाशिवरात्रि", date: "15 फरवरी", time: "निशीथ काल पूजा: रात 12:09 AM से 01:01 AM", type: "महा व्रत" },
        { name: "जया एकादशी", date: "28 फरवरी", time: "पारण: अगले दिन सुबह 06:42 AM से 08:58 AM", type: "एकादशी व्रत" },
        { name: "रथ सप्तमी", date: "24 फरवरी", time: "सूर्योदय स्नान मुहूर्त: सुबह 05:12 AM से 06:45 AM", type: "पर्व" }
      ],
      // Mar (2)
      [
        { name: "होलिका दहन", date: "3 मार्च", time: "शुभ मुहूर्त: शाम 06:22 PM से रात 08:45 PM", type: "प्रमुख पर्व" },
        { name: "होली (धुलंडी)", date: "4 मार्च", time: "प्रतिपदा तिथि: पूरा दिन रंगों का उत्सव", type: "पर्व" },
        { name: "रंग पंचमी", date: "8 मार्च", time: "पंचमी तिथि: देवी-देवताओं की होली", type: "पर्व" },
        { name: "आमलकी एकादशी", date: "19 मार्च", time: "पारण: सुबह 06:25 AM से 08:45 AM", type: "एकादशी व्रत" }
      ],
      // Apr (3)
      [
        { name: "चैत्र नवरात्रि प्रारंभ", date: "18 अप्रैल", time: "कलश स्थापना मुहूर्त: सुबह 06:08 AM से 10:14 AM", type: "नवरात्रि" },
        { name: "राम नवमी", date: "26 अप्रैल", time: "मध्याह्न पूजा मुहूर्त: सुबह 11:06 AM से दोपहर 01:39 PM", type: "प्रमुख पर्व" },
        { name: "हनुमान जयंती", date: "30 अप्रैल", time: "पूर्णिमा तिथि: मारुति जन्मोत्सव", type: "जयंती" },
        { name: "कामदा एकादशी", date: "3 अप्रैल", time: "पारण: सुबह 06:10 AM से 08:30 AM", type: "एकादशी व्रत" }
      ],
      // May (4)
      [
        { name: "अक्षय तृतीया", date: "9 मई", time: "पूजा मुहूर्त: सुबह 05:45 AM से दोपहर 12:18 PM", type: "अबूझ मुहूर्त" },
        { name: "परशुराम जयंती", date: "9 मई", time: "तृतीया तिथि प्रारंभ: सुबह 07:22 AM से", type: "जयंती" },
        { name: "बुद्ध पूर्णिमा", date: "22 मई", time: "पूर्णिमा तिथि: बुद्ध अवतरण दिवस", type: "पर्व" },
        { name: "मोहिनी एकादशी", date: "18 मई", time: "पारण: सुबह 05:28 AM से 08:12 AM", type: "एकादशी व्रत" }
      ],
      // Jun (5)
      [
        { name: "निर्जला एकादशी", date: "6 जून", time: "पारण: अगले दिन सुबह 05:24 AM से 08:10 AM", type: "महा व्रत" },
        { name: "गंगा दशहरा", date: "4 जून", time: "दशमी तिथि: गंगा स्नान का महा मुहूर्त", type: "पर्व" },
        { name: "वट सावित्री व्रत", date: "14 जून", time: "पूजा मुहूर्त: सुबह 05:23 AM से दोपहर 02:30 PM", type: "सौभाग्य व्रत" },
        { name: "योगिनी एकादशी", date: "20 जून", time: "पारण: सुबह 05:25 AM से 08:15 AM", type: "एकादशी व्रत" }
      ],
      // Jul (6)
      [
        { name: "गुरु पूर्णिमा", date: "19 जुलाई", time: "पूजा मुहूर्त: सुबह 06:45 AM से दोपहर 12:00 PM", type: "प्रमुख पर्व" },
        { name: "जगन्नाथ रथ यात्रा", date: "5 जुलाई", time: "रथ यात्रा प्रस्थान: दोपहर 02:15 PM से", type: "रथोत्सव" },
        { name: "देवशयनी एकादशी", date: "4 जुलाई", time: "पारण: सुबह 05:28 AM से 08:18 AM", type: "एकादशी व्रत" },
        { name: "कर्क संक्रांति", date: "16 जुलाई", time: "पुण्यकाल: दोपहर 12:15 PM से शाम 06:50 PM", type: "संक्रांति" }
      ],
      // Aug (7)
      [
        { name: "रक्षा बंधन", date: "18 अगस्त", time: "भद्रा रहित राखी मुहूर्त: दोपहर 01:35 PM से रात 09:12 PM", type: "प्रमुख पर्व" },
        { name: "श्री कृष्ण जन्माष्टमी", date: "26 अगस्त", time: "निशीथ पूजा मुहूर्त: रात 12:01 AM से 12:45 AM", type: "महा व्रत" },
        { name: "श्रावणी पूर्णिमा", date: "18 अगस्त", time: "यज्ञोपवीत पूजन समय: सुबह 06:12 AM से 10:45 AM", type: "पर्व" },
        { name: "पुत्रदा एकादशी", date: "24 अगस्त", time: "पारण: सुबह 05:55 AM से 08:35 AM", type: "एकादशी व्रत" }
      ],
      // Sep (8)
      [
        { name: "गणेश चतुर्थी", date: "5 सितंबर", time: "मूर्ति स्थापना मुहूर्त: सुबह 11:03 AM से दोपहर 01:32 PM", type: "प्रमुख पर्व" },
        { name: "ऋषि पंचमी", date: "6 सितंबर", time: "सप्तऋषि पूजन मुहूर्त: सुबह 11:05 AM से दोपहर 01:35 PM", type: "व्रत" },
        { name: "राधाष्टमी", date: "9 सितंबर", time: "पूजा मुहूर्त: सुबह 11:04 AM से दोपहर 01:30 PM", type: "पर्व" },
        { name: "अनंत चतुर्दशी", date: "15 सितंबर", time: "अनंत सूत्र धारण समय: सुबह 06:05 AM से दोपहर 12:12 PM", type: "व्रत" }
      ],
      // Oct (9)
      [
        { name: "शरद नवरात्रि प्रारंभ", date: "11 अक्टूबर", time: "घटस्थापना मुहूर्त: सुबह 06:21 AM से 08:42 AM", type: "नवरात्रि" },
        { name: "दुर्गा पूजा महाअष्टमी", date: "18 अक्टूबर", time: "संधि पूजा मुहूर्त: रात 08:12 PM से 09:00 PM", type: "प्रमुख पर्व" },
        { name: "विजयादशमी / दशहरा", date: "20 अक्टूबर", time: "विजय मुहूर्त: दोपहर 02:01 PM से 02:47 PM", type: "प्रमुख पर्व" },
        { name: "शरद पूर्णिमा", date: "24 अक्टूबर", time: "लक्ष्मी पूजा मुहूर्त: रात 11:43 PM से 12:35 AM", type: "पर्व" }
      ],
      // Nov (10)
      [
        { name: "दीपावली / दिवाली", date: "8 नवंबर", time: "लक्ष्मी पूजा मुहूर्त: शाम 05:31 PM से रात 07:30 PM", type: "प्रमुख पर्व" },
        { name: "धनतेरस", date: "6 नवंबर", time: "प्रदोष काल पूजा मुहूर्त: शाम 05:32 PM से रात 08:11 PM", type: "पर्व" },
        { name: "नरक चतुर्दशी", date: "7 नवंबर", time: "अभ्यंग स्नान मुहूर्त: सुबह 05:14 AM से 06:38 AM", type: "पर्व" },
        { name: "गोवर्धन पूजा", date: "9 नवंबर", time: "पूजा मुहूर्त: दोपहर 03:21 PM से शाम 05:27 PM", type: "पर्व" },
        { name: "भैया दूज", date: "10 नवंबर", time: "टीका लगाने का मुहूर्त: दोपहर 01:09 PM से 03:22 PM", type: "पर्व" },
        { name: "छठ पूजा (संध्या अर्घ्य)", date: "14 नवंबर", time: "अर्घ्यदान (सूर्यास्त समय): शाम 05:25 PM", type: "महा पर्व" }
      ],
      // Dec (11)
      [
        { name: "गीता जयंती", date: "20 दिसंबर", time: "मोक्षदा एकादशी के दिन गीता पाठ मुहूर्त", type: "पर्व" },
        { name: "मोक्षदा एकादशी", date: "20 दिसंबर", time: "पारण: सुबह 07:09 AM से 09:15 AM", type: "एकादशी व्रत" },
        { name: "दत्तात्रेय जयंती", date: "23 दिसंबर", time: "प्रदोष पूजा मुहूर्त: शाम 05:18 PM से रात 08:02 PM", type: "जयंती" },
        { name: "सफला एकादशी", date: "5 दिसंबर", time: "पारण: सुबह 07:01 AM से 09:12 AM", type: "एकादशी व्रत" }
      ]
    ];
    return festivalsList[m] || [
      { name: "प्रदोष व्रत", date: "त्रयोदशी तिथि", time: "प्रदोष काल मुहूर्त: शाम 05:30 PM से रात 08:00 PM", type: "पाक्षिक व्रत" },
      { name: "मासिक शिवरात्रि", date: "चतुर्दशी तिथि", time: "निशीथ काल पूजा: रात 11:55 PM से 12:45 AM", type: "पाक्षिक व्रत" }
    ];
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

            <div className="flex items-center gap-2 relative z-50">
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                {language === 'en' ? 'Location' : 'स्थान'}:
              </span>
              <div className="relative w-[180px]">
                <div className="flex items-center bg-black/35 border border-purple-900/40 rounded-md px-2 py-1">
                  <Search className="h-3.5 w-3.5 text-purple-400 mr-1.5 shrink-0" />
                  <Input 
                    type="text"
                    value={citySearch}
                    onChange={(e) => {
                      setCitySearch(e.target.value);
                      setShowCityDropdown(true);
                    }}
                    onFocus={() => setShowCityDropdown(true)}
                    onBlur={() => {
                      setTimeout(() => setShowCityDropdown(false), 250);
                    }}
                    placeholder={language === 'en' ? "Search city..." : "शहर खोजें..."}
                    className="bg-transparent border-0 outline-none p-0 text-xs w-full focus-visible:ring-0 focus-visible:ring-offset-0 h-6 text-slate-100"
                  />
                </div>
                {showCityDropdown && (
                  <div className="absolute left-0 right-0 mt-1 bg-purple-950/95 border border-purple-900/60 rounded-md shadow-lg max-h-[200px] overflow-y-auto z-50 divide-y divide-purple-900/20">
                    {INDIAN_CITIES.filter(city => 
                      city.name.toLowerCase().includes(citySearch.toLowerCase()) || 
                      city.state.toLowerCase().includes(citySearch.toLowerCase())
                    ).length > 0 ? (
                      INDIAN_CITIES.filter(city => 
                        city.name.toLowerCase().includes(citySearch.toLowerCase()) || 
                        city.state.toLowerCase().includes(citySearch.toLowerCase())
                      ).map(city => (
                        <button
                          key={`${city.name}-${city.state}`}
                          onClick={() => {
                            setSelectedCity(city.name);
                            setCitySearch(city.name);
                            setShowCityDropdown(false);
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
                      {panchang.tithiEndTime ? (
                        <span className="text-xs text-amber-400 block mt-1">
                          {panchang.tithiEndTime} PM तक (तदुपरान्त {panchang.tithiNextName})
                        </span>
                      ) : (
                        <span className="text-xs text-amber-400/70 block mt-1">पूर्ण दिन</span>
                      )}
                    </div>

                    <div className="bg-purple-950/20 p-3 rounded-lg border border-purple-900/10">
                      <span className="text-xs text-purple-400 font-bold block mb-1">नक्षत्र (Nakshatra)</span>
                      <span className="font-medium text-slate-200">{panchang.nakshatra} ({panchang.nakshatraLords} स्वामी)</span>
                      {panchang.nakshatraEndTime ? (
                        <span className="text-xs text-amber-400 block mt-1">
                          {panchang.nakshatraEndTime} PM तक (तदुपरान्त {panchang.nakshatraNextName})
                        </span>
                      ) : (
                        <span className="text-xs text-amber-400/70 block mt-1">पूर्ण दिन</span>
                      )}
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
                    {getFestivals().map((f: any, idx) => (
                      <div key={idx} className="flex flex-col border-b border-purple-900/10 pb-3 last:border-b-0 gap-1.5 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm text-slate-200">{f.name}</span>
                          <span className="text-[11px] font-semibold text-amber-400 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/30 font-mono">{f.date}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">{f.time}</span>
                          <Badge variant="cosmic" className="text-[10px] px-2 py-0.5">
                            {f.type}
                          </Badge>
                        </div>
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
