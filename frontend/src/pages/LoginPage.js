import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Mail, KeyRound, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('Anonymous User');

  const handleSendOTP = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/auth/otp/send`, { email });
      setOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/otp/verify`,
        { email, otp },
        { withCredentials: true }
      );
      toast.success('Login successful!');
      navigate('/dashboard', { state: { user: response.data.user } });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleAnonymousLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/anonymous`,
        { display_name: displayName },
        { withCredentials: true }
      );
      toast.success('Welcome! You are now in anonymous mode.');
      navigate('/dashboard', { state: { user: response.data.user } });
    } catch (error) {
      toast.error('Failed to create anonymous session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-[#4A8B71]" />
            <span className="text-2xl font-bold text-[#1A2E26]" style={{fontFamily: 'Nunito, sans-serif'}}>Saathi</span>
          </div>
          <p className="text-[#4A665A]">Your safe space for relationship support</p>
        </div>

        <Card className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)]" data-testid="login-card">
          <CardHeader>
            <CardTitle className="text-2xl text-[#1A2E26]" style={{fontFamily: 'Nunito, sans-serif'}}>Welcome</CardTitle>
            <CardDescription className="text-[#4A665A]">Choose how you'd like to access Saathi</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="email" data-testid="tab-email">Email/OTP</TabsTrigger>
                <TabsTrigger value="google" data-testid="tab-google">Google</TabsTrigger>
                <TabsTrigger value="anonymous" data-testid="tab-anonymous">Anonymous</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpSent}
                    className="rounded-xl border-gray-200 focus:border-[#4A8B71] focus:ring-[#4A8B71]/20 bg-gray-50/50 h-12"
                    data-testid="email-input"
                  />
                </div>

                {!otpSent ? (
                  <Button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full bg-[#4A8B71] text-white hover:bg-[#3D745E] rounded-full h-12 font-semibold"
                    data-testid="send-otp-btn"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                    <Mail className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="rounded-xl border-gray-200 focus:border-[#4A8B71] focus:ring-[#4A8B71]/20 bg-gray-50/50 h-12"
                        data-testid="otp-input"
                      />
                    </div>
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={loading}
                      className="w-full bg-[#4A8B71] text-white hover:bg-[#3D745E] rounded-full h-12 font-semibold"
                      data-testid="verify-otp-btn"
                    >
                      {loading ? 'Verifying...' : 'Verify & Login'}
                      <KeyRound className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      onClick={() => setOtpSent(false)}
                      variant="ghost"
                      className="w-full"
                      data-testid="change-email-btn"
                    >
                      Change Email
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="google" className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-sm text-[#4A665A] mb-4">Sign in securely with your Google account</p>
                  <Button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-[#1A2E26] border-2 border-[#E6E6E6] hover:bg-[#F5F0E6] rounded-full h-12 font-semibold"
                    data-testid="google-login-btn"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="anonymous" className="space-y-4">
                <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-xl p-4 mb-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-[#92400E] font-medium">Anonymous Mode</p>
                      <p className="text-xs text-[#92400E] mt-1">Your identity remains private. Chat history can be deleted anytime.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name (Optional)</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="How should we address you?"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-[#4A8B71] focus:ring-[#4A8B71]/20 bg-gray-50/50 h-12"
                    data-testid="display-name-input"
                  />
                </div>
                <Button
                  onClick={handleAnonymousLogin}
                  disabled={loading}
                  className="w-full bg-[#4A8B71] text-white hover:bg-[#3D745E] rounded-full h-12 font-semibold"
                  data-testid="anonymous-login-btn"
                >
                  {loading ? 'Creating Session...' : 'Continue Anonymously'}
                  <User className="w-4 h-4 ml-2" />
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-[#8C9E96]">
          <p>By continuing, you agree to our <a href="/terms" className="text-[#4A8B71] hover:underline">Terms</a> and <a href="/privacy" className="text-[#4A8B71] hover:underline">Privacy Policy</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;