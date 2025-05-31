
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/product-card";
import type { Candle } from "@/types/candle";
import { Wand2, RotateCcw, CheckCircle, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Sample products for recommendation (use actual Unsplash URLs from your data)
const sampleCandles: Candle[] = [
    { id: '1', name: 'Sunrise Citrus', scentCategory: 'Citrus', price: 28, imageUrl: 'https://images.unsplash.com/photo-1697587454797-8644fcb7e242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjaXRydXMlMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Zesty lemon and sweet orange.', scentNotes: 'Lemon, Orange, Bergamot', burnTime: '40 hours', ingredients: 'Soy Wax, Essential Oils' },
    { id: '2', name: 'Lavender Dreams', scentCategory: 'Floral', price: 32, imageUrl: 'https://images.unsplash.com/photo-1619799360851-a143fbc240b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxmbG9yYWwlMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Calming lavender fields.', scentNotes: 'Lavender, Chamomile, Vanilla', burnTime: '45 hours', ingredients: 'Soy Wax, Natural Fragrance' },
    { id: '3', name: 'Vanilla Bean Bliss', scentCategory: 'Sweet', price: 30, imageUrl: 'https://images.unsplash.com/photo-1604249180535-583716d9ec33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzd2VldCUyMGNhbmRsZXxlbnwwfHx8fDE3NDg2OTE1MDR8MA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Warm and comforting vanilla.', scentNotes: 'Vanilla Bean, Sugar, Buttercream', burnTime: '50 hours', ingredients: 'Coconut Wax Blend, Fragrance Oil' },
    { id: '4', name: 'Mint Mojito', scentCategory: 'Fresh', price: 29, imageUrl: 'https://images.unsplash.com/photo-1645602996177-e30e95e58c4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmcmVzaCUyMGNhbmRsZXxlbnwwfHx8fDE3NDg2OTE1MDR8MA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Cool mint and zesty lime.', scentNotes: 'Mint, Lime, Sugar', burnTime: '40 hours', ingredients: 'Soy Wax, Essential Oils' },
    { id: '6', name: 'Spiced Apple', scentCategory: 'Fruity', price: 31, imageUrl: 'https://images.unsplash.com/photo-1625055887171-4a3186a42b39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxmcnVpdHklMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Warm apple and cinnamon.', scentNotes: 'Apple, Cinnamon, Clove', burnTime: '48 hours', ingredients: 'Soy Wax Blend, Fragrance Oil' },
];

const quizQuestions = [
  { id: 'mood', text: 'What kind of mood are you looking for?', options: ['Relaxing', 'Energizing', 'Cozy', 'Romantic'] },
  { id: 'scentType', text: 'Which scent family appeals to you most?', options: ['Floral', 'Citrus', 'Sweet', 'Fresh', 'Fruity'] },
  { id: 'activity', text: 'Pick your ideal way to unwind:', options: ['Reading a book by a window', 'A lively gathering with friends', 'A calming spa day at home', 'A walk through a blooming garden'] },
];

type Answers = {
  [key: string]: string;
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeIn" } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
};

const resultsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delayChildren: 0.2, staggerChildren: 0.1 } },
};

