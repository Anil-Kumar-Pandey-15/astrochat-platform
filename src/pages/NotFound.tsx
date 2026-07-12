
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from "@/components/ui/button";
import PageLayout from '@/components/PageLayout';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <div className="container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
        <h1 className="text-9xl font-bold text-purple-600">404</h1>
        <div className="mt-4 mb-8">
          <h2 className="text-2xl font-semibold mb-2">{t('error.pageNotFound')}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t('error.pageNotFoundDesc')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link to="/">{t('common.home')}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/horoscope">{t('common.horoscope')}</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
