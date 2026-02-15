import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const BookingPage = () => {
  const navigate = useNavigate();
  const { psychologistId } = useParams();
  const [psychologist, setPsychologist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchPsychologist = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/psychologists/${psychologistId}`);
        setPsychologist(response.data);
      } catch (error) {
        toast.error('Failed to load psychologist details');
      } finally {
        setLoading(false);
      }
    };
    fetchPsychologist();
  }, [psychologistId]);

  const handleBooking = async () => {
    if (!bookingDate || !bookingTime) {
      toast.error('Please select date and time');
      return;
    }

    setProcessingPayment(true);

    try {
      const orderResponse = await axios.post(
        `${BACKEND_URL}/api/bookings/create-order`,
        {
          psychologist_id: psychologistId,
          slot_date: bookingDate,
          slot_time: bookingTime
        },
        { withCredentials: true }
      );

      const options = {
        key: orderResponse.data.key,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        order_id: orderResponse.data.order_id,
        name: 'Saathi',
        description: `Session with ${psychologist.name}`,
        handler: async function (response) {
          try {
            await axios.post(
              `${BACKEND_URL}/api/bookings/${orderResponse.data.booking_id}/confirm`,
              { payment_id: response.razorpay_payment_id },
              { withCredentials: true }
            );
            toast.success('Booking confirmed! You will receive a confirmation email.');
            navigate('/dashboard');
          } catch (error) {
            toast.error('Booking confirmation failed');
          }
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#4A8B71'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Failed to create booking order');
    } finally {
      setProcessingPayment(false);
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

  if (!psychologist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <p className="text-[#8C9E96]">Psychologist not found</p>
      </div>
    );
  }

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <nav className="bg-white border-b border-[#E6E6E6] sticky top-0 z-10" data-testid="booking-nav">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/psychologists')}
              variant="ghost"
              size="icon"
              className="rounded-full"
              data-testid="back-btn"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-[#1A2E26]" style={{fontFamily: 'Nunito, sans-serif'}}>Book Session</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6">
          <CardHeader>
            <div className="flex items-start gap-4">
              {psychologist.picture ? (
                <img
                  src={psychologist.picture}
                  alt={psychologist.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-[#E0F2F1] rounded-full flex items-center justify-center text-[#4A8B71] text-2xl font-bold">
                  {psychologist.name.charAt(0)}
                </div>
              )}
              <div>
                <CardTitle className="text-2xl" style={{fontFamily: 'Nunito, sans-serif'}}>{psychologist.name}</CardTitle>
                <p className="text-[#8C9E96]">{psychologist.credentials}</p>
                <p className="text-sm text-[#4A665A] mt-2">{psychologist.bio}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <CardHeader>
            <CardTitle style={{fontFamily: 'Nunito, sans-serif'}}>Select Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bookingDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Select Date
              </Label>
              <Input
                id="bookingDate"
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="rounded-xl border-gray-200 focus:border-[#4A8B71] focus:ring-[#4A8B71]/20 bg-gray-50/50 h-12"
                data-testid="date-input"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Time
              </Label>
              <Select value={bookingTime} onValueChange={setBookingTime}>
                <SelectTrigger className="rounded-xl h-12" data-testid="time-select">
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-[#F5F0E6] rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-[#4A665A]">Session Fee:</span>
                <span className="text-2xl font-bold text-[#4A8B71]">₹{psychologist.pricing}</span>
              </div>
            </div>

            <Button
              onClick={handleBooking}
              disabled={processingPayment || !bookingDate || !bookingTime}
              className="w-full bg-[#4A8B71] text-white hover:bg-[#3D745E] rounded-full h-12 font-semibold"
              data-testid="proceed-payment-btn"
            >
              {processingPayment ? 'Processing...' : 'Proceed to Payment'}
            </Button>

            <p className="text-xs text-[#8C9E96] text-center">
              By booking, you agree to our <a href="/terms" className="text-[#4A8B71]">Terms of Service</a> and <a href="/privacy" className="text-[#4A8B71]">Privacy Policy</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;