const glowVariants = {
    animate: {
        boxShadow: [
            "0 0 0px hsla(var(--primary-hsl), 0)",
            "0 0 30px hsla(var(--primary-hsl), 0.6)",
            "0 0 0px hsla(var(--primary-hsl), 0)",
        ],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
};


export default function ScentQuizPage() {
  const [answers, setAnswers] = React.useState<Answers>({});
  const [showResults, setShowResults] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState<Candle[]>([]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const getRecommendations = (currentAnswers: Answers): Candle[] => {
    const { mood, scentType } = currentAnswers;
    let recommended: Candle[] = [];

    if (mood === 'Relaxing') {
      if (scentType === 'Floral') recommended.push(sampleCandles.find(c => c.name === 'Lavender Dreams')!);
      else if (scentType === 'Sweet') recommended.push(sampleCandles.find(c => c.name === 'Vanilla Bean Bliss')!);
      else recommended.push(sampleCandles.find(c => c.name === 'Lavender Dreams')!); // Default relaxing
    } else if (mood === 'Energizing') {
      if (scentType === 'Citrus') recommended.push(sampleCandles.find(c => c.name === 'Sunrise Citrus')!);
      else if (scentType === 'Fresh') recommended.push(sampleCandles.find(c => c.name === 'Mint Mojito')!);
      else recommended.push(sampleCandles.find(c => c.name === 'Sunrise Citrus')!); // Default energizing
    } else if (mood === 'Cozy') {
      if (scentType === 'Sweet') recommended.push(sampleCandles.find(c => c.name === 'Vanilla Bean Bliss')!);
      else if (scentType === 'Fruity') recommended.push(sampleCandles.find(c => c.name === 'Spiced Apple')!);
      else recommended.push(sampleCandles.find(c => c.name === 'Vanilla Bean Bliss')!); // Default cozy
    } else if (mood === 'Romantic') {
         if (scentType === 'Floral') recommended.push(sampleCandles.find(c => c.name === 'Lavender Dreams')!); // Assuming Rose Garden would be here
         else if (scentType === 'Sweet') recommended.push(sampleCandles.find(c => c.name === 'Vanilla Bean Bliss')!);
         else recommended.push(sampleCandles.find(c => c.name === 'Lavender Dreams')!);
    }

    // Fallback / Add more diverse recommendations
    if (recommended.length === 0) {
        // Pick a random one or a popular one as a generic fallback
        recommended.push(sampleCandles[Math.floor(Math.random() * sampleCandles.length)]);
    }
     // Ensure unique recommendations if logic above might add duplicates (not in this simple version)
    return [...new Set(recommended.filter(Boolean))].slice(0, 2); // Max 2 recommendations
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(answers).length < quizQuestions.length) {
        // Basic validation: ensure all questions are answered
        alert("Please answer all questions to find your perfect scent!");
        return;
    }
    const newRecommendations = getRecommendations(answers);
    setRecommendations(newRecommendations);
    setShowResults(true);
  };

  const handleRetakeQuiz = () => {
    setAnswers({});
    setShowResults(false);
    setRecommendations([]);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24 min-h-[calc(100vh-var(--navbar-height,4rem))] bg-gradient-to-br from-lilac/30 via-background to-primary/10 overflow-hidden"
    >
      <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-10 md:mb-12"
      >
        <Wand2 className="mx-auto h-12 w-12 text-primary mb-4" strokeWidth={1.5}/>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Find Your Perfect Scent
        </h1>
        <p className="mt-3 text-lg text-muted-foreground/90">
          Answer a few questions and we'll recommend the ideal Kraftika candle for you!
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="quiz-form"
            variants={pageVariants} // Can reuse or create specific variants for form section
            className="space-y-8"
          >
            {quizQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 + index * 0.15 }}
              >
                <Card className="glassmorphism p-6 border border-[hsl(var(--border)/0.2)] shadow-lg">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl font-semibold text-foreground/90">{question.text}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <RadioGroup
                      value={answers[question.id] || ""}
                      onValueChange={(value) => handleAnswerChange(question.id, value)}
                      className="space-y-3"
                    >
                      {question.options.map((option) => (
                        <motion.div
                            key={option}
                            whileHover={{ x: 5 }}
                            className="flex items-center space-x-3 p-3 rounded-md hover:bg-primary/5 transition-colors cursor-pointer border border-transparent hover:border-primary/20"
                            onClick={() => handleAnswerChange(question.id, option)} // Allow clicking div
                        >
                          <RadioGroupItem value={option} id={`${question.id}-${option}`} className="border-primary/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary" />
                          <Label htmlFor={`${question.id}-${option}`} className="font-normal text-foreground/80 cursor-pointer flex-grow">{option}</Label>
                        </motion.div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 + quizQuestions.length * 0.15 }}
                className="text-center mt-10 pt-4"
            >
              <Button
                size="lg"
                onClick={handleSubmitQuiz}
                className="btn-primary min-w-[200px] shadow-lg hover:shadow-primary/50 transition-shadow duration-300 group"
                disabled={Object.keys(answers).length < quizQuestions.length}
              >
                Find My Scent <Sparkles className="ml-2 h-5 w-5 opacity-80 group-hover:opacity-100 transition-opacity" />
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz-results"
            variants={resultsVariants}
            initial="hidden"
            animate="visible"
            exit="exit" // Ensure exit animation
            className="text-center"
          >
            <motion.div
                className="p-3 rounded-full mb-6 inline-block"
                variants={glowVariants}
                animate="animate"
            >
                <CheckCircle className="h-16 w-16 text-primary filter drop-shadow-md" />
            </motion.div>

            <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">
              Your Scent Matches!
            </h2>
            <p className="text-lg text-muted-foreground/90 mb-8 max-w-md mx-auto">
              Based on your preferences, we think you'll love these:
            </p>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto">
                {recommendations.map((candle, index) => (
                   <motion.div
                        key={candle.id}
                        variants={itemVariants} // Reuse item variants for cards
                        transition={{delay: index * 0.15}}
                    >
                    <ProductCard product={candle} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No specific recommendations found. Try exploring our full collection!</p>
            )}

            <Separator className="my-10 bg-border/30 max-w-sm mx-auto" />
            
            <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: recommendations.length * 0.15 + 0.3}}
            >
                <Button
                    size="lg"
                    variant="outline"
                    onClick={handleRetakeQuiz}
                    className="border-primary/70 text-primary-foreground hover:bg-primary/10 hover:text-primary-foreground/80 hover:border-primary font-medium"
                >
                    <RotateCcw className="mr-2 h-4 w-4" /> Retake Quiz
                </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
