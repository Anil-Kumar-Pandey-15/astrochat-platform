import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodiacSigns } from '@/data/zodiacSigns';
import { Separator } from "@/components/ui/separator";
import { User, Lock, Bell, Clock, Calendar, Trash2, Award } from "lucide-react";
import { toast } from 'sonner';

export const ProfilePage = () => {
  const { t, language } = useTranslation();
  const { user, isAuthenticated, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
    birthTime: user?.birthTime || '',
    birthPlace: user?.birthPlace || '',
    zodiacSign: user?.zodiacSign || ''
  });
  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [savedCharts, setSavedCharts] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    // Load saved Kundalis
    const saved = JSON.parse(localStorage.getItem('saved_kundalis') || '[]');
    setSavedCharts(saved);
  }, [isAuthenticated, navigate]);

  const handleProfileChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [field]: event.target.value });
  };

  const handlePasswordChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [field]: event.target.value });
  };

  const handleZodiacSignChange = (value: string) => {
    setProfileData({ ...profileData, zodiacSign: value });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateUserProfile(profileData);
      toast.success(language === 'en' ? "Profile updated successfully!" : "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई है!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast.success(language === 'en' ? "Password changed successfully!" : "पासवर्ड सफलतापूर्वक बदल गया है!");
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveChart = (id: number) => {
    const updated = savedCharts.filter(c => c.id !== id);
    setSavedCharts(updated);
    localStorage.setItem('saved_kundalis', JSON.stringify(updated));
    toast.success(language === 'en' ? "Kundali removed" : "कुंडली हटा दी गई है");
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mock booking invoices history
  const mockBookings = [
    { id: "TXN-9024", name: "Jyotishacharya Anand", type: "Video Call", date: "2026-07-15", time: "10:30 AM", status: "Upcoming", price: 225 },
    { id: "TXN-4310", name: "Pandit Shastri", type: "Chat", date: "2026-07-02", time: "04:00 PM", status: "Completed", price: 180 }
  ];

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">
              {t('profile.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('profile.subtitle')}
            </p>
          </div>

          <div className="flex items-center mb-8 bg-purple-950/10 p-5 rounded-xl border border-purple-900/20">
            <Avatar className="h-20 w-20 mr-4 border-2 border-purple-500">
              <AvatarFallback className="bg-purple-900 text-purple-300 font-bold text-lg">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">{user?.name}</h2>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              <div className="mt-2 flex gap-2">
                <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-0">
                  {profileData.zodiacSign || t('common.unknownZodiac')}
                </Badge>
                <Badge variant="outline" className="bg-indigo-900/30 text-indigo-300 border-0">
                  {user?.role}
                </Badge>
              </div>
            </div>
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6 bg-purple-950/20 text-slate-300 border border-purple-900/25">
              <TabsTrigger value="personal">
                <User className="h-4 w-4 mr-2" />
                {t('profile.personalInfo')}
              </TabsTrigger>
              <TabsTrigger value="charts">
                <Award className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Saved Charts' : 'सहेजी कुंडलियां'}
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="h-4 w-4 mr-2" />
                {t('profile.security')}
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                {t('profile.notifications')}
              </TabsTrigger>
              <TabsTrigger value="history">
                <Clock className="h-4 w-4 mr-2" />
                {t('profile.consultationHistory')}
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Personal Info */}
            <TabsContent value="personal">
              <Card className="bg-purple-950/5 border-purple-900/20">
                <CardHeader>
                  <CardTitle>{t('profile.personalInfo')}</CardTitle>
                  <CardDescription>{t('profile.updateYourInfo')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('profile.name')}</Label>
                      <Input 
                        id="name" 
                        value={profileData.name} 
                        onChange={handleProfileChange('name')} 
                        className="bg-black/35 border-purple-900/40"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('profile.email')}</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email} 
                        onChange={handleProfileChange('email')} 
                        className="bg-black/35 border-purple-900/40"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('profile.phone')}</Label>
                      <Input 
                        id="phone" 
                        value={profileData.phone} 
                        onChange={handleProfileChange('phone')} 
                        className="bg-black/35 border-purple-900/40"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zodiacSign">{t('profile.zodiacSign')}</Label>
                      <Select 
                        value={profileData.zodiacSign} 
                        onValueChange={handleZodiacSignChange}
                      >
                        <SelectTrigger className="bg-black/35 border-purple-900/40">
                          <SelectValue placeholder={t('common.selectZodiac')} />
                        </SelectTrigger>
                        <SelectContent>
                          {zodiacSigns.map((sign) => (
                            <SelectItem key={sign.name} value={sign.name}>
                              {sign.symbol} {sign.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator className="bg-purple-900/20" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-purple-300">{t('profile.birthDetails')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">{t('profile.birthDate')}</Label>
                        <Input 
                          id="birthDate" 
                          type="date" 
                          value={profileData.birthDate} 
                          onChange={handleProfileChange('birthDate')} 
                          className="bg-black/35 border-purple-900/40"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="birthTime">{t('profile.birthTime')}</Label>
                        <Input 
                          id="birthTime" 
                          type="time" 
                          value={profileData.birthTime} 
                          onChange={handleProfileChange('birthTime')} 
                          className="bg-black/35 border-purple-900/40"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="birthPlace">{t('profile.birthPlace')}</Label>
                        <Input 
                          id="birthPlace" 
                          value={profileData.birthPlace} 
                          onChange={handleProfileChange('birthPlace')} 
                          className="bg-black/35 border-purple-900/40"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                    {loading ? t('common.saving') : t('profile.saveChanges')}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Tab 2: Saved Charts */}
            <TabsContent value="charts">
              <Card className="bg-purple-950/5 border-purple-900/20">
                <CardHeader>
                  <CardTitle>{language === 'en' ? 'Saved Birth Charts' : 'सहेजी हुई जन्म कुंडलियां'}</CardTitle>
                  <CardDescription>
                    {language === 'en' ? 'Review or delete your previously generated Janam Kundali reports' : 'पूर्व में तैयार की गई अपनी जन्म कुंडलियां यहां देखें अथवा हटाएं'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedCharts.length === 0 ? (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 mx-auto mb-4 text-purple-800/40" />
                      <h4 className="text-slate-300 font-semibold">{language === 'en' ? 'No saved charts yet' : 'कोई सहेजी हुई कुंडली नहीं है'}</h4>
                      <p className="text-xs text-muted-foreground mt-1 mb-4">{language === 'en' ? 'Go to Janam Kundali tab to generate one.' : 'कुंडली सहेजने के लिए जन्म कुंडली टैब पर जाएं।'}</p>
                      <Button onClick={() => navigate('/kundali')} size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs">
                        {language === 'en' ? 'Create Kundali' : 'कुंडली बनाएं'}
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {savedCharts.map((c) => (
                        <Card key={c.id} className="bg-purple-950/15 border-purple-900/30">
                          <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
                            <div>
                              <CardTitle className="text-purple-300 text-sm">{c.name}</CardTitle>
                              <CardDescription className="text-[10px] mt-0.5">
                                {c.birthDate} | {c.birthTime}
                              </CardDescription>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveChart(c.id)} 
                              className="h-7 w-7 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 text-[11px] text-slate-400">
                            <span>{language === 'en' ? 'Place' : 'स्थान'}: {c.birthPlace}</span>
                            <span className="block mt-1">{language === 'en' ? 'Lagna' : 'लग्न'}: {c.data?.planets?.[0]?.sign || 'Aries'}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Security */}
            <TabsContent value="security">
              <Card className="bg-purple-950/5 border-purple-900/20">
                <CardHeader>
                  <CardTitle>{t('profile.security')}</CardTitle>
                  <CardDescription>{t('profile.manageSecuritySettings')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-purple-300">{t('profile.passwordChange')}</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                        <Input 
                          id="currentPassword" 
                          type="password" 
                          value={passwords.currentPassword} 
                          onChange={handlePasswordChange('currentPassword')} 
                          className="bg-black/35 border-purple-900/40"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                        <Input 
                          id="newPassword" 
                          type="password" 
                          value={passwords.newPassword} 
                          onChange={handlePasswordChange('newPassword')} 
                          className="bg-black/35 border-purple-900/40"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t('profile.confirmPassword')}</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          value={passwords.confirmPassword} 
                          onChange={handlePasswordChange('confirmPassword')} 
                          className="bg-black/35 border-purple-900/40"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      onClick={handleChangePassword} 
                      disabled={loading || !passwords.currentPassword || !passwords.newPassword || passwords.newPassword !== passwords.confirmPassword}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {loading ? t('common.updating') : t('profile.changePassword')}
                    </Button>
                  </div>
                  
                  <Separator className="my-6 bg-purple-900/20" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-purple-300">{t('profile.accountActions')}</h3>
                    <div className="space-y-4">
                      <Button variant="outline" onClick={handleLogout} className="border-purple-800/40 text-purple-300">
                        {t('common.logout')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: Notifications */}
            <TabsContent value="notifications">
              <Card className="bg-purple-950/5 border-purple-900/20">
                <CardHeader>
                  <CardTitle>{t('profile.notifications')}</CardTitle>
                  <CardDescription>{t('profile.manageNotifications')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-200">{t('profile.emailNotifications')}</h4>
                        <p className="text-xs text-muted-foreground">{t('profile.emailNotificationsDesc')}</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <Separator className="bg-purple-900/10" />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-200">{t('profile.smsNotifications')}</h4>
                        <p className="text-xs text-muted-foreground">{t('profile.smsNotificationsDesc')}</p>
                      </div>
                      <Switch checked={false} />
                    </div>
                    
                    <Separator className="bg-purple-900/10" />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-200">{t('profile.dailyHoroscope')}</h4>
                        <p className="text-xs text-muted-foreground">{t('profile.dailyHoroscopeDesc')}</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <Separator className="bg-purple-900/10" />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-200">{t('profile.consultationReminders')}</h4>
                        <p className="text-xs text-muted-foreground">{t('profile.consultationRemindersDesc')}</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-purple-600 hover:bg-purple-700">{t('profile.saveNotificationSettings')}</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Tab 5: Consultation History */}
            <TabsContent value="history">
              <Card className="bg-purple-950/5 border-purple-900/20">
                <CardHeader>
                  <CardTitle>{t('profile.consultationHistory')}</CardTitle>
                  <CardDescription>{t('profile.pastReadings')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto border border-purple-900/20 rounded">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-purple-900/10 text-purple-200">
                        <tr>
                          <th className="p-3">आईडी / Transaction ID</th>
                          <th className="p-3">ज्योतिषी / Consultant</th>
                          <th className="p-3">प्रकार / Type</th>
                          <th className="p-3">तारीख / Date</th>
                          <th className="p-3">शुल्क / Fees</th>
                          <th className="p-3">स्थिति / Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-900/10">
                        {mockBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-purple-900/5">
                            <td className="p-3 font-mono text-purple-400 font-semibold">{b.id}</td>
                            <td className="p-3 font-medium text-slate-300">{b.name}</td>
                            <td className="p-3 text-slate-400">{b.type}</td>
                            <td className="p-3 text-slate-400">{b.date} ({b.time})</td>
                            <td className="p-3 font-bold text-slate-200">₹{b.price}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${
                                b.status === 'Completed' 
                                  ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' 
                                  : 'bg-blue-950/20 text-blue-400 border border-blue-900/30'
                              }`}>
                                {b.status}
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
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;

// Import the Switch component from shadcn/ui
const Switch = ({ checked }: { checked: boolean }) => {
  const [isChecked, setIsChecked] = useState(checked);
  return (
    <div
      onClick={() => setIsChecked(!isChecked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isChecked ? 'bg-purple-600' : 'bg-input'}`}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${isChecked ? 'translate-x-5' : 'translate-x-1'}`}
      />
    </div>
  );
};

// Badge component
const Badge = ({ 
  children, 
  variant = "default", 
  className = "" 
}: { 
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border border-purple-900/30 ${className}`}>
      {children}
    </span>
  );
};
