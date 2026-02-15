import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <nav className="bg-white border-b border-[#E6E6E6] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#4A8B71]" />
              <h1 className="text-lg font-bold text-[#1A2E26]" style={{fontFamily: 'Nunito, sans-serif'}}>Privacy Policy</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-[#E6E6E6] p-8 space-y-6">
          <div>
            <p className="text-[#8C9E96] text-sm mb-6">Last Updated: January 2025</p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>1. Introduction</h2>
            <p className="text-[#4A665A] leading-relaxed">
              At Saathi, we take your privacy seriously. This Privacy Policy explains how we collect, use, protect, and share your personal information when you use our confidential relationship support platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>2. Information We Collect</h2>
            <ul className="list-disc list-inside text-[#4A665A] leading-relaxed space-y-2">
              <li>Account information (email, name) when you register</li>
              <li>Chat conversations with AI support agent</li>
              <li>Session booking details and payment information</li>
              <li>Usage data and analytics (anonymized)</li>
              <li>Device information and IP addresses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>3. How We Use Your Information</h2>
            <p className="text-[#4A665A] leading-relaxed mb-3">We use your information to:</p>
            <ul className="list-disc list-inside text-[#4A665A] leading-relaxed space-y-2">
              <li>Provide AI chat support and therapy booking services</li>
              <li>Process payments securely</li>
              <li>Send booking confirmations and reminders</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>4. Data Security & Encryption</h2>
            <p className="text-[#4A665A] leading-relaxed">
              All sensitive data is encrypted both in transit (HTTPS/TLS) and at rest. We use industry-standard security measures including password hashing, secure session tokens, and encrypted database storage. Your chat conversations are never stored in plain text.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>5. Anonymous Mode</h2>
            <p className="text-[#4A665A] leading-relaxed">
              When using anonymous mode, you are not required to provide your real name or email. Chat history can be deleted at any time. However, anonymous users cannot book therapy sessions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>6. Data Sharing</h2>
            <p className="text-[#4A665A] leading-relaxed">
              We do not sell your personal information. We only share data with:
            </p>
            <ul className="list-disc list-inside text-[#4A665A] leading-relaxed space-y-2 mt-2">
              <li>Licensed psychologists you book sessions with (booking details only)</li>
              <li>Payment processors (Razorpay) for secure transactions</li>
              <li>Law enforcement if legally required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>7. Your Rights</h2>
            <p className="text-[#4A665A] leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-[#4A665A] leading-relaxed space-y-2">
              <li>Access your personal data</li>
              <li>Request data correction or deletion</li>
              <li>Withdraw consent at any time</li>
              <li>Delete your chat history</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>8. Data Retention</h2>
            <p className="text-[#4A665A] leading-relaxed">
              We retain your data for as long as your account is active. Chat history is stored for 90 days unless deleted earlier by you. Booking records are retained for 7 years for legal and tax purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>9. Children's Privacy</h2>
            <p className="text-[#4A665A] leading-relaxed">
              Saathi is intended for users 18 years and older. We do not knowingly collect information from minors. If we learn that we have collected data from a minor, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>10. Contact Us</h2>
            <p className="text-[#4A665A] leading-relaxed">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at privacy@saathi.support
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;