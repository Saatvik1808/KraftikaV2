
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
import allProductsData from "@/data/products.json"; // Import the centralized product data

// Sample products for recommendation - now taken from the centralized data
const sampleCandles: Candle[] = allProductsData.filter(c => ['1', '2', '3', '4', '6'].includes(c.id));


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
    x: direction === 'left' ? '100%' : '-100%', 
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

const itemVariants = { 
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

    // Ensure sampleCandles are available before trying to find products
    const findCandle = (name: string) => sampleCandles.find(c => c.name === name);

    if (mood === 'Relaxing') {
      if (scentType === 'Floral') recommended.push(findCandle('Lavender Dreams')!);
      else if (scentType === 'Sweet') recommended.push(findCandle('Vanilla Bean Bliss')!);
      else recommended.push(findCandle('Lavender Dreams')!);
    } else if (mood === 'Energizing') {
      if (scentType === 'Citrus') recommended.push(findCandle('Sunrise Citrus')!);
      else if (scentType === 'Fresh') recommended.push(findCandle('Mint Mojito')!);
      else recommended.push(findCandle('Sunrise Citrus')!);
    } else if (mood === 'Cozy') {
      if (scentType === 'Sweet') recommended.push(findCandle('Vanilla Bean Bliss')!);
      else if (scentType === 'Fruity') recommended.push(findCandle('Spiced Apple')!);
      else recommended.push(findCandle('Vanilla Bean Bliss')!);
    } else if (mood === 'Romantic') {
         if (scentType === 'Floral') recommended.push(findCandle('Lavender Dreams')!);
         else if (scentType === 'Sweet') recommended.push(findCandle('Vanilla Bean Bliss')!);
         else recommended.push(findCandle('Lavender Dreams')!);
    }

    if (recommended.length === 0 && sampleCandles.length > 0) {
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
    setSlideDirection('right'); 
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
              className="w-full max-w-xl"
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
                    variants={resultsVariants} 
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
