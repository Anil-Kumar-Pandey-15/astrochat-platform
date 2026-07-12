
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Calendar, 
  Heart, 
  Sparkles, 
  Clock, 
  MessageCircle, 
  Video,
  Youtube,
  Award
} from "lucide-react";

const Index = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();

  const isHindi = ['hi', 'mr', 'ta', 'te', 'gu', 'bn', 'kn'].includes(language);

  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-purple-500" />,
      title: t('home.features.horoscope.title'),
      description: t('home.features.horoscope.description'),
      path: '/horoscope'
    },
    {
      icon: <Heart className="h-10 w-10 text-rose-500" />,
      title: t('home.features.compatibility.title'),
      description: t('home.features.compatibility.description'),
      path: '/compatibility'
    },
    {
      icon: <Clock className="h-10 w-10 text-amber-500" />,
      title: t('home.features.panchang.title'),
      description: t('home.features.panchang.description'),
      path: '/panchang'
    },
    {
      icon: <Sparkles className="h-10 w-10 text-blue-500" />,
      title: t('home.features.bhavisyafal.title'),
      description: t('home.features.bhavisyafal.description'),
      path: '/bhavisyafal'
    },
    {
      icon: <Award className="h-10 w-10 text-violet-400" />,
      title: isHindi ? "जन्म कुंडली (Janam Kundali)" : "Janam Kundali (Birth Chart)",
      description: isHindi ? "सटीक ग्रह स्पष्ट, ३० महामुहूर्त और महादशा चक्र" : "Get highly precise planetary placements, charts, and Dasha details",
      path: '/kundali'
    },
    {
      icon: <Sparkles className="h-10 w-10 text-yellow-500" />,
      title: isHindi ? "एआई पठन (Tarot, Palm, Face)" : "AI Readings (Tarot, Palm, Face)",
      description: isHindi ? "इंटरैक्टिव स्कैनिंग से हस्तरेखा, चेहरा और टैरो फल देखें" : "Explore interactive scanning and visual canvas overlays for Tarot, Palm & Face",
      path: '/readings'
    },
    {
      icon: <Video className="h-10 w-10 text-green-500" />,
      title: t('home.features.videoChat.title'),
      description: t('home.features.videoChat.description'),
      path: '/video-chat'
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-indigo-500" />,
      title: t('home.features.chatbot.title'),
      description: t('home.features.chatbot.description'),
      path: '/chatbot'
    },
    {
      icon: <Youtube className="h-10 w-10 text-red-500" />,
      title: t('home.features.youtube.title'),
      description: t('home.features.youtube.description'),
      path: '/youtube'
    }
  ];

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400 animate-pulse-glow"
            >
              {t('home.hero.title')}
            </h1>
            <p 
              className="text-xl md:text-2xl text-muted-foreground mb-8"
            >
              {t('home.hero.subtitle')}
            </p>
            <div>
              <Button size="lg" className="rounded-full px-8" onClick={() => navigate('/horoscope')}>
                {t('home.hero.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('home.features.title')}</h2>
            <p className="text-xl text-muted-foreground">{t('home.features.subtitle')}</p>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleFeatureClick(feature.path)}
              >
                <div className="p-6">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('common.testimonials')}</h2>
            <p className="text-xl text-muted-foreground">{t('common.testimonialSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                  RS
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Rahul Sharma</h4>
                  <p className="text-sm text-muted-foreground">Delhi</p>
                </div>
              </div>
              <p className="text-muted-foreground">{t('common.testimonial1')}</p>
              <div className="flex text-yellow-400 mt-4">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                  SP
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sunita Patel</h4>
                  <p className="text-sm text-muted-foreground">Mumbai</p>
                </div>
              </div>
              <p className="text-muted-foreground">{t('common.testimonial2')}</p>
              <div className="flex text-yellow-400 mt-4">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                  AK
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Amit Kumar</h4>
                  <p className="text-sm text-muted-foreground">Bangalore</p>
                </div>
              </div>
              <p className="text-muted-foreground">{t('common.testimonial3')}</p>
              <div className="flex text-yellow-400 mt-4">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('common.ctaTitle')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">{t('common.ctaSubtitle')}</p>
          <Button size="lg" variant="secondary" className="rounded-full px-8" onClick={() => navigate('/horoscope')}>
            {t('common.getHoroscope')}
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
