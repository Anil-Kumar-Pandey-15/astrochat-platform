
import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodiacSigns } from '@/data/zodiacSigns';
import { Link } from 'react-router-dom';

const HoroscopePage = () => {
  const { t, language } = useTranslation();
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily');

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">
            {t('common.horoscope')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('common.dailyHoroscope')}
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setSelectedTimeframe('daily')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${selectedTimeframe === 'daily' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300'}`}
            >
              {t('bhavisyafal.dailyPrediction')}
            </button>
            <button
              onClick={() => setSelectedTimeframe('weekly')}
              className={`px-4 py-2 text-sm font-medium ${selectedTimeframe === 'weekly' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300'}`}
            >
              {t('bhavisyafal.weeklyPrediction')}
            </button>
            <button
              onClick={() => setSelectedTimeframe('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${selectedTimeframe === 'monthly' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300'}`}
            >
              {t('bhavisyafal.monthlyPrediction')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zodiacSigns.map((sign) => (
            <Link 
              to={`/horoscope/${sign.name.toLowerCase()}`} 
              key={sign.name}
              className="transform transition-transform hover:scale-105"
            >
              <Card className="h-full overflow-hidden border-2 hover:border-purple-400 transition-colors">
                <div className="absolute top-0 right-0 p-2 text-2xl">
                  {sign.symbol}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <span className="text-xl font-bold">
                      {language === 'en' ? sign.name : t(`zodiac.${sign.name.toLowerCase()}.name`)}
                    </span>
                    <span className="ml-auto text-sm text-muted-foreground">
                      {language === 'en' ? sign.dates : t(`zodiac.${sign.name.toLowerCase()}.dates`)}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {sign.element} • {sign.planet}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    {language === 'en' 
                      ? sign.description.substring(0, 100) + '...'
                      : t(`zodiac.${sign.name.toLowerCase()}.description`).substring(0, 100) + '...'}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {sign.traits.slice(0, 3).map((trait, index) => (
                      <span 
                        key={index}
                        className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                      >
                        {language === 'en' ? trait : t(`zodiac.${sign.name.toLowerCase()}.traits[${index}]`)}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default HoroscopePage;
