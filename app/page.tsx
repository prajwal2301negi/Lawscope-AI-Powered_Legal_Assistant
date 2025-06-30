"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Hero } from '@/components/hero';
import { PolicySimplifier } from '@/components/policy-simplifier';
import { ChatInterface } from '@/components/chat-interface';
import { ScenarioSimulator } from '@/components/scenario-simulator';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'simplifier':
        return <PolicySimplifier />;
      case 'chat':
        return <ChatInterface />;
      case 'simulator':
        return <ScenarioSimulator />;
      default:
        return <Hero onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation activeSection={activeSection} onNavigate={setActiveSection} />
      <motion.main
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-16"
      >
        {renderActiveSection()}
      </motion.main>
    </div>
  );
}