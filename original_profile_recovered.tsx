
import { useState } from 'react';
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
import { User, Lock, Bell, Clock, Calendar } from "lucide-react";

const ProfilePage = () => {
  const { t } = useTranslation();
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

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

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
    } catch (error) {
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
      
      // Show success message (handled in updateUserProfile)
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">
              {t('profile.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('profile.subtitle')}
            </p>
          </div>

          <div className="flex items-center mb-8">
            <Avatar className="h-20 w-20 mr-4">
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="mt-2">
                <Badge variant="outline" className="mr-2 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-0">
                  {profileData.zodiacSign || t('common.unknownZodiac')}
                </Badge>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-0">
                  {user?.role}
                </Badge>
              </div>
            </div>
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-1 md:grid-cols-4 mb-6">
              <TabsTrigger value="personal">
                <User className="h-4 w-4 mr-2" />
                {t('profile.personalInfo')}
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

            <TabsContent value="personal">
              <Card>
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
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('profile.email')}</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email} 
                        onChange={handleProfileChange('email')} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('profile.phone')}</Label>
                      <Input 
                        id="phone" 
                        value={profileData.phone} 
                        onChange={handleProfileChange('phone')} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zodiacSign">{t('profile.zodiacSign')}</Label>
                      <Select 
                        value={profileData.zodiacSign} 
                        onValueChange={handleZodiacSignChange}
                      >
                        <SelectTrigger>
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
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('profile.birthDetails')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">{t('profile.birthDate')}</Label>
                        <Input 
                          id="birthDate" 
                          type="date" 
                          value={profileData.birthDate} 
                          onChange={handleProfileChange('birthDate')} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="birthTime">{t('profile.birthTime')}</Label>
                        <Input 
                          id="birthTime" 
                          type="time" 
                          value={profileData.birthTime} 
                          onChange={handleProfileChange('birthTime')} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="birthPlace">{t('profile.birthPlace')}</Label>
                        <Input 
                          id="birthPlace" 
                          value={profileData.birthPlace} 
                          onChange={handleProfileChange('birthPlace')} 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile} disabled={loading}>
                    {loading ? t('common.saving') : t('profile.saveChanges')}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.security')}</CardTitle>
                  <CardDescription>{t('profile.manageSecuritySettings')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('profile.passwordChange')}</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                        <Input 
                          id="currentPassword" 
                          type="password" 
                          value={passwords.currentPassword} 
                          onChange={handlePasswordChange('currentPassword')} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                        <Input 
                          id="newPassword" 
                          type="password" 
                          value={passwords.newPassword} 
                          onChange={handlePasswordChange('newPassword')} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t('profile.confirmPassword')}</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          value={passwords.confirmPassword} 
                          onChange={handlePasswordChange('confirmPassword')} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      onClick={handleChangePassword} 
                      disabled={loading || !passwords.currentPassword || !passwords.newPassword || passwords.newPassword !== passwords.confirmPassword}
                    >
                      {loading ? t('common.updating') : t('profile.changePassword')}
                    </Button>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('profile.accountActions')}</h3>
                    <div className="space-y-4">
                      <Button variant="outline" onClick={handleLogout}>
                        {t('common.logout')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.notifications')}</CardTitle>
                  <CardDescription>{t('profile.manageNotifications')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{t('profile.emailNotifications')}</h4>
                        <p className="text-sm text-muted-foreground">{t('profile.emailNotificationsDesc')}</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{t('profile.smsNotifications')}</h4>
                        <p className="text-sm text-muted-foreground">{t('profile.smsNotificationsDesc')}</p>
                      </div>
                      <Switch checked={false} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{t('profile.dailyHoroscope')}</h4>
                        <p className="text-sm text-muted-foreground">{t('profile.dailyHoroscopeDesc')}</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{t('profile.consultationReminders')}</h4>
                        <p className="text-sm text-muted-foreground">{t('profile.consultationRemindersDesc')}</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>{t('profile.saveNotificationSettings')}</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.consultationHistory')}</CardTitle>
                  <CardDescription>{t('profile.pastReadings')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">{t('profile.noConsultations')}</h3>
                    <p className="text-muted-foreground">{t('profile.consultationHistoryEmpty')}</p>
                    <Button className="mt-4" onClick={() => navigate('/video-chat')}>
                      {t('videoChat.bookConsultation')}
                    </Button>
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
  return (
    <div
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${checked ? 'bg-purple-600' : 'bg-input'}`}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`}
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
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
};
