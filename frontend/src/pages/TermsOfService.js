import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsOfService = () => {
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
              <FileText className="w-5 h-5 text-[#4A8B71]" />
              <h1 className="text-lg font-bold text-[#1A2E26]" style={{fontFamily: 'Nunito, sans-serif'}}>Terms of Service</h1>
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
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>1. Acceptance of Terms</h2>
            <p className="text-[#4A665A] leading-relaxed">
              By accessing or using Saathi's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>2. Eligibility</h2>
            <p className="text-[#4A665A] leading-relaxed">
              You must be at least 18 years old to use Saathi. By using our services, you represent and warrant that you meet this age requirement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>3. Services Provided</h2>
            <p className="text-[#4A665A] leading-relaxed mb-3">Saathi provides:</p>
            <ul className="list-disc list-inside text-[#4A665A] leading-relaxed space-y-2">
              <li>AI-powered relationship support chat</li>
              <li>Platform to book sessions with licensed psychologists</li>
              <li>Self-help resources and tools</li>
              <li>Anonymous browsing and chat options</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>4. User Responsibilities</h2>
            <p className="text-[#4A665A] leading-relaxed mb-3">You agree to:</p>
            <ul className="list-disc list-inside text-[#4A665A] leading-relaxed space-y-2">
              <li>Provide accurate information when creating an account</li>
              <li>Keep your login credentials secure</li>
              <li>Use the platform for lawful purposes only</li>
              <li>Respect the privacy and confidentiality of others</li>
              <li>Not share or misuse content from therapy sessions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>5. AI Chat Limitations</h2>
            <p className="text-[#4A665A] leading-relaxed">
              The AI support agent is designed to provide emotional support and guidance but is not a substitute for professional mental health care. It cannot provide medical diagnoses, prescribe medications, or offer legal advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>6. Therapy Sessions</h2>
            <p className="text-[#4A665A] leading-relaxed">
              All psychologists on our platform are licensed professionals. However, Saathi is a booking platform and does not directly provide therapy services. The therapeutic relationship is between you and the psychologist.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>7. Payments & Refunds</h2>
            <p className="text-[#4A665A] leading-relaxed">
              All payments are processed securely through Razorpay. Session fees are non-refundable unless cancelled at least 24 hours in advance. Refunds will be processed within 7-10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>8. Crisis Situations</h2>
            <p className="text-[#4A665A] leading-relaxed">
              If you are experiencing a mental health emergency or having thoughts of self-harm or suicide, please contact emergency services immediately or call:
            </p>
            <ul className="list-disc list-inside text-[#4A665A] leading-relaxed space-y-2 mt-2">
              <li>AASRA: 91-9820466726</li>
              <li>Kiran Mental Health Helpline: 1800-599-0019</li>
              <li>Vandrevala Foundation: +91-9999666555</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>9. Intellectual Property</h2>
            <p className="text-[#4A665A] leading-relaxed">
              All content on Saathi, including text, graphics, logos, and software, is the property of Saathi and is protected by copyright and intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>10. Limitation of Liability</h2>
            <p className="text-[#4A665A] leading-relaxed">
              Saathi is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform, including but not limited to direct, indirect, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>11. Termination</h2>
            <p className="text-[#4A665A] leading-relaxed">
              We reserve the right to suspend or terminate your account if you violate these Terms of Service or engage in harmful behavior on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>12. Changes to Terms</h2>
            <p className="text-[#4A665A] leading-relaxed">
              We may update these Terms of Service from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>13. Contact Us</h2>
            <p className="text-[#4A665A] leading-relaxed">
              If you have questions about these Terms of Service, please contact us at legal@saathi.support
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;