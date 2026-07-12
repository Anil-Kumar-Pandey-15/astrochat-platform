
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZodiacSignData } from '../data/zodiacSigns';

interface ZodiacSignProps {
  sign: ZodiacSignData;
}

const ZodiacSign = ({ sign }: ZodiacSignProps) => {
  const { t, language } = useTranslation();
  
  // Get localized zodiac sign name and description
  const localizedName = language === 'en' 
    ? sign.name 
    : t(`zodiac.${sign.name.toLowerCase()}.name`);
  
  const localizedDescription = language === 'en' 
    ? sign.description 
    : t(`zodiac.${sign.name.toLowerCase()}.description`);
  
  const localizedDates = language === 'en' 
    ? sign.dates 
    : t(`zodiac.${sign.name.toLowerCase()}.dates`);
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700">
      <CardHeader className={`bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 pb-3`}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <span className="text-2xl mr-2">{sign.symbol}</span>
            <span>{localizedName}</span>
          </CardTitle>
          <div className="text-xs px-2 py-1 rounded-full bg-white/50 dark:bg-white/10 text-black/70 dark:text-white/70">
            {localizedDates}
          </div>
        </div>
        <CardDescription className="text-black/70 dark:text-white/70">
          {sign.element} • {sign.planet}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">{t('zodiac.traits')}</h4>
          <div className="flex flex-wrap gap-1">
            {sign.traits.map((trait, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-100"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {localizedDescription}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="ghost" className="text-sm w-full">
          <Link to={`/horoscope/${sign.name.toLowerCase()}`}>
            {t('common.viewDetails')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ZodiacSign;
