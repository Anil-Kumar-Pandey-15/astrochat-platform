
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Facebook, Twitter, Instagram, Phone, Mail, MapPin, Heart 
} from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">AstroChat</h3>
            <p className="text-slate-400">
              Pandit Jyotishacharya Anil Kumar Pandey<br />
              Vedic Astrology & Vastu Consultant
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-slate-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-slate-400 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{t('footer.contactUs')}</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-purple-400" />
                <span>7294110236, 7991131115</span>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 text-purple-400" />
                <span>anilpandey15b@gmail.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-purple-400" />
                <span>Patna, Bihar</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{t('common.ourServices')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/horoscope" className="text-slate-400 hover:text-white transition-colors">
                  {t('common.horoscope')}
                </Link>
              </li>
              <li>
                <Link to="/compatibility" className="text-slate-400 hover:text-white transition-colors">
                  {t('common.compatibility')}
                </Link>
              </li>
              <li>
                <Link to="/panchang" className="text-slate-400 hover:text-white transition-colors">
                  {t('common.panchang')}
                </Link>
              </li>
              <li>
                <Link to="/bhavisyafal" className="text-slate-400 hover:text-white transition-colors">
                  {t('common.bhavisyafal')}
                </Link>
              </li>
              <li>
                <Link to="/video-chat" className="text-slate-400 hover:text-white transition-colors">
                  {t('common.videoChat')}
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-slate-400 hover:text-white transition-colors">
                  {t('common.chatbot')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{t('common.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-slate-400 hover:text-white transition-colors">
                  {t('footer.termsOfService')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-400 hover:text-white transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-400 hover:text-white transition-colors">
                  {t('footer.blog')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
          <p>© {currentYear} AstroChat - Pandit Jyotishacharya Anil Kumar Pandey. {t('footer.allRightsReserved')}</p>
          <p className="mt-2 flex items-center justify-center">
            {t('common.madeWith')} <Heart className="h-4 w-4 mx-1 text-red-500 inline" /> {t('common.inIndia')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
