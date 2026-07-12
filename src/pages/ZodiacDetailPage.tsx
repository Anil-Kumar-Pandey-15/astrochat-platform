
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getZodiacSignByName, ZodiacSignData, zodiacSigns } from '@/data/zodiacSigns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Briefcase, Activity, Users, Coins, BookOpen, Plane, Compass } from "lucide-react";

const ZodiacDetailPage = () => {
  const { sign } = useParams<{ sign: string }>();
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [zodiacData, setZodiacData] = useState<ZodiacSignData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (sign) {
      const data = getZodiacSignByName(sign);
      if (data) {
        setZodiacData(data);
      } else {
        navigate('/horoscope');
      }
    }
  }, [sign, navigate]);

  if (!zodiacData) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 text-center">
          <p>{t('common.loading')}</p>
        </div>
      </PageLayout>
    );
  }

  const formatName = (name: string) => {
    return language === 'en' ? name : t(`zodiac.${name.toLowerCase()}.name`);
  };

  const formatDescription = (name: string) => {
    return language === 'en' ? zodiacData.description : t(`zodiac.${name.toLowerCase()}.description`);
  };

  const formatTraits = (name: string, traits: string[]) => {
    if (language === 'en') return traits;
    return traits.map((_, index) => t(`zodiac.${name.toLowerCase()}.traits[${index}]`));
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/horoscope')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.horoscope')}
        </Button>

        <div className="mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400 flex items-center gap-3">
              {formatName(zodiacData.name)} <span className="text-5xl">{zodiacData.symbol}</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              {zodiacData.dates}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                {t('common.element')}: {zodiacData.element}
              </span>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                {t('common.planet')}: {zodiacData.planet}
              </span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
            <TabsTrigger value="overview">{t('common.overview')}</TabsTrigger>
            <TabsTrigger value="daily">{t('bhavisyafal.dailyPrediction')}</TabsTrigger>
            <TabsTrigger value="weekly">{t('bhavisyafal.weeklyPrediction')}</TabsTrigger>
            <TabsTrigger value="monthly">{t('bhavisyafal.monthlyPrediction')}</TabsTrigger>
            <TabsTrigger value="yearly">{t('bhavisyafal.yearlyPrediction')}</TabsTrigger>
            <TabsTrigger value="compatibility">{t('common.compatibility')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('common.about')} {formatName(zodiacData.name)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{formatDescription(zodiacData.name.toLowerCase())}</p>
                <h3 className="font-semibold mb-2">{t('common.personalityTraits')}</h3>
                <div className="flex flex-wrap gap-2">
                  {formatTraits(zodiacData.name.toLowerCase(), zodiacData.traits).map((trait, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
                <h3 className="font-semibold mt-4 mb-2">{t('common.compatibleWith')}</h3>
                <div className="flex flex-wrap gap-2">
                  {zodiacData.compatibility.map((compatSign, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    >
                      {formatName(compatSign)}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('bhavisyafal.dailyPrediction')}</CardTitle>
                <CardDescription>{new Date().toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{language === 'en' ? zodiacData.description : t(`zodiac.${zodiacData.name.toLowerCase()}.description`)}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center mb-2">
                      <Heart className="h-5 w-5 text-pink-500 mr-2" />
                      <h3 className="font-semibold">{t('bhavisyafal.loveLife')}</h3>
                    </div>
                    <p className="text-sm">{t('predictions.love')}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center mb-2">
                      <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-semibold">{t('bhavisyafal.career')}</h3>
                    </div>
                    <p className="text-sm">{t('predictions.career')}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center mb-2">
                      <Activity className="h-5 w-5 text-green-500 mr-2" />
                      <h3 className="font-semibold">{t('bhavisyafal.health')}</h3>
                    </div>
                    <p className="text-sm">{t('predictions.health')}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-purple-500 mr-2" />
                      <h3 className="font-semibold">{t('bhavisyafal.family')}</h3>
                    </div>
                    <p className="text-sm">{t('predictions.family')}</p>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <p className="text-xs text-muted-foreground">{t('bhavisyafal.luckyColor')}</p>
                    <p className="font-medium">{t('predictions.luckyColors')}</p>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <p className="text-xs text-muted-foreground">{t('bhavisyafal.luckyNumber')}</p>
                    <p className="font-medium">{t('predictions.luckyNumbers')}</p>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <p className="text-xs text-muted-foreground">{t('bhavisyafal.luckyDay')}</p>
                    <p className="font-medium">{t('predictions.luckyDays')}</p>
                  </div>
                  
                  <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <p className="text-xs text-muted-foreground">{t('bhavisyafal.gemstone')}</p>
                    <p className="font-medium">{t('predictions.gemstone')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('bhavisyafal.weeklyPrediction')}</CardTitle>
                <CardDescription>{new Date().toLocaleDateString()} - {new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('predictions.weekly')}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('bhavisyafal.monthlyPrediction')}</CardTitle>
                <CardDescription>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('predictions.monthly')}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yearly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('bhavisyafal.yearlyPrediction')}</CardTitle>
                <CardDescription>{new Date().getFullYear()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('predictions.yearly')}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compatibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('common.compatibility')}</CardTitle>
                <CardDescription>{t('common.checkCompatibility')}</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-4">{t('bhavisyafal.compatibleSigns')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {zodiacData.compatibility.map((compatSign, index) => (
                    <Card key={index} className="overflow-hidden border-green-200 dark:border-green-900">
                      <CardHeader className="p-3 bg-green-50 dark:bg-green-900/20">
                        <CardTitle className="text-sm text-center">{formatName(compatSign)}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 text-xs text-center">
                        {t('common.highCompatibility')}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <h3 className="font-semibold mb-4">{t('bhavisyafal.incompatibleSigns')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {zodiacSigns
                    .filter(s => !zodiacData.compatibility.includes(s.name) && s.name !== zodiacData.name)
                    .slice(0, 4)
                    .map((incompatSign, index) => (
                      <Card key={index} className="overflow-hidden border-red-200 dark:border-red-900">
                        <CardHeader className="p-3 bg-red-50 dark:bg-red-900/20">
                          <CardTitle className="text-sm text-center">{formatName(incompatSign.name)}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 text-xs text-center">
                          {t('common.lowCompatibility')}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ZodiacDetailPage;
