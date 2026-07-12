
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ui/theme-provider";
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Globe, 
  User, 
  LogOut, 
  Bell, 
  Bookmark, 
  Mail, 
  Youtube,
  Home,
  HelpCircle,
  Settings
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { t, language, setLanguage } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', label: t('common.home'), icon: <Home className="h-4 w-4 mr-2" /> },
    { path: '/horoscope', label: t('common.horoscope'), icon: null },
    { path: '/compatibility', label: t('common.compatibility'), icon: null },
    { path: '/panchang', label: t('common.panchang'), icon: null },
    { path: '/bhavisyafal', label: t('common.bhavisyafal'), icon: null },
    { path: '/kundali', label: ['hi', 'mr', 'ta', 'te', 'gu', 'bn', 'kn'].includes(language) ? 'जन्म कुंडली' : 'Janam Kundali', icon: null },
    { path: '/readings', label: ['hi', 'mr', 'ta', 'te', 'gu', 'bn', 'kn'].includes(language) ? 'एआई पठन' : 'AI Readings', icon: null },
    { path: '/video-chat', label: t('common.videoChat'), icon: null },
    { path: '/chatbot', label: t('common.chatbot'), icon: null },
    { path: '/youtube', label: t('common.youtube'), icon: <Youtube className="h-4 w-4 mr-2" /> },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिन्दी' },
    { value: 'mr', label: 'मराठी' },
    { value: 'ta', label: 'தமிழ்' },
    { value: 'te', label: 'తెలుగు' },
    { value: 'gu', label: 'ગુજરાતી' },
    { value: 'bn', label: 'বাংলা' },
    { value: 'kn', label: 'ಕನ್ನಡ' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'ta' | 'te' | 'mr' | 'gu' | 'bn' | 'kn') => {
    setLanguage(newLanguage);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center mr-6">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">
            AstroChat
          </span>
        </Link>

        {/* Mobile menu button */}
        {isMobile && (
          <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}

        {/* Desktop navigation */}
        {!isMobile && (
          <nav className="flex-1 ml-6 hidden md:flex">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`text-sm transition-colors hover:text-primary flex items-center ${
                      location.pathname === item.path ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Desktop right side */}
        {!isMobile && (
          <div className="flex items-center space-x-2 ml-auto">
            {/* Bookmarks */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Bookmarks">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('common.bookmarks')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {t('common.noBookmarks')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center" variant="destructive">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('common.notifications')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {t('common.newFeatures')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {t('common.dailyHoroscope')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {t('common.accountUpdate')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Contact */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Contact">
                  <Mail className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('common.contactUs')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/contact" className="flex w-full">
                    {t('common.sendMessage')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a href="mailto:support@astrochat.com" className="flex w-full">
                    {t('common.email')}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a href="tel:+1234567890" className="flex w-full">
                    {t('common.phone')}
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Language">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('common.switchLanguage')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languageOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleLanguageChange(option.value as 'en' | 'hi' | 'ta' | 'te' | 'mr' | 'gu' | 'bn' | 'kn')}
                    className={`${language === option.value ? 'bg-muted' : ''}`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">{t('common.profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      {t('common.settings')}
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">{t('common.admin')}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('common.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/login">{t('common.signIn')}</Link>
              </Button>
            )}
          </div>
        )}

        {/* Mobile navigation */}
        {isMobile && isMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 bg-background flex flex-col">
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`block py-2 text-base transition-colors hover:text-primary flex items-center ${
                        location.pathname === item.path ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 space-y-4">
                <div className="text-sm font-medium text-muted-foreground">{t('common.quickLinks')}</div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="justify-start">
                    <Bookmark className="h-4 w-4 mr-2" />
                    {t('common.bookmarks')}
                  </Button>
                  
                  <Button variant="outline" size="sm" className="justify-start relative">
                    <Bell className="h-4 w-4 mr-2" />
                    {t('common.notifications')}
                    {unreadNotifications > 0 && (
                      <Badge className="absolute top-0 right-1 w-4 h-4 p-0 flex items-center justify-center" variant="destructive">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                  
                  <Button variant="outline" size="sm" className="justify-start" asChild>
                    <Link to="/contact">
                      <Mail className="h-4 w-4 mr-2" />
                      {t('common.contactUs')}
                    </Link>
                  </Button>
                  
                  <Button variant="outline" size="sm" className="justify-start" asChild>
                    <Link to="/help">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      {t('common.help')}
                    </Link>
                  </Button>
                </div>
              </div>
            </nav>

            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm">{t('common.switchLanguage')}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {languageOptions.find(opt => opt.value === language)?.label}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {languageOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleLanguageChange(option.value as 'en' | 'hi' | 'ta' | 'te' | 'mr' | 'gu' | 'bn' | 'kn')}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm">{t(theme === 'dark' ? 'common.lightMode' : 'common.darkMode')}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  {theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
                </Button>
              </div>

              {isAuthenticated ? (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      {t('common.profile')}
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                      <Settings className="mr-2 h-4 w-4" />
                      {t('common.settings')}
                    </Link>
                  </Button>
                  {user?.role === 'admin' && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        {t('common.admin')}
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('common.logout')}
                  </Button>
                </div>
              ) : (
                <Button className="w-full" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    {t('common.signIn')}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
