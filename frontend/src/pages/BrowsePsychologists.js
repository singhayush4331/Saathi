import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Star, Award, Calendar } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const BrowsePsychologists = () => {
  const navigate = useNavigate();
  const [psychologists, setPsychologists] = useState([]);
  const [filteredPsychologists, setFilteredPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/psychologists?approved_only=true`);
        setPsychologists(response.data);
        setFilteredPsychologists(response.data);
      } catch (error) {
        toast.error('Failed to load psychologists');
      } finally {
        setLoading(false);
      }
    };
    fetchPsychologists();
  }, []);

  useEffect(() => {
    let filtered = psychologists;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.specialization.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (specializationFilter !== 'all') {
      filtered = filtered.filter(p => p.specialization.includes(specializationFilter));
    }

    setFilteredPsychologists(filtered);
  }, [searchTerm, specializationFilter, psychologists]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A8B71] mx-auto"></div>
          <p className="mt-4 text-[#4A665A]">Loading psychologists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <nav className="bg-white border-b border-[#E6E6E6] sticky top-0 z-10" data-testid="browse-nav">
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
            <h1 className="text-lg font-bold text-[#1A2E26]" style={{fontFamily: 'Nunito, sans-serif'}}>Browse Psychologists</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 space-y-4">
          <Input
            placeholder="Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-xl border-gray-200 focus:border-[#4A8B71] focus:ring-[#4A8B71]/20 bg-white h-12"
            data-testid="search-input"
          />
          <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
            <SelectTrigger className="rounded-xl h-12" data-testid="specialization-filter">
              <SelectValue placeholder="Filter by specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              <SelectItem value="Relationship Counseling">Relationship Counseling</SelectItem>
              <SelectItem value="Marriage Therapy">Marriage Therapy</SelectItem>
              <SelectItem value="Family Therapy">Family Therapy</SelectItem>
              <SelectItem value="Breakup Recovery">Breakup Recovery</SelectItem>
              <SelectItem value="Anxiety & Depression">Anxiety & Depression</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredPsychologists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#8C9E96]">No psychologists found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPsychologists.map((psychologist) => (
              <Card
                key={psychologist.psychologist_id}
                className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#4A8B71]/30 hover:shadow-md transition-all duration-300"
                data-testid={`psychologist-card-${psychologist.psychologist_id}`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4 mb-2">
                    {psychologist.picture ? (
                      <img
                        src={psychologist.picture}
                        alt={psychologist.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[#E0F2F1] rounded-full flex items-center justify-center text-[#4A8B71] text-xl font-bold">
                        {psychologist.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg" style={{fontFamily: 'Nunito, sans-serif'}}>{psychologist.name}</CardTitle>
                      <p className="text-sm text-[#8C9E96]">{psychologist.credentials}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-[#F59E0B] fill-current" />
                        <span className="text-sm font-medium">{psychologist.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-[#4A665A]">
                      <Award className="w-4 h-4" />
                      <span>{psychologist.years_experience} years experience</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {psychologist.specialization.slice(0, 2).map((spec, idx) => (
                        <span
                          key={idx}
                          className="bg-[#E0F2F1] text-[#2C5F4C] text-xs px-3 py-1 rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-[#4A665A] line-clamp-2">{psychologist.bio}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#E6E6E6]">
                      <span className="text-xl font-bold text-[#4A8B71]">₹{psychologist.pricing}</span>
                      <Button
                        onClick={() => navigate(`/book/${psychologist.psychologist_id}`)}
                        className="bg-[#4A8B71] text-white hover:bg-[#3D745E] rounded-full px-6"
                        data-testid={`book-btn-${psychologist.psychologist_id}`}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePsychologists;