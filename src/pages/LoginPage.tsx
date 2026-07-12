
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus, Lock } from "lucide-react";
import PageLayout from '@/components/PageLayout';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState<{
    login?: string;
    register?: string;
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/profile');
    return null;
  }

  const handleLoginChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [field]: event.target.value });
  };

  const handleRegisterChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [field]: event.target.value });
  };

  const validateLogin = () => {
    const newErrors: {login?: string; email?: string; password?: string} = {};
    
    if (!loginData.email) {
      newErrors.email = t('auth.requiredField');
    }
    
    if (!loginData.password) {
      newErrors.password = t('auth.requiredField');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors: {
      register?: string;
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};
    
    if (!registerData.name) {
      newErrors.name = t('auth.requiredField');
    }
    
    if (!registerData.email) {
      newErrors.email = t('auth.requiredField');
    }
    
    if (!registerData.password) {
      newErrors.password = t('auth.requiredField');
    } else if (registerData.password.length < 6) {
      newErrors.password = t('auth.passwordTooShort');
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsMustMatch');
    }
    
    if (!registerData.agreeToTerms) {
      newErrors.terms = t('auth.mustAgreeToTerms');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
      navigate('/profile');
    } catch (error) {
      setErrors({ login: t('auth.loginFailed') });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;
    
    setLoading(true);
    try {
      await register(registerData.name, registerData.email, registerData.password);
      navigate('/profile');
    } catch (error) {
      setErrors({ register: t('auth.signupFailed') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-12">
        <div className="max-w-md mx-auto">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t('auth.signIn')}</TabsTrigger>
              <TabsTrigger value="register">{t('auth.signUp')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    {t('auth.signIn')}
                  </CardTitle>
                  <CardDescription>
                    {t('auth.signInDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {errors.login && (
                    <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
                      {errors.login}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t('auth.email')}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="astro@example.com"
                      value={loginData.email}
                      onChange={handleLoginChange('email')}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">{t('auth.password')}</Label>
                      <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                        {t('auth.forgotPassword')}
                      </Link>
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange('password')}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={loginData.rememberMe}
                      onCheckedChange={(checked) =>
                        setLoginData({ ...loginData, rememberMe: checked as boolean })
                      }
                    />
                    <label
                      htmlFor="remember-me"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t('auth.rememberMe')}
                    </label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? t('common.loading') : t('auth.signIn')}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    {t('auth.signUp')}
                  </CardTitle>
                  <CardDescription>
                    {t('auth.signUpDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {errors.register && (
                    <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
                      {errors.register}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-name">{t('auth.name')}</Label>
                    <Input
                      id="register-name"
                      placeholder="Your Name"
                      value={registerData.name}
                      onChange={handleRegisterChange('name')}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">{t('auth.email')}</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="astro@example.com"
                      value={registerData.email}
                      onChange={handleRegisterChange('email')}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">{t('auth.password')}</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={handleRegisterChange('password')}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    <p className="text-xs text-muted-foreground">
                      {t('auth.passwordRequirements')}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">{t('auth.confirmPassword')}</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange('confirmPassword')}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agree-terms"
                      checked={registerData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        setRegisterData({ ...registerData, agreeToTerms: checked as boolean })
                      }
                    />
                    <label
                      htmlFor="agree-terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t('auth.agreeToTerms')}
                    </label>
                  </div>
                  {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleRegister}
                    disabled={loading}
                  >
                    {loading ? t('common.loading') : t('auth.createAccount')}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              {t('auth.protectedBy')} <Lock className="inline h-3 w-3" />
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
