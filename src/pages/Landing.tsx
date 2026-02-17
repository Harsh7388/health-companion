import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Pill, 
  Bell, 
  Calendar, 
  BarChart3, 
  Shield, 
  Sparkles,
  ChevronRight,
  Check,
  Flame,
  Heart,
  Droplets,
  ArrowRight,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const features = [
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss a dose with timely push notifications and email alerts.',
    color: 'from-primary/20 to-primary/5',
    iconBg: 'bg-primary/15',
    iconColor: 'text-primary',
  },
  {
    icon: Calendar,
    title: 'Medicine Calendar',
    description: 'Visual calendar to track your medication history at a glance.',
    color: 'from-accent/20 to-accent/5',
    iconBg: 'bg-accent/15',
    iconColor: 'text-accent',
  },
  {
    icon: BarChart3,
    title: 'Progress Reports',
    description: 'Weekly and monthly reports with charts to track your adherence.',
    color: 'from-success/20 to-success/5',
    iconBg: 'bg-success/15',
    iconColor: 'text-success',
  },
  {
    icon: Flame,
    title: 'Streak System',
    description: 'Build healthy habits with daily streaks and achievement badges.',
    color: 'from-warning/20 to-warning/5',
    iconBg: 'bg-warning/15',
    iconColor: 'text-warning',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your health data is encrypted and never shared with third parties.',
    color: 'from-primary/20 to-primary/5',
    iconBg: 'bg-primary/15',
    iconColor: 'text-primary',
  },
  {
    icon: Sparkles,
    title: 'AI Health Tips',
    description: 'Personalized tips and reminders based on your medication schedule.',
    color: 'from-accent/20 to-accent/5',
    iconBg: 'bg-accent/15',
    iconColor: 'text-accent',
  },
];

const stats = [
  { value: '10K+', label: 'Active Users', icon: Heart },
  { value: '98%', label: 'Adherence Rate', icon: BarChart3 },
  { value: '50K+', label: 'Doses Tracked', icon: Pill },
  { value: '4.9', label: 'User Rating', icon: Star },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen gradient-bg overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-8 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="container mx-auto relative">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20">
                <Sparkles className="w-4 h-4" />
                Your Health Companion
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-foreground leading-[1.05] tracking-tight"
            >
              Never Miss a{' '}
              <span className="gradient-text">Medicine</span>{' '}
              Again
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-7 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Track your medications, get timely reminders, and build healthy habits 
              with our intuitive medicine management app.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" asChild className="btn-glow text-base px-8 h-14 rounded-xl font-semibold">
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 h-14 rounded-xl font-semibold border-border/60 hover:bg-muted/50">
                <Link to="/login">I have an account</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-20 max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  variants={item}
                  className="stat-item text-center p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50"
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2 opacity-70" />
                  <p className="text-3xl md:text-4xl font-display font-extrabold gradient-text">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-16 relative"
          >
            <div className="max-w-5xl mx-auto">
              <div className="glass-card rounded-3xl p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Medicine Card Preview */}
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="hero-preview-card"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                        <Pill className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">Vitamin D3</h4>
                        <p className="text-sm text-muted-foreground">1000 IU • 8:00 AM</p>
                      </div>
                    </div>
                    <Button size="sm" className="w-full bg-success hover:bg-success/90 rounded-xl font-semibold">
                      <Check className="w-4 h-4 mr-1.5" /> Mark as Taken
                    </Button>
                  </motion.div>

                  {/* Streak Preview */}
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="hero-preview-card"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Flame className="w-6 h-6 text-accent" />
                      <h4 className="font-bold text-foreground">Current Streak</h4>
                    </div>
                    <p className="text-5xl font-display font-extrabold text-accent">7</p>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">Days in a row 🔥</p>
                    <div className="flex gap-1 mt-4">
                      {[1,2,3,4,5,6,7].map(d => (
                        <div key={d} className="flex-1 h-2 rounded-full bg-accent/80" />
                      ))}
                    </div>
                  </motion.div>

                  {/* Progress Preview */}
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="hero-preview-card"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-6 h-6 text-primary" />
                      <h4 className="font-bold text-foreground">Today's Progress</h4>
                    </div>
                    <div className="flex items-end gap-3 mb-3">
                      <p className="text-5xl font-display font-extrabold text-primary">75%</p>
                      <p className="text-sm text-muted-foreground mb-2 font-medium">completed</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1.2, delay: 1, ease: 'easeOut' }}
                        className="bg-primary h-3 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">3 of 4 medicines taken</p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-4 top-1/4 hidden lg:block"
            >
              <div className="w-14 h-14 rounded-2xl bg-success/15 backdrop-blur-sm border border-success/20 flex items-center justify-center" style={{ boxShadow: '0 8px 30px -4px hsla(152, 60%, 42%, 0.2)' }}>
                <Check className="w-7 h-7 text-success" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-4 top-1/3 hidden lg:block"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/15 backdrop-blur-sm border border-primary/20 flex items-center justify-center" style={{ boxShadow: '0 8px 30px -4px hsla(172, 60%, 38%, 0.2)' }}>
                <Droplets className="w-7 h-7 text-primary" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute right-12 -top-4 hidden lg:block"
            >
              <div className="w-11 h-11 rounded-xl bg-accent/15 backdrop-blur-sm border border-accent/20 flex items-center justify-center" style={{ boxShadow: '0 8px 30px -4px hsla(16, 80%, 56%, 0.2)' }}>
                <Flame className="w-5 h-5 text-accent" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[120px]" />
        </div>

        <div className="container mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground leading-tight">
              Everything you need to{' '}
              <span className="gradient-text">stay healthy</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Powerful features designed to help you manage your medications and build lasting healthy habits.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="feature-card p-7 rounded-2xl border border-border/60 cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-display font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Social Proof */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-1 mb-6">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-6 h-6 text-warning fill-warning" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl font-display font-semibold text-foreground leading-relaxed">
              "MediTrack has completely changed how I manage my medications. The reminders are spot on and the streak system keeps me motivated every day."
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">S</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">Daily user for 6 months</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center p-10 md:p-16 rounded-3xl relative overflow-hidden"
            style={{ 
              background: 'var(--gradient-primary)',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            {/* CTA background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/20 translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-primary-foreground mb-5 leading-tight">
                Start Your Health Journey Today
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto leading-relaxed">
                Join thousands of users who have improved their medication adherence with MediTrack.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  asChild 
                  className="text-base px-8 h-14 rounded-xl font-semibold bg-card text-foreground hover:bg-card/90"
                >
                  <Link to="/signup">
                    Create Free Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  asChild 
                  className="text-base px-8 h-14 rounded-xl font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
