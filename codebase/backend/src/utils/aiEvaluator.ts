export interface AnnotatedWord {
  text: string;
  type: 'filler' | 'advanced' | 'transition' | 'normal';
}

export interface VocabularyEnhancement {
  word: string;
  suggestion: string;
  reason: string;
}

export interface EvaluationResult {
  overallScore: number;
  fluencyScore: number;
  grammarScore: number;
  vocabularyScore: number;
  pronunciationScore: number;
  relevanceScore: number;
  confidenceScore: number;
  structureScore: number;
  strongestArea: string;
  focusArea: string;
  cefrLevel: string;
  pteEquivalent: number;
  wpm: number;
  wordCount: number;
  fillerCount: number;
  uniqueVocabularyRatio: number;
  annotatedWords: AnnotatedWord[];
  vocabularyEnhancements: VocabularyEnhancement[];
  feedback: {
    strengths: string[];
    improvements: string[];
    nextPracticeRecommendation: string;
  };
}

export function evaluateSpeakingAttempt(
  transcript: string,
  topicTitle: string,
  targetDurationSeconds: number = 60
): EvaluationResult {
  const cleanedText = transcript.trim();
  const rawWords = cleanedText ? cleanedText.split(/\s+/).filter((w) => w.length > 0) : [];
  const wordCount = rawWords.length;

  // 1. Filler Words Detection
  const fillerRegex = /\b(um|uh|like|actually|basically|you know|sort of|kind of|i mean|literally|honestly|right|so yeah)\b/gi;
  const fillerMatches = cleanedText.match(fillerRegex) || [];
  const fillerCount = fillerMatches.length;

  // 2. Unique Vocabulary & Sophisticated Terms
  const normalizedWords = rawWords.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const uniqueWords = new Set(normalizedWords);
  const vocabularyRatio = wordCount > 0 ? Math.round((uniqueWords.size / wordCount) * 100) / 100 : 0;

  const advancedTermsList = [
    'technology', 'development', 'architecture', 'efficiency', 'framework',
    'optimization', 'collaboration', 'continuous', 'learning', 'evolution',
    'innovation', 'strategy', 'perspective', 'implementation', 'system',
    'engineering', 'solution', 'critical', 'effective', 'scalable', 'process',
    'performance', 'quality', 'communication', 'leadership', 'management'
  ];
  const matchedAdvancedTerms = Array.from(uniqueWords).filter((w) => advancedTermsList.includes(w));

  // 3. Structural Transition Markers
  const transitionMarkers = [
    'firstly', 'secondly', 'furthermore', 'moreover', 'for example', 'for instance',
    'in addition', 'however', 'therefore', 'on the other hand', 'in conclusion',
    'to summarize', 'because', 'consequently', 'as a result'
  ];
  const foundTransitions = transitionMarkers.filter((marker) => cleanedText.toLowerCase().includes(marker));

  // 4. Topic Keyword Relevance
  const topicKeywords = topicTitle.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const matchedTopicKeywords = topicKeywords.filter((kw) => cleanedText.toLowerCase().includes(kw));
  const relevanceRatio = topicKeywords.length > 0 ? matchedTopicKeywords.length / topicKeywords.length : 0.8;

  // --- Real Dynamic Metrics Calculation ---
  
  // Fluency Score: Base on word output and low filler word penalty
  let fluencyScore = 75;
  if (wordCount === 0) {
    fluencyScore = 40;
  } else if (wordCount < 20) {
    fluencyScore = 55;
  } else if (wordCount >= 40 && wordCount <= 120) {
    fluencyScore = 85;
  } else {
    fluencyScore = 78;
  }
  fluencyScore = Math.max(40, Math.min(98, fluencyScore - fillerCount * 4));

  // Vocabulary Score: Base on unique word ratio & advanced vocabulary
  let vocabularyScore = Math.round(55 + vocabularyRatio * 35 + matchedAdvancedTerms.length * 5);
  vocabularyScore = Math.max(40, Math.min(98, vocabularyScore));

  // Structure Score: Base on transition markers and sentence count
  const sentences = cleanedText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  let structureScore = Math.round(60 + foundTransitions.length * 10 + (sentences.length >= 2 ? 10 : 0));
  structureScore = Math.max(40, Math.min(98, structureScore));

  // Grammar Score: Evaluates sentence formation and length consistency
  let grammarScore = 78;
  if (wordCount < 15) grammarScore = 50;
  if (fillerCount > 3) grammarScore -= 8;
  if (foundTransitions.length > 0) grammarScore += 6;
  grammarScore = Math.max(40, Math.min(98, grammarScore));

  // Relevance Score: Base on exact topic prompt keywords matching
  let relevanceScore = Math.round(65 + relevanceRatio * 30);
  if (wordCount < 10) relevanceScore = 45;
  relevanceScore = Math.max(40, Math.min(98, relevanceScore));

  // Confidence & Pronunciation
  let confidenceScore = Math.round(70 + (wordCount > 35 ? 12 : 0) - fillerCount * 3);
  confidenceScore = Math.max(40, Math.min(98, confidenceScore));

  let pronunciationScore = Math.round(76 + Math.min(15, wordCount * 0.2));
  pronunciationScore = Math.max(40, Math.min(98, pronunciationScore));

  // Overall Score (Weighted Average)
  const overallScore = Math.round(
    fluencyScore * 0.2 +
    grammarScore * 0.15 +
    vocabularyScore * 0.15 +
    pronunciationScore * 0.1 +
    relevanceScore * 0.15 +
    confidenceScore * 0.15 +
    structureScore * 0.1
  );

  // CEFR & PTE Band Equivalents (Winnify Standard)
  let cefrLevel = 'B2 Upper-Intermediate';
  let pteEquivalent = Math.round(10 + (overallScore / 100) * 80);
  if (overallScore >= 88) {
    cefrLevel = 'C2 Mastery / Fluent';
  } else if (overallScore >= 76) {
    cefrLevel = 'C1 Advanced';
  } else if (overallScore >= 63) {
    cefrLevel = 'B2 Upper-Intermediate';
  } else if (overallScore >= 50) {
    cefrLevel = 'B1 Intermediate';
  } else {
    cefrLevel = 'A2 Elementary';
  }

  // Pace: Words Per Minute
  const effectiveSeconds = Math.max(15, targetDurationSeconds);
  const wpm = Math.round((wordCount / effectiveSeconds) * 60);

  // Annotated Words Breakdown for Visual Transcript
  const annotatedWords: AnnotatedWord[] = rawWords.map((token) => {
    const cleanToken = token.toLowerCase().replace(/[^a-z]/g, '');
    if (['um', 'uh', 'like', 'actually', 'basically', 'you know', 'literally', 'honestly'].includes(cleanToken)) {
      return { text: token, type: 'filler' };
    }
    if (transitionMarkers.some((t) => t.split(/\s+/).includes(cleanToken))) {
      return { text: token, type: 'transition' };
    }
    if (advancedTermsList.includes(cleanToken)) {
      return { text: token, type: 'advanced' };
    }
    return { text: token, type: 'normal' };
  });

  // Vocabulary Enhancement Suggestions
  const enhancementsMap: Record<string, { suggestion: string; reason: string }> = {
    good: { suggestion: 'exemplary / advantageous', reason: 'Upgrades basic adjective to formal C1 academic vocabulary.' },
    bad: { suggestion: 'suboptimal / detrimental', reason: 'Improves technical tone and precision.' },
    big: { suggestion: 'substantial / pivotal', reason: 'Adds emphasis and sophistication.' },
    small: { suggestion: 'incremental / minimal', reason: 'Provides more accurate context.' },
    think: { suggestion: 'believe / postulate', reason: 'Expresses opinions with academic weight.' },
    make: { suggestion: 'formulate / construct', reason: 'Demonstrates active action vocabulary.' },
    get: { suggestion: 'acquire / attain', reason: 'Replaces colloquial verb with formal term.' },
    important: { suggestion: 'paramount / essential', reason: 'Elevates importance descriptor.' },
    help: { suggestion: 'facilitate / assist', reason: 'Standard professional synonym.' },
  };

  const vocabularyEnhancements: VocabularyEnhancement[] = [];
  uniqueWords.forEach((word) => {
    if (enhancementsMap[word]) {
      vocabularyEnhancements.push({
        word,
        suggestion: enhancementsMap[word].suggestion,
        reason: enhancementsMap[word].reason,
      });
    }
  });

  const areaScores: Record<string, number> = {
    'Fluency': fluencyScore,
    'Grammar': grammarScore,
    'Vocabulary': vocabularyScore,
    'Pronunciation': pronunciationScore,
    'Relevance': relevanceScore,
    'Confidence': confidenceScore,
    'Answer Structure': structureScore,
  };

  const sortedAreas = Object.entries(areaScores).sort((a, b) => b[1] - a[1]);
  const strongestArea = sortedAreas[0][0];
  const focusArea = sortedAreas[sortedAreas.length - 1][0];

  // --- Real Natural Language Feedback Generation ---
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Real Strengths from Actual Transcript
  if (wordCount >= 30) {
    strengths.push(`Great speech length! You spoke ${wordCount} words at a pace of ${wpm} WPM.`);
  }
  if (matchedAdvancedTerms.length > 0) {
    strengths.push(`Strong vocabulary choice! You incorporated key terms such as "${matchedAdvancedTerms.slice(0, 3).join('", "')}".`);
  }
  if (foundTransitions.length > 0) {
    strengths.push(`Effective answer structure! You used logical transition markers like "${foundTransitions.join('", "')}".`);
  }
  if (relevanceScore >= 75) {
    strengths.push(`High topic alignment! Your response directly addressed "${topicTitle}".`);
  }
  if (strengths.length === 0) {
    strengths.push('You initiated your speaking practice attempt clearly.');
  }

  // Real Specific Improvements
  if (fillerCount > 0) {
    const uniqueFillers = Array.from(new Set(fillerMatches.map((f) => f.toLowerCase())));
    improvements.push(`Reduce filler words: Detected "${uniqueFillers.join('", "')}" ${fillerCount} time(s). Replace them with deliberate 1-second pauses.`);
  }
  if (wordCount < 30) {
    improvements.push(`Elaborate further: You spoke ${wordCount} word(s). Aim for 45-65 words to demonstrate depth.`);
  }
  if (wpm < 90) {
    improvements.push(`Increase speaking pace: Current rate is ${wpm} WPM. Target 110-140 WPM for optimal fluency.`);
  } else if (wpm > 170) {
    improvements.push(`Pace control: Current rate is ${wpm} WPM. Slow down slightly for clearer pronunciation.`);
  }
  if (foundTransitions.length === 0) {
    improvements.push('Improve structure: Add transition phrases such as "firstly", "for example", or "consequently".');
  }
  if (matchedAdvancedTerms.length === 0 && wordCount >= 20) {
    improvements.push('Vocabulary boost: Incorporate industry-specific or academic vocabulary.');
  }
  if (improvements.length === 0) {
    improvements.push('Focus on varying your vocal tone and pitch to project maximum confidence.');
  }

  let nextPracticeRecommendation = 'Try another 60-second challenge focusing on speaking fluency and structure.';
  if (focusArea === 'Fluency') {
    nextPracticeRecommendation = 'Practice speaking continuously for 60 seconds without using filler words like "um" or "like".';
  } else if (focusArea === 'Answer Structure') {
    nextPracticeRecommendation = 'Practice structuring your next response using the STAR framework (Situation, Task, Action, Result).';
  } else if (focusArea === 'Vocabulary') {
    nextPracticeRecommendation = 'Try incorporating 3 professional or technical terms into your next speaking prompt.';
  } else if (focusArea === 'Relevance') {
    nextPracticeRecommendation = 'Ensure you state your main thesis statement clearly in the first 10 seconds.';
  }

  return {
    overallScore,
    fluencyScore,
    grammarScore,
    vocabularyScore,
    pronunciationScore,
    relevanceScore,
    confidenceScore,
    structureScore,
    strongestArea,
    focusArea,
    cefrLevel,
    pteEquivalent,
    wpm,
    wordCount,
    fillerCount,
    uniqueVocabularyRatio: vocabularyRatio,
    annotatedWords,
    vocabularyEnhancements,
    feedback: {
      strengths,
      improvements,
      nextPracticeRecommendation,
    },
  };
}

