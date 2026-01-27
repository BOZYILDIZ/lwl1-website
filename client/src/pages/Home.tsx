/*
 * NEURAL FLUX - Page d'accueil lwl.fr
 * Site one-page immersif pour Netz Informatique
 * Design: Bio-Digital Futurisme, palette noir/blanc stricte
 */

import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFadeIn, useLineReveal, useScaleIn } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowRight, Brain, Cpu, Sparkles, Zap, Shield, TrendingUp, ChevronRight } from 'lucide-react';
import CustomCursor from '@/components/CustomCursor';
import FloatingParticles from '@/components/FloatingParticles';

// Lazy load du composant 3D pour optimiser le chargement
const NeuralNetwork = lazy(() => import('@/components/NeuralNetwork'));

gsap.registerPlugin(ScrollTrigger);

// ============================================
// LOADING SCREEN
// ============================================
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: onComplete
        });
      }
    });

    tl.fromTo(textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    )
    .to(progressRef.current, {
      scaleX: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    })
    .to(textRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3
    });
  }, [onComplete]);

  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
    >
      <div className="text-center">
        <div ref={textRef} className="mb-8">
          <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            LWL1<span className="text-white/50">.fr</span>
          </div>
          <div className="text-sm text-white/50">Chargement de l'expérience...</div>
        </div>
        <div className="w-48 h-0.5 bg-white/10 mx-auto overflow-hidden">
          <div 
            ref={progressRef}
            className="h-full bg-white origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    const tl = gsap.timeline({ delay: 2.5 });
    
    tl.fromTo(titleRef.current, 
      { opacity: 0, y: 100, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power4.out' }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo(ctaRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );

    setIsLoaded(true);
  }, []);

  const scrollToVision = () => {
    const visionSection = document.getElementById('vision');
    if (visionSection) {
      visionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/hero-neural-network.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5
        }}
      />
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-[1]" />
      
      {/* Radial Glow */}
      <div 
        className="absolute inset-0 z-[2] opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container text-center px-4 pt-20 md:pt-0">
        <div className="max-w-5xl mx-auto">
          {/* Badge - hidden on mobile to avoid overlap */}
          <div 
            className={`hidden sm:inline-flex items-center gap-2 px-5 py-2.5 mb-10 glass rounded-full transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <Sparkles className="w-4 h-4 text-white/80" />
            <span className="text-sm text-white/80 font-medium tracking-wide">
              Propulsé par Netz Informatique
            </span>
          </div>
          
          {/* Main Title */}
          <h1 
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-8 tracking-tight leading-[0.9]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="block text-white">L'Intelligence</span>
            <span className="block gradient-text glow-text my-2">Artificielle</span>
            <span className="block text-white">Redéfinie</span>
          </h1>
          
          {/* Subtitle */}
          <p 
            ref={subtitleRef}
            className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-14 leading-relaxed"
          >
            Découvrez la puissance de l'<strong className="text-white">IA professionnelle</strong> avec 
            les solutions innovantes de <strong className="text-white">Netz Informatique</strong>. 
            Transformation digitale, expertise technologique, vision d'avenir.
          </p>
          
          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Button 
              size="lg"
              className="bg-white text-black hover:bg-white/90 px-10 py-7 text-lg font-semibold group rounded-full"
              onClick={() => window.open('https://netz-informatique.fr', '_blank')}
            >
              Découvrir Netz Informatique
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-10 py-7 text-lg rounded-full"
              onClick={scrollToVision}
            >
              Explorer
              <ArrowDown className="ml-2 w-5 h-5 animate-bounce" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator - hidden on mobile */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <div className="w-7 h-12 border-2 border-white/30 rounded-full flex justify-center p-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
      
      {/* Decorative Lines */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}

// ============================================
// VISION SECTION
// ============================================
function VisionSection() {
  const titleRef = useFadeIn<HTMLHeadingElement>(0, 1, 50);
  const textRef = useFadeIn<HTMLParagraphElement>(0.2, 1, 30);
  const imageRef = useScaleIn<HTMLDivElement>(0.3);
  const lineRef = useLineReveal<HTMLDivElement>(0.1);

  return (
    <section 
      id="vision"
      className="relative min-h-screen flex items-center py-32 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <div ref={lineRef} className="w-24 h-0.5 bg-white mb-10" />
            
            <h2 
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-10 leading-[1.1]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Notre Vision de l'
              <span className="gradient-text block mt-2">Intelligence Artificielle</span>
            </h2>
            
            <p 
              ref={textRef}
              className="text-lg lg:text-xl text-white/70 leading-relaxed mb-12"
            >
              Chez <strong className="text-white">Netz Informatique</strong>, nous croyons que 
              l'<strong className="text-white">intelligence artificielle</strong> n'est pas simplement 
              une technologie — c'est le catalyseur d'une nouvelle ère d'innovation. Notre expertise 
              en <strong className="text-white">solutions IA</strong> permet aux entreprises de 
              transcender leurs limites et d'embrasser la <strong className="text-white">transformation 
              digitale</strong> avec confiance.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <FeatureCard 
                icon={<Brain className="w-8 h-8" />}
                title="IA Professionnelle"
                description="Solutions sur mesure pour chaque défi métier"
                delay={0}
              />
              <FeatureCard 
                icon={<TrendingUp className="w-8 h-8" />}
                title="Innovation Continue"
                description="Technologies avancées en constante évolution"
                delay={0.1}
              />
            </div>
          </div>
          
          {/* Image */}
          <div ref={imageRef} className="order-1 lg:order-2 relative">
            <div className="relative aspect-square max-w-xl mx-auto">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-white/5 rounded-[3rem] blur-3xl" />
              
              <div className="relative glass rounded-[3rem] p-4 overflow-hidden">
                <img 
                  src="/images/ai-brain-abstract.png" 
                  alt="Intelligence Artificielle - Visualisation abstraite"
                  className="w-full h-full object-cover rounded-[2.5rem]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-[2.5rem]" />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 border border-white/10 rounded-full float" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 border border-white/5 rounded-full float" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 -right-4 w-4 h-4 bg-white/20 rounded-full pulse-glow" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
}) {
  const cardRef = useFadeIn<HTMLDivElement>(delay, 0.8, 30);
  
  return (
    <div 
      ref={cardRef}
      className="glass p-7 rounded-2xl group hover:bg-white/10 transition-all duration-500 hover:scale-[1.02]"
    >
      <div className="text-white mb-5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-white/60">{description}</p>
    </div>
  );
}

// ============================================
// TECHNOLOGY SECTION
// ============================================
function TechnologySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useFadeIn<HTMLHeadingElement>(0, 1, 50);
  const lineRef = useLineReveal<HTMLDivElement>(0.1);

  const technologies = [
    {
      icon: <Cpu className="w-12 h-12" />,
      title: "Machine Learning",
      description: "Algorithmes d'apprentissage automatique pour des prédictions précises et des décisions intelligentes.",
      features: ["Prédiction", "Classification", "Clustering"]
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Deep Learning",
      description: "Réseaux neuronaux profonds pour le traitement du langage naturel et la vision par ordinateur.",
      features: ["NLP", "Vision", "Génération"]
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Automatisation IA",
      description: "Processus automatisés intelligents pour optimiser vos opérations et réduire les coûts.",
      features: ["RPA", "Workflows", "Optimisation"]
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "IA Sécurisée",
      description: "Solutions IA conformes aux normes de sécurité et de confidentialité les plus strictes.",
      features: ["RGPD", "Chiffrement", "Audit"]
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="technology"
      className="relative min-h-screen flex items-center py-32"
    >
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/tech-grid-perspective.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.3
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-[1]" />
      
      <div className="container relative z-10">
        <div className="text-center mb-20">
          <div ref={lineRef} className="w-24 h-0.5 bg-white mx-auto mb-10" />
          
          <h2 
            ref={titleRef}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Technologies <span className="gradient-text">Avancées</span>
          </h2>
          
          <p className="text-lg lg:text-xl text-white/70 max-w-3xl mx-auto">
            Notre expertise en <strong className="text-white">innovation technologique</strong> nous 
            permet de déployer les solutions IA les plus performantes du marché.
          </p>
        </div>
        
        {/* Technology Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <TechCard key={index} {...tech} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TechCard({ icon, title, description, features, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  features: string[];
  delay: number;
}) {
  const cardRef = useFadeIn<HTMLDivElement>(delay, 0.8, 40);
  
  return (
    <div 
      ref={cardRef}
      className="glass p-8 rounded-3xl group hover:bg-white/10 transition-all duration-500 hover:scale-[1.03] relative overflow-hidden"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="text-white mb-7 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-white/60 text-sm leading-relaxed mb-6">{description}</p>
        
        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {features.map((feature, i) => (
            <span 
              key={i}
              className="text-xs px-3 py-1 bg-white/5 rounded-full text-white/50"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// EXPERTISE SECTION
// ============================================
function ExpertiseSection() {
  const titleRef = useFadeIn<HTMLHeadingElement>(0, 1, 50);
  const imageRef = useScaleIn<HTMLDivElement>(0.2);
  const lineRef = useLineReveal<HTMLDivElement>(0.1);

  const stats = [
    { value: "99.9", suffix: "%", label: "Disponibilité" },
    { value: "24", suffix: "/7", label: "Support" },
    { value: "100", suffix: "+", label: "Projets IA" },
    { value: "15", suffix: "+", label: "Années d'expertise" }
  ];

  return (
    <section 
      id="expertise"
      className="relative min-h-screen flex items-center py-32 overflow-hidden"
    >
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Image */}
          <div ref={imageRef} className="relative">
            <div className="relative aspect-[16/10] max-w-2xl">
              {/* Glow */}
              <div className="absolute inset-0 bg-white/5 rounded-3xl blur-3xl" />
              
              <div className="relative glass rounded-3xl p-3 overflow-hidden">
                <img 
                  src="/images/data-flow-abstract.png" 
                  alt="Flux de données - Expertise IA"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent rounded-2xl" />
              </div>
            </div>
            
            {/* Decorative */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 border border-white/10 rounded-2xl" />
          </div>
          
          {/* Content */}
          <div>
            <div ref={lineRef} className="w-24 h-0.5 bg-white mb-10" />
            
            <h2 
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-10 leading-[1.1]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Puissance & <span className="gradient-text block mt-2">Expertise</span>
            </h2>
            
            <p className="text-lg lg:text-xl text-white/70 leading-relaxed mb-14">
              <strong className="text-white">Netz Informatique</strong> combine une expertise technique 
              de pointe avec une compréhension profonde des enjeux métier. Notre équipe d'experts en 
              <strong className="text-white"> IA professionnelle</strong> accompagne votre 
              <strong className="text-white"> transformation digitale</strong> avec des solutions 
              fiables et performantes.
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} delay={index * 0.1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, suffix, label, delay }: { value: string; suffix: string; label: string; delay: number }) {
  const cardRef = useFadeIn<HTMLDivElement>(delay, 0.6, 20);
  
  return (
    <div ref={cardRef} className="text-center">
      <div className="text-4xl sm:text-5xl font-bold text-white mb-3 glow-text">
        {value}<span className="text-white/50">{suffix}</span>
      </div>
      <div className="text-sm text-white/50 uppercase tracking-wider">{label}</div>
    </div>
  );
}

// ============================================
// CTA SECTION
// ============================================
function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useFadeIn<HTMLHeadingElement>(0, 1, 50);
  const ctaRef = useFadeIn<HTMLDivElement>(0.3, 0.8, 30);

  return (
    <section 
      ref={sectionRef}
      id="cta"
      className="relative min-h-[90vh] flex items-center py-32"
    >
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/innovation-abstract.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/90 z-[1]" />
      
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 
            ref={titleRef}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-10 leading-[1.1]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Prêt à Transformer<br />
            Votre <span className="gradient-text">Avenir</span> ?
          </h2>
          
          <p className="text-xl lg:text-2xl text-white/70 mb-14 max-w-3xl mx-auto leading-relaxed">
            Rejoignez les entreprises qui ont choisi <strong className="text-white">Netz Informatique</strong>{' '}
            pour leur <strong className="text-white">transformation digitale</strong> et découvrez le 
            potentiel de l'<strong className="text-white">intelligence artificielle</strong>.
          </p>
          
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              size="lg"
              className="bg-white text-black hover:bg-white/90 px-12 py-8 text-xl font-semibold group rounded-full"
              onClick={() => window.open('https://netz-informatique.fr', '_blank')}
            >
              Contactez Netz Informatique
              <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-16 flex items-center justify-center gap-8 text-white/30 text-sm">
            <span>Expertise IA</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span>Solutions Innovantes</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span>Support 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <footer className="relative py-20 border-t border-white/10">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-12 items-center">
          {/* Logo */}
          <div className="text-center md:text-left">
            <div className="text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              LWL1<span className="text-white/50">.fr</span>
            </div>
            <p className="text-sm text-white/50">
              Vitrine technologique de Netz Informatique
            </p>
          </div>
          
          {/* Links */}
          <div className="flex items-center justify-center gap-10">
            <a 
              href="https://netz-informatique.fr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              Netz Informatique
            </a>
            <a 
              href="mailto:contact@netz-informatique.fr"
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              Contact
            </a>
          </div>
          
          {/* Copyright */}
          <div className="text-sm text-white/40 text-center md:text-right">
            © {new Date().getFullYear()} Netz Informatique.<br />
            Tous droits réservés.
          </div>
        </div>
        
        {/* SEO Keywords (hidden but accessible) */}
        <div className="sr-only">
          Intelligence artificielle, IA professionnelle, solutions IA, innovation technologique, 
          expertise IA, transformation digitale, technologies avancées, Netz Informatique, 
          machine learning, deep learning, automatisation IA.
        </div>
      </div>
    </footer>
  );
}

// ============================================
// NAVIGATION
// ============================================
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Detect active section
      const sections = ['hero', 'vision', 'technology', 'expertise', 'cta'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'vision', label: 'Vision' },
    { id: 'technology', label: 'Technologies' },
    { id: 'expertise', label: 'Expertise' },
  ];

  const handleMobileNavClick = (id: string) => {
    scrollToSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'glass py-4' : 'py-6'
        }`}
      >
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            LWL1<span className="text-white/50">.fr</span>
          </button>
          
          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm transition-colors relative ${
                  activeSection === item.id ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-white" />
                )}
              </button>
            ))}
            <Button 
              size="sm"
              className="bg-white text-black hover:bg-white/90 rounded-full px-6"
              onClick={() => window.open('https://netz-informatique.fr', '_blank')}
            >
              Netz Informatique
            </Button>
          </div>
          
          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : ''
            }`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`} />
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-lg transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => handleMobileNavClick(item.id)}
              className={`text-2xl font-medium transition-colors ${
                activeSection === item.id ? 'text-white' : 'text-white/60'
              }`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {item.label}
            </button>
          ))}
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-white/90 rounded-full px-8 mt-4"
            onClick={() => {
              window.open('https://netz-informatique.fr', '_blank');
              setIsMobileMenuOpen(false);
            }}
          >
            Netz Informatique
          </Button>
        </div>
      </div>
    </>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Floating Particles */}
      <FloatingParticles count={30} className="z-[1] opacity-50" />
      
      {/* 3D Neural Network Background */}
      <Suspense fallback={null}>
        <NeuralNetwork />
      </Suspense>
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <VisionSection />
        <TechnologySection />
        <ExpertiseSection />
        <CTASection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
