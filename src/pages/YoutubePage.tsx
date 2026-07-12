
import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Youtube, PlayCircle, ThumbsUp, Eye, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import StarBackground from '@/components/StarBackground';

// Mock interface for YouTube videos
interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  views: string;
  likes: string;
  publishedAt: string;
  category: 'astrology' | 'horoscope' | 'panchang' | 'spirituality' | 'compatibility';
  featured?: boolean;
}

const YoutubePage = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from a YouTube API call
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      const mockVideos: VideoData[] = [
        {
          id: 'video1',
          title: 'Understanding Your Birth Chart - The Basics of Astrology',
          thumbnail: 'https://picsum.photos/seed/astro1/640/360',
          channel: 'Astro Insights',
          views: '245K',
          likes: '15K',
          publishedAt: '2023-11-15',
          category: 'astrology',
          featured: true
        },
        {
          id: 'video2',
          title: 'Daily Horoscope Reading - What Stars Say Today',
          thumbnail: 'https://picsum.photos/seed/astro2/640/360',
          channel: 'Cosmic Updates',
          views: '112K',
          likes: '8.5K',
          publishedAt: '2023-12-01',
          category: 'horoscope'
        },
        {
          id: 'video3',
          title: 'Panchang Explained - Traditional Hindu Calendar System',
          thumbnail: 'https://picsum.photos/seed/astro3/640/360',
          channel: 'Vedic Knowledge',
          views: '89K',
          likes: '7.2K',
          publishedAt: '2023-10-20',
          category: 'panchang'
        },
        {
          id: 'video4',
          title: 'Finding Your Spiritual Path Through Astrology',
          thumbnail: 'https://picsum.photos/seed/astro4/640/360',
          channel: 'Spiritual Journey',
          views: '156K',
          likes: '12K',
          publishedAt: '2023-09-15',
          category: 'spirituality',
          featured: true
        },
        {
          id: 'video5',
          title: 'Compatibility Between Zodiac Signs - Who Matches Best?',
          thumbnail: 'https://picsum.photos/seed/astro5/640/360',
          channel: 'Love & Stars',
          views: '320K',
          likes: '25K',
          publishedAt: '2023-08-10',
          category: 'compatibility'
        },
        {
          id: 'video6',
          title: 'Mercury Retrograde - How It Affects Your Life',
          thumbnail: 'https://picsum.photos/seed/astro6/640/360',
          channel: 'Astro Insights',
          views: '178K',
          likes: '14K',
          publishedAt: '2023-11-05',
          category: 'astrology'
        },
        {
          id: 'video7',
          title: 'Weekly Horoscope Forecast - All Zodiac Signs',
          thumbnail: 'https://picsum.photos/seed/astro7/640/360',
          channel: 'Cosmic Updates',
          views: '95K',
          likes: '6.8K',
          publishedAt: '2023-12-10',
          category: 'horoscope'
        },
        {
          id: 'video8',
          title: 'Auspicious Dates for Marriage - Panchang Guide',
          thumbnail: 'https://picsum.photos/seed/astro8/640/360',
          channel: 'Vedic Knowledge',
          views: '132K',
          likes: '11K',
          publishedAt: '2023-10-05',
          category: 'panchang',
          featured: true
        }
      ];
      
      setVideos(mockVideos);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : selectedCategory === 'featured'
      ? videos.filter(video => video.featured)
      : videos.filter(video => video.category === selectedCategory);

  const featuredVideos = videos.filter(video => video.featured);

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400 flex items-center justify-center">
            <Youtube className="mr-2 h-6 w-6" />
            {t('youtube.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('youtube.subtitle')}
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-7 h-auto p-1">
              <TabsTrigger 
                value="all" 
                onClick={() => setSelectedCategory('all')}
                className="px-3 py-2 text-sm"
              >
                {t('youtube.allVideos')}
              </TabsTrigger>
              <TabsTrigger 
                value="featured" 
                onClick={() => setSelectedCategory('featured')}
                className="px-3 py-2 text-sm"
              >
                {t('youtube.featured')}
              </TabsTrigger>
              <TabsTrigger 
                value="astrology" 
                onClick={() => setSelectedCategory('astrology')}
                className="px-3 py-2 text-sm"
              >
                {t('youtube.astrology')}
              </TabsTrigger>
              <TabsTrigger 
                value="horoscope" 
                onClick={() => setSelectedCategory('horoscope')}
                className="px-3 py-2 text-sm"
              >
                {t('youtube.horoscope')}
              </TabsTrigger>
              <TabsTrigger 
                value="panchang" 
                onClick={() => setSelectedCategory('panchang')}
                className="px-3 py-2 text-sm"
              >
                {t('youtube.panchang')}
              </TabsTrigger>
              <TabsTrigger 
                value="spirituality" 
                onClick={() => setSelectedCategory('spirituality')}
                className="px-3 py-2 text-sm"
              >
                {t('youtube.spirituality')}
              </TabsTrigger>
              <TabsTrigger 
                value="compatibility" 
                onClick={() => setSelectedCategory('compatibility')}
                className="px-3 py-2 text-sm"
              >
                {t('youtube.compatibility')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={selectedCategory} className="mt-0">
            {loading ? (
              <div className="flex justify-center py-20">
                <p>{t('common.loading')}</p>
              </div>
            ) : (
              <>
                {selectedCategory === 'all' && featuredVideos.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6">{t('youtube.featuredVideos')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {featuredVideos.map(video => (
                        <Card key={video.id} className="overflow-hidden transition-all hover:shadow-md">
                          <div className="relative">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title} 
                              className="w-full h-64 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <PlayCircle className="h-16 w-16 text-white" />
                            </div>
                            <Badge className="absolute top-2 right-2 bg-red-500">{t('youtube.featured')}</Badge>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="text-lg font-semibold line-clamp-2 mb-2">{video.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{video.channel}</p>
                            <div className="flex items-center text-xs text-muted-foreground space-x-4">
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" /> {video.views}
                              </span>
                              <span className="flex items-center">
                                <ThumbsUp className="h-3 w-3 mr-1" /> {video.likes}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" /> {video.publishedAt}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Separator className="my-8" />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredVideos.map(video => (
                    <Card key={video.id} className="overflow-hidden transition-all hover:shadow-md">
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <PlayCircle className="h-12 w-12 text-white" />
                        </div>
                        {video.featured && selectedCategory !== 'featured' && (
                          <Badge className="absolute top-2 right-2 bg-red-500">{t('youtube.featured')}</Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-md font-medium line-clamp-2 mb-2">{video.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{video.channel}</p>
                        <div className="flex items-center text-xs text-muted-foreground space-x-3">
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" /> {video.views}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" /> {video.publishedAt}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        {!loading && filteredVideos.length > 8 && (
          <div className="flex justify-center mt-10">
            <Button variant="outline">
              {t('youtube.loadMore')}
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default YoutubePage;
