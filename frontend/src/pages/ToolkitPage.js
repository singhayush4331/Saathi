import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, FileText, Heart, Lightbulb } from 'lucide-react';

const ToolkitPage = () => {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'reflection',
      title: 'Guided Reflection',
      description: 'Thoughtful questions to help you understand your feelings better',
      icon: Lightbulb,
      color: '#4A8B71'
    },
    {
      id: 'journal',
      title: 'Emotional Journal',
      description: 'Express your thoughts and track your emotional journey',
      icon: FileText,
      color: '#F59E0B'
    },
    {
      id: 'communication',
      title: 'Communication Templates',
      description: 'Helpful scripts for difficult conversations',
      icon: Heart,
      color: '#EF4444'
    },
    {
      id: 'redflags',
      title: 'Red Flags Checklist',
      description: 'Identify unhealthy patterns in relationships',
      icon: BookOpen,
      color: '#10B981'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <nav className="bg-white border-b border-[#E6E6E6] sticky top-0 z-10" data-testid="toolkit-nav">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="icon"
              className="rounded-full"
              data-testid="back-btn"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-[#1A2E26]" style={{fontFamily: 'Nunito, sans-serif'}}>Self-Help Toolkit</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>Tools for Your Journey</h2>
          <p className="text-[#4A665A] max-w-2xl mx-auto">
            Explore evidence-based exercises and resources to support your emotional wellness and relationship growth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#4A8B71]/30 hover:shadow-md transition-all duration-300 cursor-pointer"
              data-testid={`tool-${tool.id}`}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{backgroundColor: `${tool.color}20`}}>
                  <tool.icon className="w-6 h-6" style={{color: tool.color}} />
                </div>
                <CardTitle className="text-xl" style={{fontFamily: 'Nunito, sans-serif'}}>{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#4A665A] mb-4">{tool.description}</p>
                <Button className="w-full bg-[#4A8B71] text-white hover:bg-[#3D745E] rounded-full">
                  Start Exercise
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-[#E0F2F1] border-none mt-8" data-testid="toolkit-info">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[#2C5F4C] mb-2" style={{fontFamily: 'Nunito, sans-serif'}}>Using the Toolkit</h3>
            <p className="text-[#2C5F4C] text-sm">
              These tools are designed to complement professional therapy, not replace it. If you're experiencing severe distress, please consider booking a session with one of our licensed psychologists.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ToolkitPage;