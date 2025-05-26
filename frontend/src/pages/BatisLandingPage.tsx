import React, { useState, useEffect } from 'react';
import { ArrowRight, BarChart3, FolderCheck, Receipt, Users, Play, LogIn, Menu, X, Building2, GraduationCap, Heart, Zap, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import batisGif from '../assets/batis.gif';

interface VisibilityState {
  [key: string]: boolean;
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
}

interface ScreenshotProps {
  title: string;
  delay?: number;
}

interface OrganizationCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  isActive: boolean;
  onClick: () => void;
  delay?: number;
}

const BatisLandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState<VisibilityState>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [activeLink, setActiveLink] = useState<string>('');
  const [activeOrgType, setActiveOrgType] = useState(0);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const phrases = ['Flow Seamlessly', 'Thrive Effortlessly', 'Grow Confidently'];

  const organizationTypes = [
    {
      icon: GraduationCap,
      title: "Student Organizations",
      description: "Perfect for clubs, fraternities, sororities, and student councils managing membership fees, event costs, and budget allocations.",
      features: ["Membership Fee Tracking", "Event Budget Management", "Multi-tier Access Control", "Semester-based Reporting"]
    },
    {
      icon: Heart,
      title: "Non-Profit Organizations",
      description: "Ideal for charities, foundations, and community organizations tracking donations, grants, and program expenses.",
      features: ["Donation Tracking", "Grant Management", "Donor Reporting", "Tax-compliant Records"]
    },
    {
      icon: Building2,
      title: "Community Groups",
      description: "Great for HOAs, sports clubs, religious organizations, and local groups managing shared resources and fees.",
      features: ["Membership Dues", "Facility Management", "Event Planning", "Transparent Reporting"]
    }
  ];

  // Log section IDs on mount for debugging
  useEffect(() => {
    const sections = document.querySelectorAll('[id]');
    console.log('Section IDs found in DOM:', Array.from(sections).map(el => el.id));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    let charIndex = isTyping ? displayedText.length : displayedText.length - 1;
    const currentPhrase = phrases[currentPhraseIndex];

    if (isTyping) {
      if (charIndex < currentPhrase.length) {
        typingTimeout = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, charIndex + 1));
        }, 100);
      } else {
        setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (charIndex >= 0) {
        typingTimeout = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, charIndex));
        }, 50);
      } else {
        setTimeout(() => {
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          setIsTyping(true);
        }, 500);
      }
    }

    return () => clearTimeout(typingTimeout);
  }, [displayedText, isTyping, currentPhraseIndex]);

  // Auto-rotate organization types
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOrgType((prev) => (prev + 1) % organizationTypes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string, retryCount = 0) => {
    console.log(`Attempting to scroll to ID: ${id}, retry: ${retryCount}`);
    const element = document.getElementById(id);
    if (element) {
      console.log(`Found element:`, element);
      try {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {
        console.error(`scrollIntoView failed:`, e);
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      setIsMobileMenuOpen(false);
    } else {
      console.log(`Element with ID ${id} not found`);
      if (retryCount < 3) {
        setTimeout(() => scrollToSection(id, retryCount + 1), 100);
      } else {
        console.log(`Max retries reached for ID: ${id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleNavClick = (item: string) => {
    const id = item.toLowerCase().replace(' ', '');
    setActiveLink(id);
    scrollToSection(id);
  };

  const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay = 0 }) => (
    <div 
      className={`bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
        isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <Icon className="w-10 h-10 text-yellow-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
    </div>
  );

  const Screenshot: React.FC<ScreenshotProps> = ({ title, delay = 0 }) => (
    <div 
      className={`bg-white rounded-xl border-4 border-purple-500 overflow-hidden shadow-xl transform transition-all duration-700 hover:scale-105 ${
        isVisible.action ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4">
        <h4 className="text-white font-semibold text-lg">{title}</h4>
      </div>
      <div className="p-8 h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center">
            <BarChart3 className="w-10 h-10 text-purple-600" />
          </div>
          <p className="text-gray-600 text-lg">Interactive {title}</p>
        </div>
      </div>
    </div>
  );

  const OrganizationCard: React.FC<OrganizationCardProps> = ({ 
    icon: Icon, 
    title, 
    description, 
    features, 
    isActive, 
    onClick, 
    delay = 0 
  }) => (
    <div 
      className={`relative cursor-pointer transition-all duration-500 transform ${
        isActive ? 'scale-105 z-10' : 'hover:scale-102'
      } ${isVisible.discover ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 ${
        isActive 
          ? 'shadow-2xl border-2 border-purple-500' 
          : 'border border-gray-200 hover:shadow-xl'
      }`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
            : 'bg-gradient-to-br from-gray-100 to-gray-200'
        }`}>
          <Icon className={`w-8 h-8 transition-colors duration-300 ${
            isActive ? 'text-yellow-400' : 'text-gray-600'
          }`} />
        </div>
        
        <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
          isActive ? 'text-purple-600' : 'text-gray-800'
        }`}>
          {title}
        </h3>
        
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          {description}
        </p>
        
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`flex items-center transition-all duration-300 ${
                isActive ? 'translate-x-2' : ''
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`w-2 h-2 rounded-full mr-3 transition-colors duration-300 ${
                isActive ? 'bg-purple-500' : 'bg-gray-300'
              }`} />
              <span className={`font-medium transition-colors duration-300 ${
                isActive ? 'text-purple-700' : 'text-gray-600'
              }`}>
                {feature}
              </span>
            </div>
          ))}
        </div>
        
        {isActive && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <Zap className="w-3 h-3 text-purple-700" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 py-4 transition-all duration-300 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center">
            <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl px-8 py-4 gap-4">
              {/* Logo */}
              <button
                onClick={() => handleNavClick('Home')}
                className="text-xl font-bold bg-gradient-to-r from-purple-600 to-yellow-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 lg:-translate-x-10"
              >
                Batis
              </button>

              {/* Navigation Links */}
              <div className="hidden lg:flex items-center space-x-8">
                {['Home', 'Features', 'Action', 'Discover', 'Register'].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleNavClick(item)}
                    className={`font-medium text-lg relative group transition-colors duration-200 px-4 py-1 rounded-md ${
                      activeLink === item.toLowerCase().replace(' ', '')
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-800 hover:text-purple-600'
                    }`}
                  >
                    {item}
                    {activeLink !== item.toLowerCase().replace(' ', '') && (
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-800 hover:text-purple-600 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-xl border border-white/30 max-w-5xl mx-auto">
              {['Home', 'Features', 'Action', 'Discover', 'Register'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`block w-full text-center font-medium text-lg py-2 transition-colors rounded-md ${
                    activeLink === item.toLowerCase().replace(' ', '')
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-800 hover:text-purple-600'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-white to-gray-100 pt-16 pb-16">
        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <h1 className="text-4xl xl:text-5xl font-bold text-gray-800 leading-tight">
                  <span className="text-purple-600">Batis:</span> Let Your Budget 
                  <span className="block text-yellow-500 relative text-3xl xl:text-5xl">
                    {displayedText}
                    <span className="inline-block w-1 h-8 bg-yellow-500 animate-blink ml-1"></span>
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                  Audit tracking built for modern organizations. Streamline your financial workflow with intelligent automation.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link to="/member-signup">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-purple-700 font-bold py-4 px-10 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center group text-lg">
                      Get Started
                      <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link to="/demo">
                    <button className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold py-4 px-10 rounded-xl transition-all duration-200 flex items-center justify-center text-lg">
                      <Play className="mr-3 w-6 h-6" />
                      Learn More
                    </button>
                  </Link>
                </div>
                <Link to="/org-signup">
                  <span className="text-purple-600 underline hover:text-purple-800 transition-colors duration-200 text-lg mt-4 block text-center sm:text-left">
                    Sign up as an organization
                  </span>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={batisGif}
                alt="Batis App Demo"
                className="w-full h-[36rem] object-cover rounded-3xl"
              />
              <div className="absolute -top-6 -right-6 w-14 h-14 bg-yellow-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                <span className="text-purple-700 font-bold text-2xl">$</span>
              </div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-purple-500 rounded-full animate-bounce shadow-lg flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-purple-100">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Why Choose Batis?</h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
              Powerful features designed to make financial tracking effortless and accurate
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <FeatureCard
              icon={BarChart3}
              title="Real-time Fee Tracking"
              description="Monitor all fees and transactions in real-time with automated categorization and instant updates."
              delay={0}
            />
            <FeatureCard
              icon={FolderCheck}
              title="Smart Organization"
              description="Automatically organize and categorize transactions."
              delay={100}
            />
            <FeatureCard
              icon={Receipt}
              title="Audit Trail"
              description="Complete audit trails with detailed logs, ensuring transparency and compliance at every step."
              delay={200}
            />
            <FeatureCard
              icon={Users}
              title="Team Collaboration"
              description="Seamless collaboration tools for teams with role-based access and approval workflows."
              delay={300}
            />
          </div>
        </div>
      </section>

      <section id="action" className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">See Batis in Action</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Intuitive interface designed for modern workflows
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Screenshot title="Fee Summary Dashboard" delay={0} />
            <Screenshot title="Paid vs Unpaid Analytics" delay={100} />
            <Screenshot title="Editable Fee Management" delay={200} />
          </div>
        </div>
      </section>

      {/*  discover Section */}
      <section id="discover" className="py-24 bg-gradient-to-br from-yellow-50 to-yellow-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/50 to-purple-100/50"></div>
        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-purple-600 mr-4" />
              <h2 className="text-5xl font-bold text-gray-800">Built for Your Organization</h2>
            </div>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Discover how Batis transforms financial management for different types of organizations
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {organizationTypes.map((org, index) => (
              <OrganizationCard
                key={index}
                icon={org.icon}
                title={org.title}
                description={org.description}
                features={org.features}
                isActive={activeOrgType === index}
                onClick={() => setActiveOrgType(index)}
                delay={index * 100}
              />
            ))}
          </div>
          
          {/* Progress indicators */}
          <div className="flex justify-center space-x-3">
            {organizationTypes.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveOrgType(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeOrgType === index 
                    ? 'bg-purple-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* register Section */}
      <section id="register" className="py-24 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-400/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-400/10 rounded-full animate-ping"></div>
        </div>
        
        <div className="container max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className={`transition-all duration-700 ${
            isVisible.register ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <h2 className="text-5xl font-bold text-white mb-8 leading-tight">
              Ready to Transform Your 
              <span className="block text-yellow-400">Financial Workflow?</span>
            </h2>
            <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join hundreds of organizations already using Batis to streamline their financial operations with confidence and clarity.
            </p>
            
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-yellow-400 mr-2" />
                  <span className="text-3xl font-bold text-white">94%</span>
                </div>
                <p className="text-purple-100">Faster Processing</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-yellow-400 mr-2" />
                  <span className="text-3xl font-bold text-white">100%</span>
                </div>
                <p className="text-purple-100">Audit Compliance</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-yellow-400 mr-2" />
                  <span className="text-3xl font-bold text-white">500+</span>
                </div>
                <p className="text-purple-100">Organizations Trust Us</p>
              </div>
            </div>
            
            {/* register Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/login">
                <button 
                  className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold py-5 px-12 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center group text-lg relative overflow-hidden"
                  onMouseEnter={() => setHoveredButton('login')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <div className={`absolute inset-0 bg-yellow-300 transition-transform duration-300 ${
                    hoveredButton === 'login' ? 'translate-x-0' : 'translate-x-full'
                  }`}></div>
                  <LogIn className="mr-3 w-6 h-6 relative z-10" />
                  <span className="relative z-10">Sign In</span>
                </button>
              </Link>

              <button 
                className="bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-purple-900 font-bold py-5 px-12 rounded-2xl transition-all duration-300 flex items-center justify-center group text-lg relative overflow-hidden"
                onMouseEnter={() => setHoveredButton('demo')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <div className={`absolute inset-0 bg-yellow-400 transition-transform duration-300 ${
                  hoveredButton === 'demo' ? 'translate-y-0' : 'translate-y-full'
                }`}></div>
                <Play className="mr-3 w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
                <span className="relative z-10">Request Demo</span>
                <ArrowRight className="ml-3 w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
            
            </div>
            
            <p className="text-purple-200 text-sm mt-8">
              Free 30-day trial • No credit card required • Setup in under 5 minutes
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BatisLandingPage;