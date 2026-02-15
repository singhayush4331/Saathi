import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Calendar, Shield, CheckCircle, Users, Lock, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-[#E6E6E6]" data-testid="main-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#4A8B71]" />
              <span className="text-xl font-bold text-[#1A2E26]" style={{fontFamily: 'Nunito, sans-serif'}}>Saathi</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/stories')}
                className="text-[#4A665A] hover:bg-[#F5F0E6] rounded-full"
                data-testid="nav-stories-link"
              >
                Success Stories
              </Button>
              <Button 
                onClick={() => navigate('/login')} 
                className="bg-[#4A8B71] text-white hover:bg-[#3D745E] rounded-full px-6 transition-all hover:scale-[1.02]"
                data-testid="nav-login-btn"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1603276730862-cbf79a742aae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwzfHxjYWxtJTIwbmF0dXJlJTIwbGFuZHNjYXBlJTIwcGVhY2VmdWx8ZW58MHx8fHwxNzcxMTcyNjcyfDA&ixlib=rb-4.1.0&q=85"
            alt="Calm nature"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#E0F2F1] text-[#2C5F4C] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              100% Confidential & Secure
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A2E26] mb-6 tracking-tight" style={{fontFamily: 'Nunito, sans-serif'}}>
              Your Safe Space for
              <span className="block text-[#4A8B71] mt-2">Relationship Support</span>
            </h1>
            <p className="text-base md:text-lg text-[#4A665A] mb-8 leading-relaxed max-w-2xl mx-auto">
              Navigate breakups, marriage conflicts, family pressure, and emotional challenges with empathetic AI support or connect with verified licensed psychologists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/login')} 
                className="bg-[#4A8B71] text-white hover:bg-[#3D745E] rounded-full px-8 py-6 font-semibold text-lg shadow-sm transition-all hover:scale-[1.02]"
                data-testid="hero-get-started-btn"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start AI Chat (Free)
              </Button>
              <Button 
                onClick={() => navigate('/login')} 
                variant="secondary"
                className="bg-[#E0F2F1] text-[#2C5F4C] hover:bg-[#B2DFDB] rounded-full px-8 py-6 font-medium text-lg transition-all"
                data-testid="hero-book-session-btn"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book a Session
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" data-testid="features-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A2E26] mb-12" style={{fontFamily: 'Nunito, sans-serif'}}>How Saathi Helps You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-[#E6E6E6] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#4A8B71]/30 hover:shadow-md transition-all duration-300" data-testid="feature-card-ai">
              <div className="w-12 h-12 bg-[#E0F2F1] rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#4A8B71]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>AI Relationship Support</h3>
              <p className="text-base text-[#4A665A] leading-relaxed">
                Chat anonymously with our empathetic AI agent, trained to understand Indian relationship dynamics, family pressure, and cultural contexts.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E6E6E6] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#4A8B71]/30 hover:shadow-md transition-all duration-300" data-testid="feature-card-therapist">
              <div className="w-12 h-12 bg-[#E0F2F1] rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#4A8B71]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>Licensed Psychologists</h3>
              <p className="text-base text-[#4A665A] leading-relaxed">
                Book confidential sessions with verified, experienced psychologists specializing in relationship counseling, marriage therapy, and emotional wellness.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E6E6E6] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#4A8B71]/30 hover:shadow-md transition-all duration-300" data-testid="feature-card-privacy">
              <div className="w-12 h-12 bg-[#E0F2F1] rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-[#4A8B71]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1A2E26] mb-3" style={{fontFamily: 'Nunito, sans-serif'}}>100% Confidential</h3>
              <p className="text-base text-[#4A665A] leading-relaxed">
                Your privacy is our priority. All conversations are encrypted, and you can use anonymous mode without sharing your real identity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F0E6]" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A2E26] mb-12" style={{fontFamily: 'Nunito, sans-serif'}}>Getting Started is Simple</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="step-1">
              <div className="w-16 h-16 bg-[#4A8B71] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold text-[#1A2E26] mb-2" style={{fontFamily: 'Nunito, sans-serif'}}>Choose Your Path</h3>
              <p className="text-base text-[#4A665A]">Start with free AI chat or browse verified psychologists for professional sessions.</p>
            </div>
            <div className="text-center" data-testid="step-2">
              <div className="w-16 h-16 bg-[#4A8B71] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold text-[#1A2E26] mb-2" style={{fontFamily: 'Nunito, sans-serif'}}>Share Your Feelings</h3>
              <p className="text-base text-[#4A665A]">Express yourself in a safe, non-judgmental environment at your own pace.</p>
            </div>
            <div className="text-center" data-testid="step-3">
              <div className="w-16 h-16 bg-[#4A8B71] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold text-[#1A2E26] mb-2" style={{fontFamily: 'Nunito, sans-serif'}}>Get Support & Heal</h3>
              <p className="text-base text-[#4A665A]">Receive empathetic guidance, practical advice, and personalized support for your journey.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A2E26] mb-6" style={{fontFamily: 'Nunito, sans-serif'}}>You Don't Have to Face This Alone</h2>
          <p className="text-base md:text-lg text-[#4A665A] mb-8 leading-relaxed">
            Whether you're dealing with a breakup, marriage issues, or family pressure, Saathi is here for you. Take the first step towards emotional wellness today.
          </p>
          <Button 
            onClick={() => navigate('/login')} 
            className="bg-[#4A8B71] text-white hover:bg-[#3D745E] rounded-full px-8 py-6 font-semibold text-lg shadow-sm transition-all hover:scale-[1.02]"
            data-testid="cta-get-started-btn"
          >
            Get Started - It's Free
          </Button>
        </div>
      </section>

      <footer className="bg-[#1A2E26] text-white py-12 px-4 sm:px-6 lg:px-8" data-testid="footer">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-[#4A8B71]" />
                <span className="text-xl font-bold" style={{fontFamily: 'Nunito, sans-serif'}}>Saathi</span>
              </div>
              <p className="text-[#8C9E96] text-sm">Confidential relationship support platform for India. Your emotional wellness matters.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{fontFamily: 'Nunito, sans-serif'}}>Resources</h4>
              <ul className="space-y-2 text-[#8C9E96] text-sm">
                <li><a href="/stories" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">AI Chat</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Find a Therapist</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{fontFamily: 'Nunito, sans-serif'}}>Legal</h4>
              <ul className="space-y-2 text-[#8C9E96] text-sm">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/disclaimer" className="hover:text-white transition-colors">Medical Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#4A665A] mt-8 pt-8 text-center text-[#8C9E96] text-sm">
            <p>© 2025 Saathi. All rights reserved. Not a substitute for emergency psychiatric care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;