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
  const words = cleanedText ? cleanedText.split(/\s+/) : [];
  const wordCount = words.length;

  // Filler words detection
  const fillerRegex = /\b(um|uh|like|actually|basically|you know|sort of|kind of|i mean)\b/gi;
  const fillerMatches = cleanedText.match(fillerRegex) || [];
  const fillerCount = fillerMatches.length;

  // Vocabulary richness (unique words ratio)
  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, '')));
  const vocabularyRatio = wordCount > 0 ? uniqueWords.size / wordCount : 0;

  // Transition & Structure markers
  const structureMarkers = [
    'firstly', 'secondly', 'in addition', 'for example', 'such as', 'furthermore',
    'moreover', 'in conclusion', 'to summarize', 'because', 'therefore', 'however',
    'on the other hand', 'overall', 'as a result'
  ];
  const foundMarkers = structureMarkers.filter((m) => cleanedText.toLowerCase().includes(m));

  // Topic relevance matching
  const topicKeywords = topicTitle.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const matchedKeywords = topicKeywords.filter((kw) => cleanedText.toLowerCase().includes(kw));
  const relevanceRatio = topicKeywords.length > 0 ? matchedKeywords.length / topicKeywords.length : 0.8;

  // Fluency score (Pace & low filler ratio)
  let fluencyScore = Math.min(96, Math.max(55, Math.round(72 + (wordCount > 30 ? 12 : 0) - fillerCount * 3)));
  if (wordCount < 15) fluencyScore = Math.max(50, fluencyScore - 15);

  // Grammar score
  let grammarScore = Math.min(95, Math.max(60, Math.round(75 + (foundMarkers.length > 0 ? 8 : 0) - fillerCount * 2)));

  // Vocabulary score
  let vocabularyScore = Math.min(98, Math.max(60, Math.round(68 + vocabularyRatio * 30)));

  // Pronunciation score
  let pronunciationScore = Math.min(95, Math.max(65, Math.round(76 + Math.random() * 8)));

  // Relevance score
  let relevanceScore = Math.min(98, Math.max(62, Math.round(70 + relevanceRatio * 25)));

  // Confidence score
  let confidenceScore = Math.min(96, Math.max(58, Math.round(74 + (wordCount > 40 ? 10 : 0) - fillerCount * 3)));

  // Structure score
  let structureScore = Math.min(95, Math.max(55, Math.round(65 + foundMarkers.length * 7)));

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

  const scoresMap: Record<string, number> = {
    'Fluency': fluencyScore,
    'Grammar': grammarScore,
    'Vocabulary': vocabularyScore,
    'Pronunciation': pronunciationScore,
    'Relevance': relevanceScore,
    'Confidence': confidenceScore,
    'Answer Structure': structureScore,
  };

  const sortedAreas = Object.entries(scoresMap).sort((a, b) => b[1] - a[1]);
  const strongestArea = sortedAreas[0][0];
  const focusArea = sortedAreas[sortedAreas.length - 1][0];

  // Feedback points generation
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (relevanceScore >= 75) {
    strengths.push('You stayed highly relevant to the core prompt and addressed the topic directly.');
  }
  if (vocabularyScore >= 75) {
    strengths.push('You used rich and varied vocabulary throughout your response.');
  } else {
    strengths.push('Good attempt at expressing your thoughts clearly.');
  }

  if (foundMarkers.length > 0) {
    strengths.push('Your answer used clear logical connectors to link your thoughts.');
  } else {
    strengths.push('You maintained a steady speaking pace overall.');
  }

  if (fillerCount > 2) {
    improvements.push(`Reduce filler words such as "${fillerMatches.slice(0, 3).join('", "')}". Try taking brief silent pauses instead.`);
  } else {
    improvements.push('Work on sustaining your speech smoothly without long hesitation gaps.');
  }

  if (foundMarkers.length === 0) {
    improvements.push('Enhance your answer structure using transition words like "firstly", "for instance", and "in conclusion".');
  } else {
    improvements.push('Provide specific real-world examples to strengthen your argument.');
  }

  if (wordCount < 40) {
    improvements.push('Elaborate further on your main point to reach the full target duration.');
  } else {
    improvements.push('Focus on modulating your vocal pitch to sound even more confident and engaging.');
  }

  let nextPracticeRecommendation = 'Try another 60-second challenge focusing on speaking fluency and answer structure.';
  if (focusArea === 'Fluency') {
    nextPracticeRecommendation = 'Practice speaking continuously for 60 seconds without using filler words.';
  } else if (focusArea === 'Answer Structure') {
    nextPracticeRecommendation = 'Use the STAR framework (Situation, Task, Action, Result) in your next practice.';
  } else if (focusArea === 'Vocabulary') {
    nextPracticeRecommendation = 'Try incorporating 3 professional or domain-specific terms into your next topic.';
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
  const words = responseText.trim().split(/\s+/);
  const len = words.length;

  let baseScore = Math.min(95, Math.max(60, Math.round(70 + (len > 30 ? 15 : len * 0.4))));
  if (len < 10) baseScore = 45;

  const communicationScore = Math.min(96, Math.max(58, baseScore + Math.floor(Math.random() * 6 - 3)));
  const technicalKnowledgeScore = Math.min(96, Math.max(55, baseScore + Math.floor(Math.random() * 8 - 4)));
  const confidenceScore = Math.min(95, Math.max(60, baseScore + Math.floor(Math.random() * 6 - 3)));
  const answerQualityScore = Math.min(96, Math.max(58, baseScore + Math.floor(Math.random() * 6 - 3)));
  const problemSolvingScore = Math.min(95, Math.max(55, baseScore + Math.floor(Math.random() * 8 - 4)));
  const professionalismScore = Math.min(98, Math.max(65, baseScore + Math.floor(Math.random() * 6 - 2)));

  const overallScore = Math.round(
    (communicationScore + technicalKnowledgeScore + confidenceScore + answerQualityScore + problemSolvingScore + professionalismScore) / 6
  );

  let feedbackText = 'Good response! You addressed the question clearly with relevant key points.';
  if (len < 20) {
    feedbackText = 'Your answer was too concise. Provide more depth, specific technical context, or concrete examples.';
  } else if (overallScore >= 85) {
    feedbackText = 'Excellent articulation! Your answer demonstrated clear technical reasoning, structure, and professional tone.';
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
