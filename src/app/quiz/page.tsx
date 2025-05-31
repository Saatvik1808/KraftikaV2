
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/product-card";
import type { Candle } from "@/types/candle";
import { Wand2, RotateCcw, CheckCircle, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Sample products for recommendation
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
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const questionContainerVariants = {
  enter: (direction: string) => ({
    x: direction === 'right' ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] },
  },
  exit: (direction: string) => ({
    x: direction === 'left' ? '100%' : '-100%', // Corrected: exit to left means positive x
    opacity: 0,
    transition: { duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] },
  }),
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

const itemVariants = { // For result cards
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
};


export default function ScentQuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [showResults, setShowResults] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState<Candle[]>([]);
  const [slideDirection, setSlideDirection] = React.useState<'left' | 'right'>('right');


  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const getRecommendations = (currentAnswers: Answers): Candle[] => {
    const { mood, scentType } = currentAnswers;
    let recommended: Candle[] = [];

    if (mood === 'Relaxing') {
      if (scentType === 'Floral') recommended.push(sampleCandles.find(c => c.name === 'Lavender Dreams')!);
      else if (scentType === 'Sweet') recommended.push(sampleCandles.find(c => c.name === 'Vanilla Bean Bliss')!);
      else recommended.push(sampleCandles.find(c => c.name === 'Lavender Dreams')!);
    } else if (mood === 'Energizing') {
      if (scentType === 'Citrus') recommended.push(sampleCandles.find(c => c.name === 'Sunrise Citrus')!);
      else if (scentType === 'Fresh') recommended.push(sampleCandles.find(c => c.name === 'Mint Mojito')!);
      else recommended.push(sampleCandles.find(c => c.name === 'Sunrise Citrus')!);
    } else if (mood === 'Cozy') {
      if (scentType === 'Sweet') recommended.push(sampleCandles.find(c => c.name === 'Vanilla Bean Bliss')!);
      else if (scentType === 'Fruity') recommended.push(sampleCandles.find(c => c.name === 'Spiced Apple')!);
      else recommended.push(sampleCandles.find(c => c.name === 'Vanilla Bean Bliss')!);
    } else if (mood === 'Romantic') {
         if (scentType === 'Floral') recommended.push(sampleCandles.find(c => c.name === 'Lavender Dreams')!);
         else if (scentType === 'Sweet') recommended.push(sampleCandles.find(c => c.name === 'Vanilla Bean Bliss')!);
         else recommended.push(sampleCandles.find(c => c.name === 'Lavender Dreams')!);
    }

    if (recommended.length === 0) {
        recommended.push(sampleCandles[Math.floor(Math.random() * sampleCandles.length)]);
    }
    return [...new Set(recommended.filter(Boolean))].slice(0, 2);
  };

  const handleSubmitQuiz = () => {
    const newRecommendations = getRecommendations(answers);
    setRecommendations(newRecommendations);
    setShowResults(true);
  };

  const handleNextQuestion = () => {
    setSlideDirection('right');
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    setSlideDirection('left');
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRetakeQuiz = () => {
    setSlideDirection('right'); // Reset slide direction for re-entry
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setRecommendations([]);
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isAnswerSelected = currentQuestion ? !!answers[currentQuestion.id] : false;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24 min-h-[calc(100vh-var(--navbar-height,4rem))] bg-gradient-to-br from-lilac/30 via-background to-primary/10 flex flex-col items-center"
    >
      <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-10 md:mb-12 w-full"
      >
        <Wand2 className="mx-auto h-12 w-12 text-primary mb-4" strokeWidth={1.5}/>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Find Your Perfect Scent
        </h1>
        <p className="mt-3 text-lg text-muted-foreground/90">
          Answer a few questions and we'll recommend the ideal Kraftika candle for you!
        </p>
         {/* Progress Indicator */}
        {!showResults && (
            <div className="mt-6 w-full max-w-md mx-auto">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2.5">
                    <motion.div
                        className="bg-primary h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                    />
                </div>
            </div>
        )}
      </motion.div>

      <div className="w-full flex-grow flex flex-col items-center justify-center overflow-hidden relative min-h-[400px] sm:min-h-[450px]">
        <AnimatePresence mode="wait" custom={slideDirection}>
          {!showResults ? (
            <motion.div
              key={`question-card-${currentQuestionIndex}`}
              custom={slideDirection}
              variants={questionContainerVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-xl" // Question card width
            >
              <Card className="glassmorphism p-6 md:p-8 border border-[hsl(var(--border)/0.2)] shadow-xl w-full">
                <CardHeader className="p-0 mb-5">
                  <CardTitle className="text-xl md:text-2xl font-semibold text-foreground/90 text-center">{currentQuestion.text}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <RadioGroup
                    value={answers[currentQuestion.id] || ""}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    className="space-y-3.5"
                  >
                    {currentQuestion.options.map((option) => (
                      <motion.div
                          key={option}
                          whileHover={{ x: 5 }}
                          className="flex items-center space-x-3 p-3.5 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer border border-border/20 hover:border-primary/30 data-[state=checked]:bg-primary/10 data-[state=checked]:border-primary/50"
                          data-state={answers[currentQuestion.id] === option ? 'checked' : 'unchecked'}
                          onClick={() => handleAnswerChange(currentQuestion.id, option)}
                      >
                        <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} className="border-primary/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary" />
                        <Label htmlFor={`${currentQuestion.id}-${option}`} className="font-normal text-base text-foreground/80 cursor-pointer flex-grow">{option}</Label>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
              <div className="mt-8 flex justify-between items-center w-full">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="border-primary/70 text-primary-foreground hover:bg-primary/10 hover:text-primary-foreground/80 hover:border-primary font-medium min-w-[120px]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button
                  onClick={handleNextQuestion}
                  disabled={!isAnswerSelected}
                  className="btn-primary min-w-[120px] shadow-lg hover:shadow-primary/50 transition-shadow duration-300 group"
                >
                  {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "Show My Scent"}
                  {currentQuestionIndex < quizQuestions.length - 1 ? <ArrowRight className="ml-2 h-4 w-4" /> : <Sparkles className="ml-2 h-5 w-5 opacity-80 group-hover:opacity-100 transition-opacity" />}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="quiz-results"
              variants={resultsVariants}
              initial="hidden"
              animate="visible"
              exit={pageVariants.exit}
              className="text-center w-full max-w-3xl"
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
                <motion.div
                    variants={resultsVariants} // Use variants for staggering children
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto">
                  {recommendations.map((candle, index) => (
                     <motion.div
                          key={candle.id}
                          variants={itemVariants}
                      >
                      <ProductCard product={candle} />
                    </motion.div>
                  ))}
                </motion.div>
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
      </div>
    </motion.div>
  );
}


    