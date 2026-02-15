import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Calendar, BookOpen, LogOut, Heart, User } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${BACKEND_URL}/api/auth/me`, { withCredentials: true });
        setUser(userRes.data);

        const bookingsRes = await axios.get(`${BACKEND_URL}/api/bookings`, { withCredentials: true });
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A8B71] mx-auto"></div>
          <p className="mt-4 text-[#4A665A]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <nav className="bg-white border-b border-[#E6E6E6]" data-testid="dashboard-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#4A8B71]" />
              <span className="text-xl font-bold text-[#1A2E26]" style={{fontFamily: 'Nunito, sans-serif'}}>Saathi</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-[#4A665A] hover:bg-[#F5F0E6] rounded-full"
              data-testid="logout-btn"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1A2E26] mb-2" style={{fontFamily: 'Nunito, sans-serif'}} data-testid="welcome-message">
            Welcome{user?.is_anonymous ? '' : `, ${user?.name}`}! 🌿
          </h1>
          <p className="text-[#4A665A] text-lg">How can we support you today?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card
            className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#4A8B71]/30 hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/chat')}
            data-testid="quick-action-chat"
          >
            <CardHeader>
              <div className="w-12 h-12 bg-[#E0F2F1] rounded-xl flex items-center justify-center mb-2">
                <MessageCircle className="w-6 h-6 text-[#4A8B71]" />
              </div>
              <CardTitle className="text-xl" style={{fontFamily: 'Nunito, sans-serif'}}>AI Chat Support</CardTitle>
              <CardDescription>Talk to our empathetic AI agent</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#4A8B71]/30 hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/psychologists')}
            data-testid="quick-action-book"
          >
            <CardHeader>
              <div className="w-12 h-12 bg-[#E0F2F1] rounded-xl flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-[#4A8B71]" />
              </div>
              <CardTitle className="text-xl" style={{fontFamily: 'Nunito, sans-serif'}}>Book a Session</CardTitle>
              <CardDescription>Connect with verified psychologists</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#4A8B71]/30 hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/toolkit')}
            data-testid="quick-action-toolkit"
          >
            <CardHeader>
              <div className="w-12 h-12 bg-[#E0F2F1] rounded-xl flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-[#4A8B71]" />
              </div>
              <CardTitle className="text-xl" style={{fontFamily: 'Nunito, sans-serif'}}>Self-Help Toolkit</CardTitle>
              <CardDescription>Guided exercises and resources</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {bookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-4" style={{fontFamily: 'Nunito, sans-serif'}}>Upcoming Sessions</h2>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.booking_id} className="bg-white rounded-2xl border border-[#E6E6E6]" data-testid={`booking-${booking.booking_id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#1A2E26]">{booking.slot_date} at {booking.slot_time}</p>
                        <p className="text-sm text-[#4A665A]">Status: <span className="capitalize">{booking.status}</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#4A8B71] font-semibold">₹{booking.amount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E6E6E6] md:hidden" data-testid="mobile-nav">
        <div className="flex justify-around py-3">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center text-[#4A8B71]">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button onClick={() => navigate('/chat')} className="flex flex-col items-center text-[#4A665A]">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs mt-1">Chat</span>
          </button>
          <button onClick={() => navigate('/psychologists')} className="flex flex-col items-center text-[#4A665A]">
            <Calendar className="w-6 h-6" />
            <span className="text-xs mt-1">Book</span>
          </button>
          <button onClick={() => navigate('/toolkit')} className="flex flex-col items-center text-[#4A665A]">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs mt-1">Toolkit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;