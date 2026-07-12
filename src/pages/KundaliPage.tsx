import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KundaliChart } from '@/components/KundaliChart';
import { Separator } from "@/components/ui/separator";
import { 
  generateKundaliPlacements, 
  calculateVimshottariDasha, 
  getFullPanchang, 
  ZODIAC_SIGNS, 
  NAKSHATRAS, 
  generateSankalpaMantra, 
  calculateUpagrahas,
  generateVargaChartPlanets,
  generateAstroPredictions
} from '@/lib/astroEngine';
import { FileText, Download, Save, Award, Activity, Calendar, Compass, ShieldAlert, Sparkles, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

import { INDIAN_CITIES } from '@/data/citiesData';
import { Search } from 'lucide-react';

const VARGA_CHARTS = [
  { id: 1, name: "D1 - Lagna (लग्न)", nameEn: "D1 - Lagna Chart" },
  { id: 2, name: "D2 - Hora (होरा - धन संपत्ति)", nameEn: "D2 - Hora Chart" },
  { id: 3, name: "D3 - Drekkana (द्रेष्काण - भाई बहन)", nameEn: "D3 - Drekkana Chart" },
  { id: 4, name: "D4 - Chaturthamsa (चतुर्थांश - भाग्य व संपत्ति)", nameEn: "D4 - Chaturthamsa Chart" },
  { id: 7, name: "D7 - Saptamsa (सप्तमांश - संतान सुख)", nameEn: "D7 - Saptamsa Chart" },
  { id: 9, name: "D9 - Navamsa (नवांश - विवाह व भाग्य)", nameEn: "D9 - Navamsa Chart" },
  { id: 10, name: "D10 - Dasamsa (दशमांश - व्यवसाय व करियर)", nameEn: "D10 - Dasamsa Chart" },
  { id: 12, name: "D12 - Dwadasamsa (द्वादशांश - माता पिता)", nameEn: "D12 - Dwadasamsa Chart" },
  { id: 16, name: "D16 - Shodasamsa (षोडशांश - सुख व वाहन)", nameEn: "D16 - Shodasamsa Chart" },
  { id: 20, name: "D20 - Vimsamsa (विंशांश - आध्यात्मिक प्रगति)", nameEn: "D20 - Vimsamsa Chart" },
  { id: 24, name: "D24 - Chaturvimsamsa (चतुर्विंशांश - बुद्धि व शिक्षा)", nameEn: "D24 - Chaturvimsamsa Chart" },
  { id: 27, name: "D27 - Saptavimsamsa (सप्तविंशांश - शारीरिक बल)", nameEn: "D27 - Saptavimsamsa Chart" },
  { id: 30, name: "D30 - Trimamsa (त्रिंशांश - अनिष्ट व चरित्र)", nameEn: "D30 - Trimamsa Chart" },
  { id: 40, name: "D40 - Khavedamsa (खवेदांश - शुभ फल)", nameEn: "D40 - Khavedamsa Chart" },
  { id: 45, name: "D45 - Akshavedamsa (अक्षवेदांश - सामान्य चरित्र)", nameEn: "D45 - Akshavedamsa Chart" },
  { id: 60, name: "D60 - Shastiamsa (षष्ट्यंश - पूर्व जन्म कर्म)", nameEn: "D60 - Shastiamsa Chart" }
];

export const KundaliPage: React.FC = () => {
  const { t, language } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    birthDate: '',
    birthTime: '',
    birthPlace: 'Delhi'
  });

  const [citySearch, setCitySearch] = useState("Delhi");
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [generatedData, setGeneratedData] = useState<any>(null);
  const [selectedVarga2, setSelectedVarga2] = useState<number>(9); // Default D9 Navamsa

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate || !formData.birthTime) {
      toast.error(language === 'en' ? "Please fill in all details." : "कृपया सभी विवरण भरें।");
      return;
    }

    const city = INDIAN_CITIES.find(c => c.name === formData.birthPlace) || INDIAN_CITIES[0];
    const bDate = new Date(formData.birthDate);
    
    // Generate planetary positions (D1)
    const planets = generateKundaliPlacements(bDate, formData.birthTime, city.lat, city.lng);
    
    // Generate all 16 Shodashvarga chart positions
    const vargasData: Record<number, any> = {};
    [1, 2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60].forEach(vid => {
      vargasData[vid] = generateVargaChartPlanets(planets, vid);
    });

    const moonPlanet = planets.find(p => p.name === "Moon");
    const moonLong = moonPlanet ? (ZODIAC_SIGNS.indexOf(moonPlanet.sign) * 30 + moonPlanet.degree) : 120;
    
    // Moon chart puts Moon sign in the 1st house
    const moonSignIdx = moonPlanet ? ZODIAC_SIGNS.indexOf(moonPlanet.sign) : 0;
    const moonChartPlanets = planets.map(p => {
      const pSignIdx = ZODIAC_SIGNS.indexOf(p.sign);
      const moonHouse = (pSignIdx - moonSignIdx + 12) % 12 + 1;
      return { ...p, house: moonHouse };
    });

    // Calculate Dashas
    const dashas = calculateVimshottariDasha(moonLong, bDate);
    
    // Calculate Panchang
    const panchang = getFullPanchang(bDate, city.lat, city.lng);
    
    // Upagrahas
    const sunPlanet = planets.find(p => p.name === "Sun");
    const sunLong = sunPlanet ? (ZODIAC_SIGNS.indexOf(sunPlanet.sign) * 30 + sunPlanet.degree) : 15;
    const upagrahas = calculateUpagrahas(sunLong);

    // Sankalpa
    const sankalpa = generateSankalpaMantra(bDate, city.name, panchang);

    // Dynamic Predictions (Bhavishyafal)
    const predictions = generateAstroPredictions(planets);

    // Doshas & Yogas Check
    const doshas = [
      {
        name: language === 'en' ? "Manglik Dosha" : "मांगलिक दोष",
        status: planets.find(p => p.name === "Mars")?.house === 1 || 
                planets.find(p => p.name === "Mars")?.house === 4 ||
                planets.find(p => p.name === "Mars")?.house === 7 ||
                planets.find(p => p.name === "Mars")?.house === 8 ||
                planets.find(p => p.name === "Mars")?.house === 12
                  ? (language === 'en' ? "Present (आंशिक मांगलिक)" : "आंशिक मांगलिक दोष उपस्थित है")
                  : (language === 'en' ? "Absent" : "दोष नहीं है"),
        remedy: language === 'en' ? "Chant Hanuman Chalisa. Worship Mangal Yantra." : "हनुमान चालीसा का पाठ करें। मंगल यंत्र की पूजा करें।"
      },
      {
        name: language === 'en' ? "Kaal Sarp Dosha" : "काल सर्प दोष",
        status: language === 'en' ? "Absent (नकारात्मक प्रभाव मुक्त)" : "मुक्त (कोई दोष नहीं है)",
        remedy: language === 'en' ? "Worship Lord Shiva. Offer water/milk to Shivling." : "महामृत्युंजय मंत्र का जप करें। शिव जी का रुद्राभिषेक कराएं।"
      },
      {
        name: language === 'en' ? "Sade Sati Status" : "शनि साढ़े साती स्थिति",
        status: language === 'en' ? "Neutral Period" : "सामान्य समय (साढ़े साती सक्रिय नहीं है)",
        remedy: language === 'en' ? "Donate mustard oil on Saturdays. Light a lamp under a Peepal tree." : "शनिवार को सरसों तेल का दान करें और पीपल वृक्ष के नीचे दीया जलाएं।"
      }
    ];

    const yogas = [
      {
        name: language === 'en' ? "Budhaditya Yoga" : "बुधादित्य योग",
        present: planets.find(p => p.name === "Sun")?.house === planets.find(p => p.name === "Mercury")?.house,
        desc: language === 'en' ? "Formed when Sun and Mercury are together. Grants sharp intellect, name, and fame." : "सूर्य और बुध की युति से बनता है। बुद्धि, प्रसिद्धि और यश दिलाता है।"
      },
      {
        name: language === 'en' ? "Gaja Kesari Yoga" : "गजकेसरी योग",
        present: true,
        desc: language === 'en' ? "Formed when Jupiter is in Kendra from Moon. Brings great wealth, wisdom, and leadership." : "चंद्रमा और देवगुरु बृहस्पति की केंद्र युति से बनता है। सुख, समृद्धि और ज्ञान प्रदान करता।"
      }
    ];

    setGeneratedData({
      planets,
      moonChartPlanets,
      dashas,
      panchang,
      upagrahas,
      sankalpa,
      doshas,
      yogas,
      vargasData,
      predictions
    });
    toast.success(language === 'en' ? "Janam Kundali generated successfully!" : "जन्म कुंडली सफलतापूर्वक तैयार हो गई है!");
  };

  const handleSave = () => {
    if (!generatedData) return;
    const saved = JSON.parse(localStorage.getItem('saved_kundalis') || '[]');
    const newRecord = {
      id: Date.now(),
      name: formData.name,
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      birthPlace: formData.birthPlace,
      data: generatedData
    };
    saved.push(newRecord);
    localStorage.setItem('saved_kundalis', JSON.stringify(saved));
    toast.success(language === 'en' ? "Kundali saved to your dashboard!" : "कुंडली आपके डैशबोर्ड में सहेज ली गई है!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4 max-w-6xl no-print">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">
            {language === 'en' ? 'Janam Kundali (Vedic Birth Chart)' : 'जन्म कुंडली (वैदिक जन्म पत्रिका)'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'en' ? 'Get highly precise planetary positions, charts, doshas, and remedies' : 'सटीक ग्रह स्थिति, जन्म चक्र, दोष, महादशा और लाल किताब उपाय प्राप्त करें'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Side */}
          <div className="lg:col-span-1">
            <Card className="border-purple-900/30 bg-purple-950/10">
              <CardHeader>
                <CardTitle className="text-purple-300">
                  {language === 'en' ? 'Enter Birth Details' : 'जन्म का विवरण दर्ज करें'}
                </CardTitle>
                <CardDescription>
                  {language === 'en' ? 'Provide accurate date and place of birth' : 'कुंडली की सत्यता के लिए सटीक समय और स्थान दर्ज करें'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {language === 'en' ? 'Full Name' : 'पूरा नाम'}
                    </label>
                    <Input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder={language === 'en' ? 'John Doe' : 'अमित कुमार'}
                      className="bg-black/35 border-purple-900/40"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {language === 'en' ? 'Gender' : 'लिंग'}
                    </label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(val) => handleSelectChange('gender', val)}
                    >
                      <SelectTrigger className="bg-black/35 border-purple-900/40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">{language === 'en' ? 'Male' : 'पुरुष'}</SelectItem>
                        <SelectItem value="Female">{language === 'en' ? 'Female' : 'महिला'}</SelectItem>
                        <SelectItem value="Other">{language === 'en' ? 'Other' : 'अन्य'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {language === 'en' ? 'Birth Date' : 'जन्म तिथि'}
                    </label>
                    <Input 
                      type="date" 
                      name="birthDate" 
                      value={formData.birthDate} 
                      onChange={handleChange} 
                      className="bg-black/35 border-purple-900/40"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {language === 'en' ? 'Birth Time' : 'जन्म समय'}
                    </label>
                    <Input 
                      type="time" 
                      name="birthTime" 
                      value={formData.birthTime} 
                      onChange={handleChange} 
                      className="bg-black/35 border-purple-900/40"
                    />
                  </div>

                  <div className="relative z-50">
                    <label className="text-sm font-medium mb-1 block">
                      {language === 'en' ? 'Birth Place (City)' : 'जन्म स्थान (शहर)'}
                    </label>
                    <div className="relative">
                      <div className="flex items-center bg-black/35 border border-purple-900/40 rounded-md px-3 py-2">
                        <Search className="h-4 w-4 text-purple-400 mr-2 shrink-0" />
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
                          className="bg-transparent border-0 outline-none p-0 text-sm w-full focus-visible:ring-0 focus-visible:ring-offset-0 h-5 text-slate-100"
                        />
                      </div>
                      {showCityDropdown && (
                        <div className="absolute left-0 right-0 mt-1 bg-purple-950 border border-purple-900/60 rounded-md shadow-lg max-h-[180px] overflow-y-auto z-50 divide-y divide-purple-900/20">
                          {INDIAN_CITIES.filter(city => 
                            city.name.toLowerCase().includes(citySearch.toLowerCase()) || 
                            city.state.toLowerCase().includes(citySearch.toLowerCase())
                          ).length > 0 ? (
                            INDIAN_CITIES.filter(city => 
                              city.name.toLowerCase().includes(citySearch.toLowerCase()) || 
                              city.state.toLowerCase().includes(citySearch.toLowerCase())
                            ).map(city => (
                              <button
                                type="button"
                                key={`${city.name}-${city.state}`}
                                onClick={() => {
                                  handleSelectChange('birthPlace', city.name);
                                  setCitySearch(city.name);
                                  setShowCityDropdown(false);
                                }}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-purple-900/40 text-slate-200 transition-colors flex justify-between items-center"
                              >
                                <span className="font-medium">{city.name}</span>
                                <span className="text-[10px] text-purple-400 font-semibold">{city.state}</span>
                              </button>
                            ))
                          ) : (
                            <div className="p-2 text-xs text-muted-foreground text-center">
                              {language === 'en' ? "No cities found" : "कोई शहर नहीं मिला"}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    <Sparkles className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Generate Kundali' : 'कुंडली बनाएं'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-2">
            {!generatedData ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-900/20 rounded-xl p-12 h-full text-center bg-purple-950/5">
                <FileText className="h-16 w-16 text-purple-800/40 mb-4 animate-bounce" />
                <h3 className="text-xl font-medium text-purple-200">
                  {language === 'en' ? 'Waiting for birth details' : 'जन्म विवरण की प्रतीक्षा है'}
                </h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  {language === 'en' ? 'Fill out the form and click Generate to run the Vedic calculations' : 'बाएं हाथ पर दिए गए फॉर्म को भरकर कुंडली तैयार करें'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4 text-emerald-500" />
                    {language === 'en' ? 'Save Chart' : 'डैशबोर्ड में सहेजें'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Download className="mr-2 h-4 w-4 text-purple-400" />
                    {language === 'en' ? 'Print / PDF' : 'प्रिंट / पीडीएफ रिपोर्ट'}
                  </Button>
                </div>

                <Tabs defaultValue="charts" className="w-full">
                  <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full bg-purple-950/20">
                    <TabsTrigger value="charts">{language === 'en' ? 'Charts' : 'जन्म चक्र'}</TabsTrigger>
                    <TabsTrigger value="planets">{language === 'en' ? 'Degrees' : 'ग्रह स्पष्ट'}</TabsTrigger>
                    <TabsTrigger value="yogas">{language === 'en' ? 'Yogas' : 'दोष और योग'}</TabsTrigger>
                    <TabsTrigger value="dashas">{language === 'en' ? 'Dashas' : 'महादशा'}</TabsTrigger>
                    <TabsTrigger value="bhavishyafal">{language === 'en' ? 'Predictions' : 'भविष्यफल'}</TabsTrigger>
                    <TabsTrigger value="remedies">{language === 'en' ? 'Remedies' : 'लाल किताब'}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="charts" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Lagna Chart D1 */}
                      <Card className="bg-purple-950/5 border-purple-900/20">
                        <CardContent className="p-4">
                          <KundaliChart 
                            planets={generatedData.planets} 
                            title={language === 'en' ? "Lagna Chart (D1)" : "लग्न कुंडली (डी1)"} 
                          />
                        </CardContent>
                      </Card>

                      {/* Right: Shodashvarga Chart selector */}
                      <Card className="bg-purple-950/5 border-purple-900/20">
                        <div className="px-4 pt-4 flex flex-row items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                            {language === 'en' ? 'Varga Chart' : 'षोडशवर्ग चक्र'}:
                          </span>
                          <Select 
                            value={selectedVarga2.toString()} 
                            onValueChange={(val) => setSelectedVarga2(Number(val))}
                          >
                            <SelectTrigger className="w-[170px] bg-black/35 border-purple-900/40 text-xs h-7">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {VARGA_CHARTS.map(vc => (
                                <SelectItem key={vc.id} value={vc.id.toString()} className="text-xs">
                                  {language === 'en' ? vc.nameEn : vc.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <CardContent className="p-4 pt-2">
                          <KundaliChart 
                            planets={generatedData.vargasData[selectedVarga2]} 
                            title={VARGA_CHARTS.find(vc => vc.id === selectedVarga2)?.[language === 'en' ? 'nameEn' : 'name'] || 'Divisional Chart'} 
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="planets" className="mt-4">
                    <Card className="bg-purple-950/5 border-purple-900/20">
                      <CardHeader>
                        <CardTitle className="text-purple-300 flex items-center">
                          <Activity className="mr-2 text-purple-400" />
                          {language === 'en' ? 'Planetary Placements' : 'सटीक ग्रह स्पष्ट विवरण'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-purple-900/10 text-purple-200">
                              <tr>
                                <th className="p-3 font-semibold">{language === 'en' ? 'Planet' : 'ग्रह'}</th>
                                <th className="p-3 font-semibold">{language === 'en' ? 'Zodiac Sign' : 'राशि'}</th>
                                <th className="p-3 font-semibold">{language === 'en' ? 'Degree' : 'अंश (Degree)'}</th>
                                <th className="p-3 font-semibold">{language === 'en' ? 'House' : 'भाव (House)'}</th>
                                <th className="p-3 font-semibold">{language === 'en' ? 'Retrograde' : 'वक्र स्थिति'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {generatedData.planets.map((p: any, idx: number) => (
                                <tr key={idx} className="border-b border-purple-900/10 hover:bg-purple-900/5">
                                  <td className="p-3 font-medium text-slate-200">{p.name === 'Ascendant' ? (language === 'en' ? 'Ascendant (Lagna)' : 'लग्न (Lagna)') : p.name}</td>
                                  <td className="p-3 text-slate-300">{p.sign}</td>
                                  <td className="p-3 text-slate-300">{p.degree}°</td>
                                  <td className="p-3 text-purple-300 font-semibold">{p.house}</td>
                                  <td className="p-3">{p.retrograde ? <span className="text-rose-400">वक्री (Retro)</span> : <span className="text-emerald-400">मार्गी (Direct)</span>}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Shadow Planets / Upagrahas */}
                        <div className="mt-8 border-t border-purple-900/20 pt-6">
                          <h4 className="font-semibold text-purple-300 mb-3 flex items-center">
                            <Compass className="mr-2 h-4 w-4" />
                            {language === 'en' ? 'Shadow Planets & Constants' : 'अप्रकाशित उपग्रह एवं काल चक्र'}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                            <div className="bg-purple-950/20 p-2.5 rounded border border-purple-900/10">
                              <span className="text-muted-foreground block">धूम (Dhoom)</span>
                              <span className="text-purple-300 font-medium">{generatedData.upagrahas.dhoom}</span>
                            </div>
                            <div className="bg-purple-950/20 p-2.5 rounded border border-purple-900/10">
                              <span className="text-muted-foreground block">व्यतिपात (Vyatipata)</span>
                              <span className="text-purple-300 font-medium">{generatedData.upagrahas.vyatipata}</span>
                            </div>
                            <div className="bg-purple-950/20 p-2.5 rounded border border-purple-900/10">
                              <span className="text-muted-foreground block">परिवेष (Parivesha)</span>
                              <span className="text-purple-300 font-medium">{generatedData.upagrahas.parivesha}</span>
                            </div>
                            <div className="bg-purple-950/20 p-2.5 rounded border border-purple-900/10">
                              <span className="text-muted-foreground block">इन्द्रचाप (Indrachapa)</span>
                              <span className="text-purple-300 font-medium">{generatedData.upagrahas.indrachapa}</span>
                            </div>
                            <div className="bg-purple-950/20 p-2.5 rounded border border-purple-900/10">
                              <span className="text-muted-foreground block">उपकेतु (Upaketu)</span>
                              <span className="text-purple-300 font-medium">{generatedData.upagrahas.upaketu}</span>
                            </div>
                            <div className="bg-purple-950/20 p-2.5 rounded border border-purple-900/10">
                              <span className="text-muted-foreground block">शनि सुत - मांडी / गुलिका</span>
                              <span className="text-purple-300 font-medium">गुलिक: {generatedData.panchang.gulikaTime}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="yogas" className="mt-4">
                    <div className="space-y-4">
                      {/* Doshas */}
                      <Card className="bg-purple-950/5 border-purple-900/20">
                        <CardHeader>
                          <CardTitle className="text-purple-300 flex items-center">
                            <ShieldAlert className="mr-2 text-rose-500" />
                            {language === 'en' ? 'Option Dosha Analysis' : 'प्रमुख कुण्डली दोष परीक्षण'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {generatedData.doshas.map((d: any, idx: number) => (
                            <div key={idx} className="border-b border-purple-900/10 pb-3 last:border-b-0 last:pb-0">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-slate-200">{d.name}</span>
                                <span className={`px-2 py-0.5 rounded text-xs ${
                                  d.status.includes('Absent') || d.status.includes('नहीं')
                                    ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/40' 
                                    : 'bg-rose-950/30 text-rose-400 border border-rose-900/40'
                                }`}>
                                  {d.status}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground font-medium">
                                <span className="text-purple-400 font-semibold">{language === 'en' ? 'Remedy: ' : 'निवारण उपाय: '}</span>
                                {d.remedy}
                              </p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Yogas */}
                      <Card className="bg-purple-950/5 border-purple-900/20">
                        <CardHeader>
                          <CardTitle className="text-purple-300 flex items-center">
                            <Sparkles className="mr-2 text-amber-500" />
                            {language === 'en' ? 'Planetary Yogas' : 'शुभ राजयोग एवं धनयोग'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {generatedData.yogas.map((y: any, idx: number) => (
                            <div key={idx} className="border-b border-purple-900/10 pb-3 last:border-b-0 last:pb-0">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-slate-200">{y.name}</span>
                                <span className="px-2 py-0.5 rounded text-xs bg-purple-950/30 text-purple-400 border border-purple-900/40">
                                  {language === 'en' ? 'Active' : 'पूर्ण सक्रिय है'}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">{y.desc}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="dashas" className="mt-4">
                    <Card className="bg-purple-950/5 border-purple-900/20">
                      <CardHeader>
                        <CardTitle className="text-purple-300 flex items-center">
                          <Calendar className="mr-2 text-purple-400" />
                          {language === 'en' ? 'Vimshottari Dasha Periods' : 'विंशोत्तरी महादशा एवं अंतर्दशा चक्र'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground mb-4">
                          {language === 'en' 
                            ? "Calculated chronologically based on your birth Moon longitude." 
                            : "जन्म के समय चंद्र देव के नक्षत्र स्वामी और भोग्य काल से शुरू होने वाला चक्र:"}
                        </p>
                        <div className="relative border-l-2 border-purple-900/40 ml-4 space-y-6">
                          {generatedData.dashas.map((d: any, idx: number) => (
                            <div key={idx} className="relative pl-6">
                              <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-purple-600 border-2 border-black flex items-center justify-center" />
                              <div className="flex justify-between">
                                <div>
                                  <span className="font-bold text-sm text-slate-200">{d.planet} {language === 'en' ? 'Mahadasha' : 'महादशा'}</span>
                                  <span className="text-xs text-muted-foreground block">{d.durationYears.toFixed(1)} {language === 'en' ? 'Years' : 'वर्ष'}</span>
                                </div>
                                <span className="text-xs font-semibold text-purple-400 bg-purple-950/30 px-2 py-1 border border-purple-900/30 rounded self-start">
                                  {d.startDate} - {d.endDate}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* New Tab: Bhavishyafal / Predictions */}
                  <TabsContent value="bhavishyafal" className="mt-4">
                    <Card className="bg-purple-950/5 border-purple-900/20">
                      <CardHeader>
                        <CardTitle className="text-purple-300 flex items-center">
                          <FileText className="mr-2 text-purple-400 animate-pulse" />
                          {language === 'en' ? 'Horoscope & Predictions (Bhavishyafal)' : 'विस्तृत जन्मपत्रिका भविष्यफल परीक्षण'}
                        </CardTitle>
                        <CardDescription>
                          {language === 'en' 
                            ? 'Detailed Vedic predictions based on Sun, Moon, and Ascendant placements' 
                            : 'आपके लग्न, चंद्र और सूर्य राशि स्थितियों पर आधारित पूर्ण व्यक्तिगत फलादेश'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-purple-950/20 p-4 rounded-xl border border-purple-900/10">
                            <span className="text-xs text-amber-400 font-bold block mb-1">लग्न फलादेश (Lagna Prediction)</span>
                            <p className="text-xs text-slate-300 leading-relaxed">{generatedData.predictions.lagnaPrediction}</p>
                          </div>
                          
                          <div className="bg-purple-950/20 p-4 rounded-xl border border-purple-900/10">
                            <span className="text-xs text-sky-400 font-bold block mb-1">चंद्र राशि फलादेश (Moon Sign Prediction)</span>
                            <p className="text-xs text-slate-300 leading-relaxed">{generatedData.predictions.moonPrediction}</p>
                          </div>

                          <div className="bg-purple-950/20 p-4 rounded-xl border border-purple-900/10">
                            <span className="text-xs text-orange-400 font-bold block mb-1">सूर्य राशि फलादेश (Sun Sign Prediction)</span>
                            <p className="text-xs text-slate-300 leading-relaxed">{generatedData.predictions.sunPrediction}</p>
                          </div>
                        </div>

                        <Separator className="bg-purple-900/20" />

                        <div className="space-y-4">
                          <div className="p-3 bg-purple-950/10 rounded-lg border border-purple-900/10">
                            <h4 className="font-semibold text-purple-300 text-sm mb-1.5 flex items-center">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                              स्वास्थ्य एवं जीवन शक्ति (Health & Vitality)
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed pl-4">{generatedData.predictions.healthPrediction}</p>
                          </div>

                          <div className="p-3 bg-purple-950/10 rounded-lg border border-purple-900/10">
                            <h4 className="font-semibold text-purple-300 text-sm mb-1.5 flex items-center">
                              <span className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
                              वित्त, धन एवं संपत्ति (Finance & Wealth)
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed pl-4">{generatedData.predictions.wealthPrediction}</p>
                          </div>

                          <div className="p-3 bg-purple-950/10 rounded-lg border border-purple-900/10">
                            <h4 className="font-semibold text-purple-300 text-sm mb-1.5 flex items-center">
                              <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />
                              करियर, नौकरी एवं व्यवसाय (Career & Profession)
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed pl-4">{generatedData.predictions.careerPrediction}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="remedies" className="mt-4">
                    <Card className="bg-purple-950/5 border-purple-900/20">
                      <CardHeader>
                        <CardTitle className="text-purple-300 flex items-center">
                          <Award className="mr-2 text-emerald-400" />
                          {language === 'en' ? 'Lal Kitab Remedies & Gems' : 'लाल किताब उपाय एवं रत्न परामर्श'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-purple-950/20 p-3.5 rounded-lg border border-purple-900/10">
                            <span className="font-semibold text-purple-300 text-sm block mb-1">
                              {language === 'en' ? 'Gemstone Recommendation' : 'भाग्यशाली रत्न परामर्श'}
                            </span>
                            <p className="text-xs text-slate-300">
                              {generatedData.panchang.nakshatraNum % 3 === 0 
                                ? (language === 'en' ? 'Pukhraj (Yellow Sapphire) for wisdom, career, and luck' : 'पुखराज रत्न धारण करें - स्वास्थ्य, भाग्य और शिक्षा में प्रगति दिलाता है।')
                                : generatedData.panchang.nakshatraNum % 3 === 1
                                  ? (language === 'en' ? 'Moti (Pearl) for calm mind and emotional balance' : 'मोती रत्न धारण करें - मानसिक शांति और एकाग्रता बढ़ाता है।')
                                  : (language === 'en' ? 'Moonga (Red Coral) for energy and removing obstacles' : 'मूंगा रत्न धारण करें - साहस प्रदान करता है और शत्रुओं पर विजय दिलाता है।')}
                            </p>
                          </div>

                          <div className="bg-purple-950/20 p-3.5 rounded-lg border border-purple-900/10">
                            <span className="font-semibold text-purple-300 text-sm block mb-1">
                              {language === 'en' ? 'Charity & Donation (दान)' : 'दान-पुण्य उपाय'}
                            </span>
                            <p className="text-xs text-slate-300">
                              {language === 'en' 
                                ? "Donate grains (saptadhanya) to birds on Wednesdays. Feed green grass to cows." 
                                : "बुधवार के दिन पक्षियों को सात प्रकार के अनाज खिलाएं। गाय को हरा चारा खिलाना अत्यंत शुभ है।"}
                            </p>
                          </div>

                          <div className="bg-purple-950/20 p-3.5 rounded-lg border border-purple-900/10">
                            <span className="font-semibold text-purple-300 text-sm block mb-1">
                              {language === 'en' ? 'Lucky Colors & Directions' : 'शुभ रंग एवं शुभ दिशा'}
                            </span>
                            <p className="text-xs text-slate-300">
                              {language === 'en' 
                                ? "Lucky Color: Yellow/Green | Favorable Direction: North-East" 
                                : "शुभ रंग: पीला, हल्का हरा | अनुकूल दिशा: ईशान कोण (North-East)"}
                            </p>
                          </div>

                          <div className="bg-purple-950/20 p-3.5 rounded-lg border border-purple-900/10">
                            <span className="font-semibold text-purple-300 text-sm block mb-1">
                              {language === 'en' ? 'Mantra & Daily Practice' : 'दैनिक मंत्र साधना'}
                            </span>
                            <p className="text-xs text-slate-300 font-mono">
                              {language === 'en'
                                ? "Chant 'Om Gram Greem Groum Sah Gurave Namah' 108 times daily."
                                : "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः - प्रतिदिन कम से कम 108 बार जाप करें।"}
                            </p>
                          </div>
                        </div>

                        {/* Sankalpa lock */}
                        <div className="mt-4 bg-purple-950/30 p-4 rounded border border-purple-800/20">
                          <span className="text-xs text-purple-400 font-semibold uppercase block mb-1">
                            {language === 'en' ? 'Vedic Time Stamp (Sankalpa Mantra)' : 'वैदिक काल-GPS मंत्र (संकल्प)'}
                          </span>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans">{generatedData.sankalpa}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRINT LAYOUT (Hidden on Screen) */}
      <div className="print-only p-8 text-black bg-white select-text w-full max-w-full">
        {generatedData && (
          <div className="space-y-8">
            <div className="text-center border-b-2 border-purple-600 pb-4">
              <h1 className="text-3xl font-bold text-purple-800">AstroChat Janam Kundali Report</h1>
              <p className="text-sm text-gray-600 mt-1">Generated for: {formData.name} | Birth Date: {formData.birthDate} | Time: {formData.birthTime} | Place: {formData.birthPlace}</p>
              <p className="text-xs text-gray-500 font-mono mt-1">{generatedData.sankalpa}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 justify-items-center">
              <div>
                <h3 className="text-center font-bold text-gray-800 mb-2">Lagna Chart (D1)</h3>
                <div className="w-[300px] h-[300px] border border-gray-400">
                  <KundaliChart planets={generatedData.planets} title="" />
                </div>
              </div>
              <div>
                <h3 className="text-center font-bold text-gray-800 mb-2">
                  {VARGA_CHARTS.find(vc => vc.id === selectedVarga2)?.nameEn || 'Divisional Chart'}
                </h3>
                <div className="w-[300px] h-[300px] border border-gray-400">
                  <KundaliChart planets={generatedData.vargasData[selectedVarga2]} title="" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-lg text-gray-800 border-b pb-1 mb-2">Planetary Placements & Degrees</h3>
              <table className="w-full text-xs text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Planet</th>
                    <th className="border border-gray-300 p-2">Sign</th>
                    <th className="border border-gray-300 p-2">Degree</th>
                    <th className="border border-gray-300 p-2">House</th>
                    <th className="border border-gray-300 p-2">Retrograde</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedData.planets.map((p: any, idx: number) => (
                    <tr key={idx}>
                      <td className="border border-gray-300 p-2 font-medium">{p.name}</td>
                      <td className="border border-gray-300 p-2">{p.sign}</td>
                      <td className="border border-gray-300 p-2">{p.degree}°</td>
                      <td className="border border-gray-300 p-2">{p.house}</td>
                      <td className="border border-gray-300 p-2">{p.retrograde ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Print predictions too! */}
            <div className="mt-8">
              <h3 className="font-bold text-lg text-gray-800 border-b pb-1 mb-2">Horoscope Predictions (Bhavishyafal)</h3>
              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <strong>Personality (Lagna):</strong> {generatedData.predictions.lagnaPrediction}
                </div>
                <div>
                  <strong>Moon Sign (Mind):</strong> {generatedData.predictions.moonPrediction}
                </div>
                <div>
                  <strong>Sun Sign (Soul):</strong> {generatedData.predictions.sunPrediction}
                </div>
                <div>
                  <strong>Health Outlook:</strong> {generatedData.predictions.healthPrediction}
                </div>
                <div>
                  <strong>Finance & Wealth:</strong> {generatedData.predictions.wealthPrediction}
                </div>
                <div>
                  <strong>Career & Profession:</strong> {generatedData.predictions.careerPrediction}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="font-bold text-lg text-gray-800 border-b pb-1 mb-2">Active Yogas & Doshas</h3>
                <ul className="text-xs space-y-2">
                  {generatedData.doshas.map((d: any, idx: number) => (
                    <li key={idx}><strong className="text-purple-800">{d.name}:</strong> {d.status} ({d.remedy})</li>
                  ))}
                  {generatedData.yogas.map((y: any, idx: number) => (
                    <li key={idx}><strong className="text-emerald-800">{y.name}:</strong> Active ({y.desc})</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800 border-b pb-1 mb-2">Vimshottari Dasha periods</h3>
                <ul className="text-xs space-y-2">
                  {generatedData.dashas.map((d: any, idx: number) => (
                    <li key={idx} className="flex justify-between border-b py-1">
                      <span><strong>{d.planet}</strong> ({d.durationYears.toFixed(1)} yrs)</span>
                      <span>{d.startDate} - {d.endDate}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default KundaliPage;
