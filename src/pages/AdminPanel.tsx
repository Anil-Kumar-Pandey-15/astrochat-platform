import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Activity, 
  CreditCard, 
  Settings, 
  BarChart, 
  Search, 
  Plus, 
  Edit, 
  Trash,
  UserCog,
  FileText,
  Calendar
} from "lucide-react";
import PageLayout from '@/components/PageLayout';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  // Mock statistics data
  const statsData = {
    totalUsers: 1245,
    activeUsers: 782,
    totalAstrologers: 38,
    onlineAstrologers: 12,
    totalConsultations: 5468,
    pendingConsultations: 23,
    totalRevenue: "$24,580"
  };

  // Mock users data
  const usersData = [
    { id: 1, name: "John Doe", email: "john@example.com", zodiacSign: "Aries", registeredDate: "2023-04-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", zodiacSign: "Taurus", registeredDate: "2023-05-20" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", zodiacSign: "Gemini", registeredDate: "2023-06-10" },
  ];

  // Mock astrologers data
  const astrologersData = [
    { id: 1, name: "Astrologer 1", speciality: "Vedic Astrology", experience: "10 years", rating: 4.8 },
    { id: 2, name: "Astrologer 2", speciality: "Western Astrology", experience: "8 years", rating: 4.5 },
    { id: 3, name: "Astrologer 3", speciality: "Numerology", experience: "12 years", rating: 4.9 },
  ];

  // Mock consultations data
  const consultationsData = [
    { id: 1, user: "John Doe", astrologer: "Astrologer 1", date: "2023-07-15", duration: "30 mins", status: "Completed" },
    { id: 2, user: "Jane Smith", astrologer: "Astrologer 2", date: "2023-07-16", duration: "45 mins", status: "Pending" },
    { id: 3, user: "Bob Johnson", astrologer: "Astrologer 3", date: "2023-07-17", duration: "60 mins", status: "Cancelled" },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">
          {t('admin.title')}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t('admin.dashboard')}</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Button 
                    variant={activeTab === 'dashboard' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    {t('admin.dashboard')}
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'users' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('users')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {t('admin.users')}
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'astrologers' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('astrologers')}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    {t('admin.astrologers')}
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'consultations' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('consultations')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {t('admin.consultations')}
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'payments' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('payments')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t('admin.payments')}
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'content' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('content')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {t('admin.manageContent')}
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'analytics' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('analytics')}
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    {t('admin.analytics')}
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'settings' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    {t('admin.settings')}
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.dashboard')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">{t('admin.totalUsers')}</p>
                      <p className="text-2xl font-bold">{statsData.totalUsers}</p>
                    </div>
                    
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">{t('admin.activeUsers')}</p>
                      <p className="text-2xl font-bold">{statsData.activeUsers}</p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">{t('admin.totalConsultations')}</p>
                      <p className="text-2xl font-bold">{statsData.totalConsultations}</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">{t('admin.totalRevenue')}</p>
                      <p className="text-2xl font-bold">{statsData.totalRevenue}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t('admin.totalAstrologers')}: {statsData.totalAstrologers}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{t('admin.onlineAstrologers')}: {statsData.onlineAstrologers}</p>
                      
                      <h3 className="text-lg font-semibold mb-2">{t('admin.pendingConsultations')}</h3>
                      <div className="space-y-4">
                        {consultationsData
                          .filter(c => c.status === 'Pending')
                          .map(consultation => (
                            <div key={consultation.id} className="border p-3 rounded-md">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium">{consultation.user} ↔ {consultation.astrologer}</p>
                                  <p className="text-sm text-muted-foreground">{consultation.date} • {consultation.duration}</p>
                                </div>
                                <Button size="sm">{t('common.viewDetails')}</Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                      <ul className="space-y-2">
                        <li className="text-sm p-2 bg-muted/50 rounded">
                          New user registered: Jane Smith
                          <span className="block text-xs text-muted-foreground">10 minutes ago</span>
                        </li>
                        <li className="text-sm p-2 bg-muted/50 rounded">
                          Consultation completed: Bob Johnson with Astrologer 1
                          <span className="block text-xs text-muted-foreground">25 minutes ago</span>
                        </li>
                        <li className="text-sm p-2 bg-muted/50 rounded">
                          Payment received: $45.00 from John Doe
                          <span className="block text-xs text-muted-foreground">1 hour ago</span>
                        </li>
                        <li className="text-sm p-2 bg-muted/50 rounded">
                          New consultation booked: Alice Wang with Astrologer 2
                          <span className="block text-xs text-muted-foreground">2 hours ago</span>
                        </li>
                        <li className="text-sm p-2 bg-muted/50 rounded">
                          Content updated: Daily Horoscopes
                          <span className="block text-xs text-muted-foreground">3 hours ago</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Users Management */}
            {activeTab === 'users' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t('admin.users')}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="search" 
                        placeholder="Search users..." 
                        className="pl-8 w-[200px]" 
                      />
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      {t('admin.addUser')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-3 bg-muted/50 font-medium">
                      <div>ID</div>
                      <div>Name</div>
                      <div>Email</div>
                      <div>Zodiac Sign</div>
                      <div>Actions</div>
                    </div>
                    {usersData.map(user => (
                      <div key={user.id} className="grid grid-cols-5 p-3 border-t">
                        <div>{user.id}</div>
                        <div>{user.name}</div>
                        <div>{user.email}</div>
                        <div>{user.zodiacSign}</div>
                        <div className="flex space-x-2">
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Astrologers Management */}
            {activeTab === 'astrologers' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t('admin.astrologers')}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="search" 
                        placeholder="Search astrologers..." 
                        className="pl-8 w-[200px]" 
                      />
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      {t('admin.addAstrologer')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-3 bg-muted/50 font-medium">
                      <div>ID</div>
                      <div>Name</div>
                      <div>Speciality</div>
                      <div>Experience</div>
                      <div>Actions</div>
                    </div>
                    {astrologersData.map(astrologer => (
                      <div key={astrologer.id} className="grid grid-cols-5 p-3 border-t">
                        <div>{astrologer.id}</div>
                        <div>{astrologer.name}</div>
                        <div>{astrologer.speciality}</div>
                        <div>{astrologer.experience}</div>
                        <div className="flex space-x-2">
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Content Management */}
            {activeTab === 'content' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.manageContent')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="horoscopes">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="horoscopes">{t('common.horoscope')}</TabsTrigger>
                      <TabsTrigger value="panchang">{t('common.panchang')}</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="horoscopes" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="zodiacSign">Zodiac Sign</Label>
                        <select id="zodiacSign" className="w-full p-2 border rounded-md">
                          <option value="aries">Aries</option>
                          <option value="taurus">Taurus</option>
                          <option value="gemini">Gemini</option>
                          <option value="cancer">Cancer</option>
                          <option value="leo">Leo</option>
                          <option value="virgo">Virgo</option>
                          <option value="libra">Libra</option>
                          <option value="scorpio">Scorpio</option>
                          <option value="sagittarius">Sagittarius</option>
                          <option value="capricorn">Capricorn</option>
                          <option value="aquarius">Aquarius</option>
                          <option value="pisces">Pisces</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="horoscopeType">Horoscope Type</Label>
                        <select id="horoscopeType" className="w-full p-2 border rounded-md">
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label htmlFor="horoscopeContent">Content</Label>
                        <Textarea 
                          id="horoscopeContent" 
                          rows={5} 
                          placeholder="Enter horoscope content..."
                        />
                      </div>
                      
                      <Button>{t('admin.updateHoroscopes')}</Button>
                    </TabsContent>
                    
                    <TabsContent value="panchang" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="panchangDate">Date</Label>
                        <Input id="panchangDate" type="date" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tithi">Tithi</Label>
                          <Input id="tithi" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="nakshatra">Nakshatra</Label>
                          <Input id="nakshatra" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="yoga">Yoga</Label>
                          <Input id="yoga" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="karana">Karana</Label>
                          <Input id="karana" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sunrise">Sunrise</Label>
                          <Input id="sunrise" type="time" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="sunset">Sunset</Label>
                          <Input id="sunset" type="time" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="auspiciousTime">Auspicious Time</Label>
                        <Textarea 
                          id="auspiciousTime" 
                          rows={2} 
                          placeholder="Enter auspicious times..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="inauspiciousTime">Inauspicious Time</Label>
                        <Textarea 
                          id="inauspiciousTime" 
                          rows={2} 
                          placeholder="Enter inauspicious times..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="festivals">Festivals</Label>
                        <Textarea 
                          id="festivals" 
                          rows={2} 
                          placeholder="Enter festivals..."
                        />
                      </div>
                      
                      <Button>{t('admin.updatePanchang')}</Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
            
            {/* Other tabs can be added as needed */}
            {activeTab === 'consultations' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.consultations')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 p-3 bg-muted/50 font-medium">
                      <div>ID</div>
                      <div>User</div>
                      <div>Astrologer</div>
                      <div>Date</div>
                      <div>Duration</div>
                      <div>Status</div>
                    </div>
                    {consultationsData.map(consultation => (
                      <div key={consultation.id} className="grid grid-cols-6 p-3 border-t">
                        <div>{consultation.id}</div>
                        <div>{consultation.user}</div>
                        <div>{consultation.astrologer}</div>
                        <div>{consultation.date}</div>
                        <div>{consultation.duration}</div>
                        <div>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              consultation.status === 'Completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : consultation.status === 'Pending' 
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                          >
                            {consultation.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.settings')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">General Settings</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input id="siteName" defaultValue="AstroChat" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="siteEmail">Site Email</Label>
                            <Input id="siteEmail" defaultValue="contact@astrochat.com" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="siteDescription">Site Description</Label>
                          <Textarea 
                            id="siteDescription" 
                            rows={3} 
                            defaultValue="AstroChat - Your premier destination for astrology consultations and daily horoscopes." 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Payment Settings</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <select id="currency" className="w-full p-2 border rounded-md">
                              <option value="USD">USD ($)</option>
                              <option value="EUR">EUR (€)</option>
                              <option value="GBP">GBP (£)</option>
                              <option value="INR">INR (₹)</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="defaultRate">Default Per-Minute Rate</Label>
                            <Input id="defaultRate" type="number" defaultValue="2.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Email Settings</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="smtpServer">SMTP Server</Label>
                            <Input id="smtpServer" defaultValue="smtp.example.com" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="smtpPort">SMTP Port</Label>
                            <Input id="smtpPort" defaultValue="587" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="smtpUser">SMTP Username</Label>
                            <Input id="smtpUser" defaultValue="user@example.com" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="smtpPassword">SMTP Password</Label>
                            <Input id="smtpPassword" type="password" defaultValue="password" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4 mt-6">
                      <Button variant="outline">Reset</Button>
                      <Button>Save Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminPanel;
