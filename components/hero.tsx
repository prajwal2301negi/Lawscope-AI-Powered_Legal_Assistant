"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  GitBranch, 
  MessageCircle, 
  Users, 
  Zap, 
  Shield, 
  Target,
  ArrowRight
} from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const features = [
    {
      id: 'simplifier',
      title: 'AI Policy Simplifier',
      description: 'Transform complex legal documents into plain English with AI-powered analysis',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      id: 'flowchart',
      title: 'Legal Logic Flowcharts',
      description: 'Visualize legal processes and decision trees with interactive Sankey diagrams',
      icon: GitBranch,
      color: 'bg-green-500',
    },
    {
      id: 'chat',
      title: 'Ask the Law',
      description: 'Get instant answers to legal questions with our intelligent chat interface',
      icon: MessageCircle,
      color: 'bg-purple-500',
    },
    {
      id: 'simulator',
      title: 'Scenario Simulator',
      description: 'Test legal scenarios and visualize outcomes with the Justice Meter',
      icon: Users,
      color: 'bg-amber-500',
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process legal documents in seconds, not hours',
    },
    {
      icon: Shield,
      title: 'Accurate Analysis',
      description: 'AI-powered insights with legal precision',
    },
    {
      icon: Target,
      title: 'User-Friendly',
      description: 'Complex law made simple for everyone',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 legal-gradient bg-clip-text text-transparent">
          Simplify Legal Complexity
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Transform complex legal documents into clear, actionable insights with AI-powered analysis, 
          interactive visualizations, and scenario planning.
        </p>
        <Button 
          size="lg" 
          onClick={() => onNavigate('simplifier')}
          className="text-lg px-8 py-6 animate-pulse-glow"
        >
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card 
                className="card-hover cursor-pointer h-full"
                onClick={() => onNavigate(feature.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-8">Why Choose LawScope?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="text-center bg-primary/5 rounded-2xl p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-4">Ready to Demystify Legal Documents?</h2>
        <p className="text-muted-foreground mb-6">
          Join thousands of legal professionals, researchers, and citizens who trust LawScope
        </p>
        <Button 
          size="lg" 
          onClick={() => onNavigate('simplifier')}
          className="mr-4"
        >
          Start Simplifying
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => onNavigate('chat')}
        >
          Try Ask the Law
        </Button>
      </motion.div>
    </div>
  );
}