
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HoroscopePage from "./pages/HoroscopePage";
import ZodiacDetailPage from "./pages/ZodiacDetailPage";
import CompatibilityPage from "./pages/CompatibilityPage";
import PanchangPage from "./pages/PanchangPage";
import BhavisyafalPage from "./pages/BhavisyafalPage";
import VideoChatPage from "./pages/VideoChatPage";
import ChatbotPage from "./pages/ChatbotPage";
import YoutubePage from "./pages/YoutubePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import AdminPanel from "./pages/AdminPanel";
import KundaliPage from "./pages/KundaliPage";
import ReadingsPage from "./pages/ReadingsPage";
import { TranslationProvider } from "./hooks/useTranslation";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./components/ui/theme-provider";
import StarBackground from "./components/StarBackground";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <TranslationProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <StarBackground />
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/horoscope" element={<HoroscopePage />} />
                <Route path="/horoscope/:sign" element={<ZodiacDetailPage />} />
                <Route path="/compatibility" element={<CompatibilityPage />} />
                <Route path="/panchang" element={<PanchangPage />} />
                <Route path="/bhavisyafal" element={<BhavisyafalPage />} />
                <Route path="/kundali" element={<KundaliPage />} />
                <Route path="/readings" element={<ReadingsPage />} />
                <Route path="/video-chat" element={<VideoChatPage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
                <Route path="/youtube" element={<YoutubePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TranslationProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
