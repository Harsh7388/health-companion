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
  Droplets
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const features = [
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss a dose with timely push notifications and email alerts.',
  },
  {
    icon: Calendar,
    title: 'Medicine Calendar',
    description: 'Visual calendar to track your medication history at a glance.',
  },
  {
    icon: BarChart3,
    title: 'Progress Reports',
    description: 'Weekly and monthly reports with charts to track your adherence.',
  },
  {
    icon: Flame,
    title: 'Streak System',
    description: 'Build healthy habits with daily streaks and achievement badges.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your health data is encrypted and never shared with third parties.',
  },
  {
    icon: Sparkles,
    title: 'AI Health Tips',
    description: 'Personalized tips and reminders based on your medication schedule.',
  },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '98%', label: 'Adherence Rate' },
  { value: '50K+', label: 'Doses Tracked' },
  { value: '4.9★', label: 'User Rating' },
];

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Your Health Companion
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold text-foreground leading-tight"
            >
              Never Miss a{' '}
              <span className="gradient-text">Medicine</span>{' '}
              Again
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Track your medications, get timely reminders, and build healthy habits 
              with our intuitive medicine management app.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" asChild className="btn-glow text-lg px-8 h-14">
                <Link to="/signup">
                  Get Started Free
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 h-14">
                <Link to="/login">I have an account</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-display font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 relative"
          >
            <div className="max-w-5xl mx-auto">
              <div className="glass-card rounded-3xl p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Medicine Card Preview */}
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Pill className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Vitamin D3</h4>
                        <p className="text-sm text-muted-foreground">1000 IU • 8:00 AM</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-success hover:bg-success/90">
                        <Check className="w-4 h-4 mr-1" /> Taken
                      </Button>
                    </div>
                  </div>

                  {/* Streak Preview */}
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Flame className="w-6 h-6 text-accent" />
                      <h4 className="font-semibold">Current Streak</h4>
                    </div>
                    <p className="text-4xl font-display font-bold text-accent">7 Days</p>
                    <p className="text-sm text-muted-foreground mt-2">Keep it up! 🎉</p>
                  </div>

                  {/* Progress Preview */}
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="w-6 h-6 text-primary" />
                      <h4 className="font-semibold">Today's Progress</h4>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 mb-2">
                      <div className="bg-primary h-3 rounded-full" style={{ width: '75%' }} />
                    </div>
                    <p className="text-sm text-muted-foreground">3 of 4 medicines taken</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-8 top-1/4 hidden lg:block"
            >
              <div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-success" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-8 top-1/3 hidden lg:block"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Droplets className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Everything you need to{' '}
              <span className="gradient-text">stay healthy</span>
            </h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you manage your medications and build lasting healthy habits.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-card border border-border transition-all duration-300 hover:border-primary/30"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center p-12 rounded-3xl"
            style={{ 
              background: 'var(--gradient-primary)',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Start Your Health Journey Today
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of users who have improved their medication adherence with MediTrack.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              asChild 
              className="text-lg px-8 h-14 bg-card text-foreground hover:bg-card/90"
            >
              <Link to="/signup">
                Create Free Account
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
