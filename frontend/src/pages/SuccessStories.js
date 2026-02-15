import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Quote } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SuccessStories = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/stories`);
        setStories(response.data);
      } catch (error) {
        console.error('Failed to load stories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const categories = {
    'Breakup Recovery': { color: '#4A8B71', icon: Heart },
    'Marriage Improvement': { color: '#F59E0B', icon: Heart },
    'Trust Rebuilding': { color: '#10B981', icon: Heart },
    'Family Conflicts': { color: '#EF4444', icon: Heart }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <nav className="bg-white border-b border-[#E6E6E6] sticky top-0 z-10" data-testid="stories-nav">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="icon"
              className="rounded-full"
              data-testid="back-btn"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-[#1A2E26]" style={{fontFamily: 'Nunito, sans-serif'}}>Success Stories</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>Stories of Hope & Healing</h2>
          <p className="text-[#4A665A] max-w-2xl mx-auto">
            Real experiences from people who found support and healing through Saathi. All stories are anonymized to protect privacy.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A8B71] mx-auto"></div>
            <p className="mt-4 text-[#4A665A]">Loading stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#8C9E96]">No stories available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map((story) => (
              <Card
                key={story.story_id}
                className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300"
                data-testid={`story-${story.story_id}`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{backgroundColor: `${categories[story.category]?.color || '#4A8B71'}20`}}
                    >
                      <Quote className="w-5 h-5" style={{color: categories[story.category]?.color || '#4A8B71'}} />
                    </div>
                    <span 
                      className="text-sm font-semibold px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: `${categories[story.category]?.color || '#4A8B71'}20`,
                        color: categories[story.category]?.color || '#4A8B71'
                      }}
                    >
                      {story.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#4A665A] leading-relaxed">{story.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Card className="bg-[#E0F2F1] border-none inline-block">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#2C5F4C] mb-2" style={{fontFamily: 'Nunito, sans-serif'}}>Your Story Matters</h3>
              <p className="text-[#2C5F4C] text-sm mb-4">
                If Saathi helped you, consider sharing your journey (anonymously) to inspire others.
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="bg-[#4A8B71] text-white hover:bg-[#3D745E] rounded-full"
              >
                Share Your Story
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;