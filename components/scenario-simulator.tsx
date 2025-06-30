"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  Scale, 
  Zap,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { toast } from 'sonner';
import { generateScenarioAnalysis } from '@/lib/gemini';

interface SimulationResult {
  scenario: string;
  role: string;
  analysis: string;
  riskLevel: number;
  fairnessScore: number;
  applicableLaws: string[];
  consequences: string[];
  recommendations: string[];
}

export function ScenarioSimulator() {
  const [selectedRole, setSelectedRole] = useState('');
  const [scenarioText, setScenarioText] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [animatedScores, setAnimatedScores] = useState({ risk: 0, fairness: 0 });

  const roles = [
    { id: 'tenant', label: 'Tenant', icon: '🏠' },
    { id: 'landlord', label: 'Landlord', icon: '🏢' },
    { id: 'employee', label: 'Employee', icon: '👤' },
    { id: 'employer', label: 'Employer', icon: '🏢' },
    { id: 'consumer', label: 'Consumer', icon: '🛒' },
    { id: 'business', label: 'Business Owner', icon: '💼' },
    { id: 'contractor', label: 'Contractor', icon: '🔧' },
    { id: 'client', label: 'Client', icon: '📋' },
  ];

  const exampleScenarios = [
    {
      role: 'tenant',
      scenario: "I haven't paid rent for 2 months due to job loss. My landlord hasn't given me any written notice and wants to change the locks tomorrow.",
    },
    {
      role: 'employee',
      scenario: "My employer is asking me to work overtime without pay and threatening to fire me if I refuse. I've been working there for 6 months.",
    },
    {
      role: 'consumer',
      scenario: "I bought a defective product online 3 weeks ago. The company refuses to refund my money and claims their no-return policy is final.",
    },
  ];

  const runSimulation = async () => {
    if (!selectedRole || !scenarioText.trim()) {
      toast.error('Please select a role and describe your scenario');
      return;
    }

    setIsSimulating(true);
    setResults(null);
    setAnimatedScores({ risk: 0, fairness: 0 });

    try {
      const prompt = `Role: ${selectedRole}\nScenario: ${scenarioText}`;
      const analysis = await generateScenarioAnalysis(prompt);
      
      // Mock results - in a real app, this would parse the AI response
      const mockResult: SimulationResult = {
        scenario: scenarioText,
        role: selectedRole,
        analysis: analysis,
        riskLevel: Math.floor(Math.random() * 100) + 1,
        fairnessScore: Math.floor(Math.random() * 100) + 1,
        applicableLaws: [
          'Landlord-Tenant Act Section 12.3',
          'Civil Rights Act - Fair Housing',
          'State Eviction Procedures Code 45.2',
        ],
        consequences: [
          'Potential eviction proceedings',
          'Damage to credit score',
          'Legal fees and court costs',
        ],
        recommendations: [
          'Seek immediate legal counsel',
          'Document all communications',
          'Contact local tenant rights organization',
          'Explore emergency rent assistance programs',
        ],
      };

      setResults(mockResult);
      
      // Animate the scores
      setTimeout(() => {
        setAnimatedScores({
          risk: mockResult.riskLevel,
          fairness: mockResult.fairnessScore,
        });
      }, 500);

      toast.success('Scenario analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze scenario. Please try again.');
      console.error('Simulation error:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const loadExampleScenario = (example: any) => {
    setSelectedRole(example.role);
    setScenarioText(example.scenario);
    toast.success('Example scenario loaded!');
  };

  const getRiskColor = (level: number) => {
    if (level <= 30) return 'text-green-600';
    if (level <= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFairnessColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskIcon = (level: number) => {
    if (level <= 30) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (level <= 70) return <Minus className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  const getFairnessIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (score >= 40) return <Minus className="h-5 w-5 text-yellow-600" />;
    return <TrendingDown className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <Users className="mr-3 h-8 w-8 text-primary" />
            Legal Scenario Simulator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Test legal scenarios and get AI-powered analysis with risk assessment and fairness scoring
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="mr-2 h-5 w-5" />
                Scenario Setup
              </CardTitle>
              <CardDescription>
                Select your role and describe the legal situation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Select Your Role:
                </label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your role in the scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <span className="flex items-center">
                          <span className="mr-2">{role.icon}</span>
                          {role.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Scenario Input */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Describe Your Scenario:
                </label>
                <Textarea
                  placeholder="Describe the legal situation in detail. Include relevant dates, actions taken, and any documentation you have..."
                  value={scenarioText}
                  onChange={(e) => setScenarioText(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              {/* Simulate Button */}
              <Button 
                onClick={runSimulation}
                disabled={!selectedRole || !scenarioText.trim() || isSimulating}
                className="w-full"
                size="lg"
              >
                {isSimulating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Analyzing Scenario...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Run Simulation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="mr-2 h-5 w-5" />
                Justice Meter & Analysis
              </CardTitle>
              <CardDescription>
                AI-powered risk assessment and legal analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {results ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Justice Meters */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Risk Level</span>
                          {getRiskIcon(animatedScores.risk)}
                        </div>
                        <Progress 
                          value={animatedScores.risk} 
                          className="h-3"
                        />
                        <span className={`text-sm font-bold ${getRiskColor(animatedScores.risk)}`}>
                          {animatedScores.risk}% Risk
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Fairness Score</span>
                          {getFairnessIcon(animatedScores.fairness)}
                        </div>
                        <Progress 
                          value={animatedScores.fairness} 
                          className="h-3"
                        />
                        <span className={`text-sm font-bold ${getFairnessColor(animatedScores.fairness)}`}>
                          {animatedScores.fairness}% Fair
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* Analysis */}
                    <div>
                      <h4 className="font-semibold mb-2">AI Analysis:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                        {results.analysis}
                      </p>
                    </div>

                    {/* Applicable Laws */}
                    <div>
                      <h4 className="font-semibold mb-2">Applicable Laws:</h4>
                      <div className="space-y-1">
                        {results.applicableLaws.map((law, index) => (
                          <Badge key={index} variant="outline" className="block w-fit">
                            {law}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Consequences */}
                    <div>
                      <h4 className="font-semibold mb-2">Potential Consequences:</h4>
                      <ul className="text-sm space-y-1">
                        {results.consequences.map((consequence, index) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="h-3 w-3 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                            {consequence}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations:</h4>
                      <ul className="text-sm space-y-1">
                        {results.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Scale className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No analysis yet</p>
                    <p className="text-sm">Set up a scenario and click "Run Simulation"</p>
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Example Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle>Example Scenarios</CardTitle>
            <CardDescription>
              Click to load common legal situations for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {exampleScenarios.map((example, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="cursor-pointer card-hover"
                    onClick={() => loadExampleScenario(example)}
                  >
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2">
                        {roles.find(r => r.id === example.role)?.label}
                      </Badge>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {example.scenario}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}