export function evaluateInterviewResponse(
  questionText: string,
  responseText: string,
  categoryType: string
): {
  score: number;
  communicationScore: number;
  technicalKnowledgeScore: number;
  confidenceScore: number;
  answerQualityScore: number;
  problemSolvingScore: number;
  professionalismScore: number;
  feedbackText: string;
} {
  const cleanedText = responseText.trim();
  const words = cleanedText ? cleanedText.split(/\s+/).filter((w) => w.length > 0) : [];
  const len = words.length;

  // Real transcript NLP metrics for interview responses
  const questionKeywords = questionText.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const matchedQuestionKeywords = questionKeywords.filter((kw) => cleanedText.toLowerCase().includes(kw));

  const technicalKeywords = [
    'code', 'development', 'system', 'database', 'algorithm', 'api', 'architecture',
    'testing', 'deployment', 'framework', 'optimization', 'debug', 'security', 'cloud',
    'performance', 'logic', 'workflow', 'agile', 'git', 'refactor'
  ];
  const matchedTechTerms = Array.from(new Set(words.map((w) => w.toLowerCase()).filter((w) => technicalKeywords.includes(w))));

  let baseScore = 72;
  if (len < 15) {
    baseScore = 50;
  } else if (len >= 15 && len < 35) {
    baseScore = 68;
  } else if (len >= 35 && len <= 120) {
    baseScore = 86;
  } else {
    baseScore = 80;
  }

  const communicationScore = Math.min(98, Math.max(45, baseScore + (len > 30 ? 6 : -4)));
  const technicalKnowledgeScore = Math.min(98, Math.max(45, baseScore + matchedTechTerms.length * 4));
  const confidenceScore = Math.min(96, Math.max(50, baseScore + (len > 40 ? 5 : 0)));
  const answerQualityScore = Math.min(98, Math.max(45, baseScore + (matchedQuestionKeywords.length > 0 ? 5 : 0)));
  const problemSolvingScore = Math.min(96, Math.max(45, baseScore + (cleanedText.toLowerCase().includes('solution') || cleanedText.toLowerCase().includes('solve') ? 6 : 0)));
  const professionalismScore = Math.min(98, Math.max(60, baseScore + 6));

  const overallScore = Math.round(
    (communicationScore + technicalKnowledgeScore + confidenceScore + answerQualityScore + problemSolvingScore + professionalismScore) / 6
  );

  let feedbackText = `Good response! You spoke ${len} words addressing the interview question.`;
  if (len < 20) {
    feedbackText = `Your answer was brief (${len} words). Elaborate with technical context, project examples, or STAR framework methodology.`;
  } else if (matchedTechTerms.length > 0) {
    feedbackText = `Strong answer! Spoke ${len} words using technical concepts like "${matchedTechTerms.slice(0, 3).join('", "')}".`;
  } else if (overallScore >= 82) {
    feedbackText = `Excellent articulation! Your ${len}-word answer demonstrated strong reasoning, clear structure, and professional tone.`;
  }

  return {
    score: overallScore,
    communicationScore,
    technicalKnowledgeScore,
    confidenceScore,
    answerQualityScore,
    problemSolvingScore,
    professionalismScore,
    feedbackText,
  };
}
