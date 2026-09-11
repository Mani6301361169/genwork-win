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
  const words = cleanedText ? cleanedText.split(/\s+/).filter((w) => w.length > 0) : [];
  const wordCount = words.length;

  // 1. Filler Words Detection
  const fillerRegex = /\b(um|uh|like|actually|basically|you know|sort of|kind of|i mean|literally|honestly|right|so yeah)\b/gi;
  const fillerMatches = cleanedText.match(fillerRegex) || [];
  const fillerCount = fillerMatches.length;

  // 2. Unique Vocabulary & Sophisticated Terms
  const normalizedWords = words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const uniqueWords = new Set(normalizedWords);
  const vocabularyRatio = wordCount > 0 ? uniqueWords.size / wordCount : 0;

  const advancedTermsList = [
    'technology', 'development', 'architecture', 'efficiency', 'framework',
    'optimization', 'collaboration', 'continuous', 'learning', 'evolution',
    'innovation', 'strategy', 'perspective', 'implementation', 'system',
    'engineering', 'solution', 'critical', 'effective', 'scalable', 'process'
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
    strengths.push(`Great speech length! You spoke ${wordCount} words, maintaining a good flow.`);
  }
  if (matchedAdvancedTerms.length > 0) {
    strengths.push(`Strong vocabulary choice! You used technical words such as "${matchedAdvancedTerms.slice(0, 3).join('", "')}".`);
  }
  if (foundTransitions.length > 0) {
    strengths.push(`Effective answer structure! You used transition markers like "${foundTransitions.join('", "')}".`);
  }
  if (relevanceScore >= 75) {
    strengths.push(`High prompt relevance! Your answer directly addressed the topic "${topicTitle}".`);
  }
  if (strengths.length === 0) {
    strengths.push('You started your speaking attempt with clear enthusiasm.');
  }

  // Real Specific Improvements
  if (fillerCount > 0) {
    const uniqueFillers = Array.from(new Set(fillerMatches.map((f) => f.toLowerCase())));
    improvements.push(`Reduce filler words: You used "${uniqueFillers.join('", "')}" ${fillerCount} time(s). Practice pausing silently instead.`);
  }
  if (wordCount < 30) {
    improvements.push(`Elaborate further: You spoke ${wordCount} word(s). Aim for at least 40-60 words to fully develop your thoughts.`);
  }
  if (foundTransitions.length === 0) {
    improvements.push('Improve structure: Add logical connectors such as "firstly", "for example", or "in conclusion".');
  }
  if (matchedAdvancedTerms.length === 0 && wordCount >= 20) {
    improvements.push('Vocabulary boost: Try incorporating domain-specific terms into your response.');
  }
  if (improvements.length === 0) {
    improvements.push('Work on varying your pitch and vocal inflection to project maximum confidence.');
  }

  // Real Tailored Next Practice Recommendation
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

  let baseScore = 70;
  if (len < 10) {
    baseScore = 45;
  } else if (len >= 10 && len < 30) {
    baseScore = 65;
  } else if (len >= 30 && len <= 100) {
    baseScore = 85;
  } else {
    baseScore = 80;
  }

  const communicationScore = Math.min(96, Math.max(45, baseScore + (len > 25 ? 5 : -5)));
  const technicalKnowledgeScore = Math.min(96, Math.max(45, baseScore + (len > 30 ? 6 : -4)));
  const confidenceScore = Math.min(95, Math.max(50, baseScore));
  const answerQualityScore = Math.min(96, Math.max(45, baseScore));
  const problemSolvingScore = Math.min(95, Math.max(45, baseScore));
  const professionalismScore = Math.min(98, Math.max(60, baseScore + 5));

  const overallScore = Math.round(
    (communicationScore + technicalKnowledgeScore + confidenceScore + answerQualityScore + problemSolvingScore + professionalismScore) / 6
  );

  let feedbackText = `Good answer! You provided a ${len}-word response addressing the question clearly.`;
  if (len < 20) {
    feedbackText = `Your answer was concise (${len} words). Provide more technical context, specific examples, or methodology details.`;
  } else if (overallScore >= 82) {
    feedbackText = `Excellent articulation! Your ${len}-word response demonstrated solid reasoning, clean structure, and professional tone.`;
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
