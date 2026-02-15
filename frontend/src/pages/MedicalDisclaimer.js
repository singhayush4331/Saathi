import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const MedicalDisclaimer = () => {
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
              <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
              <h1 className="text-lg font-bold text-[#1A2E26]" style={{fontFamily: 'Nunito, sans-serif'}}>Medical Disclaimer</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-2xl p-6 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-[#F59E0B] flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold text-[#92400E] mb-2" style={{fontFamily: 'Nunito, sans-serif'}}>Important Notice</h2>
              <p className="text-sm text-[#92400E]">
                This is a critical disclaimer. Please read carefully before using Saathi's services.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E6E6] p-8 space-y-6">
          <div>
            <p className="text-[#8C9E96] text-sm mb-6">Last Updated: January 2025</p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>1. Not a Substitute for Professional Care</h2>
            <p className="text-[#4A665A] leading-relaxed">
              Saathi's AI chat support and self-help resources are designed to provide emotional support and guidance. However, they are <strong>NOT a substitute for professional medical advice, diagnosis, or treatment</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>2. Emergency Situations</h2>
            <p className="text-[#4A665A] leading-relaxed mb-3">
              <strong className="text-[#EF4444]">IF YOU ARE EXPERIENCING A MENTAL HEALTH EMERGENCY, PLEASE CONTACT EMERGENCY SERVICES IMMEDIATELY.</strong>
            </p>
            <p className="text-[#4A665A] leading-relaxed">
              Saathi is not equipped to handle crisis situations. If you or someone you know is having thoughts of self-harm or suicide, please call:
            </p>
            <ul className="list-disc list-inside text-[#4A665A] leading-relaxed space-y-2 mt-2">
              <li><strong>Emergency Services: 112 or 108</strong></li>
              <li>AASRA: 91-9820466726</li>
              <li>Kiran Mental Health Helpline: 1800-599-0019</li>
              <li>Vandrevala Foundation: +91-9999666555</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>3. AI Chat Limitations</h2>
            <p className="text-[#4A665A] leading-relaxed mb-3">The AI support agent:</p>
            <ul className="list-disc list-inside text-[#4A665A] leading-relaxed space-y-2">
              <li>Cannot provide medical diagnoses or clinical assessments</li>
              <li>Cannot prescribe medications or treatment plans</li>
              <li>Cannot provide legal advice</li>
              <li>May not detect all crisis situations or mental health emergencies</li>
              <li>Is not a licensed mental health professional</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>4. Psychologist Sessions</h2>
            <p className="text-[#4A665A] leading-relaxed">
              While all psychologists on Saathi are licensed professionals, Saathi acts only as a booking platform. We do not provide, supervise, or guarantee the quality of therapy services. The therapeutic relationship is solely between you and the psychologist.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>5. User Responsibility</h2>
            <p className="text-[#4A665A] leading-relaxed mb-3">You are responsible for:</p>
            <ul className="list-disc list-inside text-[#4A665A] leading-relaxed space-y-2">
              <li>Seeking professional medical help for serious mental health conditions</li>
              <li>Following the treatment plan prescribed by your healthcare provider</li>
              <li>Not discontinuing prescribed medications or treatments based on AI chat advice</li>
              <li>Recognizing when you need emergency care</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>6. No Guarantees</h2>
            <p className="text-[#4A665A] leading-relaxed">
              We make no guarantees or warranties regarding the outcomes of using Saathi's services. Mental health recovery is a complex process that varies for each individual.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>7. Consult Your Doctor</h2>
            <p className="text-[#4A665A] leading-relaxed">
              Always consult with a qualified healthcare provider before making decisions about your mental health care. If you have any concerns about your mental or physical health, seek professional medical advice immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>8. Limitation of Liability</h2>
            <p className="text-[#4A665A] leading-relaxed">
              Saathi, its affiliates, and psychologists on the platform shall not be held liable for any damages, injuries, or adverse outcomes resulting from your use of the platform or reliance on information provided.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>9. Acknowledgment</h2>
            <p className="text-[#4A665A] leading-relaxed">
              By using Saathi, you acknowledge that you have read, understood, and agree to this Medical Disclaimer. You understand that Saathi is a support platform and not a replacement for professional psychiatric or medical care.
            </p>
          </section>

          <div className="bg-[#EF4444]/10 border border-[#EF4444] rounded-xl p-6 mt-8">
            <p className="text-[#991B1B] font-semibold">
              If you are in crisis or experiencing thoughts of self-harm, please stop using this platform and contact emergency services or a crisis helpline immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;