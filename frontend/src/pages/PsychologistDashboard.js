import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';

const PsychologistDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <nav className="bg-white border-b border-[#E6E6E6]" data-testid="psychologist-nav">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#4A8B71]" />
              <span className="text-lg font-bold text-[#1A2E26]" style={{fontFamily: 'Nunito, sans-serif'}}>Psychologist Dashboard</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#E0F2F1] rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-[#4A8B71]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A2E26] mb-2" style={{fontFamily: 'Nunito, sans-serif'}}>Psychologist Portal</h2>
          <p className="text-[#4A665A]">Manage your availability, view bookings, and track session notes.</p>
        </div>
      </div>
    </div>
  );
};

export default PsychologistDashboard;