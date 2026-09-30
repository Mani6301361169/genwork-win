export interface AssessmentData {
  title?: string;
  id?: string;
  type?: string;
  [key: string]: any;
}

export interface CategoryScoreInput {
  name: string;
  score: number;
  maxScore?: number;
  criteria?: string;
}

export interface UserAnswerInput {
  question: string;
  userAnswer: string;
  category?: string;
  score?: number;
  maxScore?: number;
}

export interface WinnifyAssessmentInput {
  assessment_data: AssessmentData | string;
  category_scores: CategoryScoreInput[];
  overall_score: number;
  maximum_score: number;
  answers: UserAnswerInput[];
}

export interface WinnifyCategoryReport {
  name: string;
  score: number;
  percentage: number;
  interpretation: string;
  evidence: string[];
}

export interface WinnifyConfidence {
  level: 'High' | 'Medium' | 'Low';
  reason: string;
}

export interface WinnifyAnalysisReport {
  overallSummary: string;
  overallScore: number;
  categories: WinnifyCategoryReport[];
  strengths: string[];
  developmentAreas: string[];
  recommendations: string[];
  consistencyObservations: string[];
  confidence: WinnifyConfidence;
}

const SYSTEM_PROMPT = `You are the AI analysis engine for the Winnify assessment platform.

Your task is to analyze a user's assessment responses and generate an objective, evidence-based assessment report.

IMPORTANT RULES:
1. Do not invent information that is not present in the provided data.
2. Do not change, recalculate, or override the numerical scores supplied by the scoring engine.
3. Treat the supplied scores as authoritative.
4. Base every observation on the user's actual answers, category scores, and assessment data.
5. Do not make medical, psychological, or diagnostic claims.
6. Do not make unsupported assumptions about the user's personality, background, intelligence, or future.
7. Clearly distinguish between:
   * measured score
   * observed pattern
   * possible interpretation
   * recommendation
8. Recommendations must be directly related to the assessment results.
9. If the available data is insufficient to make a conclusion, explicitly state that there is insufficient evidence.
10. Keep the analysis constructive, specific, and easy to understand.
11. Never fabricate missing answers.
12. Return the result strictly in the requested JSON format.

Return ONLY valid JSON using this structure:
{
  "overallSummary": "",
  "overallScore": 0,
  "categories": [
    {
      "name": "",
      "score": 0,
      "percentage": 0,
      "interpretation": "",
      "evidence": []
    }
  ],
  "strengths": [],
  "developmentAreas": [],
  "recommendations": [],
  "consistencyObservations": [],
  "confidence": {
    "level": "",
    "reason": ""
  }
}`;

/**
 * Objective, evidence-based fallback analysis engine strictly enforcing the 12 Winnify rules.
 */
export function generateDeterministicWinnifyReport(input: WinnifyAssessmentInput): WinnifyAnalysisReport {
  const { assessment_data, category_scores, overall_score, maximum_score, answers } = input;

  const assessmentTitle =
    typeof assessment_data === 'object' && assessment_data?.title
      ? assessment_data.title
      : typeof assessment_data === 'string'
      ? assessment_data
      : 'Winnify Competency Assessment';

  const overallPercentage = maximum_score > 0 ? Math.round((overall_score / maximum_score) * 100) : 0;

  // Process Categories
  const categoryReports: WinnifyCategoryReport[] = (category_scores || []).map((cat) => {
    const catMax = cat.maxScore && cat.maxScore > 0 ? cat.maxScore : 100;
    const catPct = catMax > 0 ? Math.round((cat.score / catMax) * 100) : cat.score;
    
    // Find evidence from user answers
    const matchingAnswers = (answers || []).filter(
      (a) => a.category && a.category.toLowerCase().trim() === cat.name.toLowerCase().trim()
    );

    const evidence: string[] = matchingAnswers.map(
      (a) => `Question: "${a.question}" | Measured Answer: "${a.userAnswer}"`
    );

    if (evidence.length === 0) {
      evidence.push(`Insufficient granular evidence recorded in response logs for category "${cat.name}". Measured score: ${cat.score}/${catMax}.`);
    }

    let interpretation = `Measured score is ${cat.score} out of ${catMax} (${catPct}%). `;
    if (catPct >= 80) {
      interpretation += `Demonstrates high proficiency in ${cat.name} according to the scoring engine.`;
    } else if (catPct >= 60) {
      interpretation += `Shows moderate proficiency in ${cat.name} with key areas for further refinement.`;
    } else {
      interpretation += `Identified as a core development area requiring targeted practice in ${cat.name}.`;
    }

    return {
      name: cat.name,
      score: cat.score,
      percentage: catPct,
      interpretation,
      evidence,
    };
  });

  // Strengths & Development Areas
  const sortedCategories = [...categoryReports].sort((a, b) => b.percentage - a.percentage);
  const strengths = sortedCategories
    .filter((c) => c.percentage >= 70)
    .map((c) => `High performance in ${c.name} with a measured score of ${c.score} (${c.percentage}%).`);
  
  if (strengths.length === 0 && sortedCategories.length > 0) {
    const top = sortedCategories[0];
    strengths.push(`Relatively strongest area is ${top.name} with a measured score of ${top.score} (${top.percentage}%).`);
  }

  const developmentAreas = sortedCategories
    .filter((c) => c.percentage < 70)
    .map((c) => `Target area for growth in ${c.name} (current score: ${c.score}, ${c.percentage}%).`);

  if (developmentAreas.length === 0 && sortedCategories.length > 0) {
    const lowest = sortedCategories[sortedCategories.length - 1];
    developmentAreas.push(`Minor growth opportunity in ${lowest.name} to reach maximum benchmark score.`);
  }

  // Actionable Recommendations
  const recommendations = sortedCategories
    .filter((c) => c.percentage < 75)
    .map((c) => `Focus practice modules on ${c.name} to elevate current benchmark score of ${c.score} (${c.percentage}%).`);
  
  if (recommendations.length === 0) {
    recommendations.push('Maintain high performance by engaging in advanced practice scenarios and peer benchmarking.');
  }

  // Response Consistency Observations
  const consistencyObservations: string[] = [];
  if (answers && answers.length > 0) {
    const shortAnswers = answers.filter((a) => a.userAnswer && a.userAnswer.trim().length < 10);
    if (shortAnswers.length > 0) {
      consistencyObservations.push(`Observed pattern: ${shortAnswers.length} response(s) contained brief text outputs (< 10 characters), which may indicate rapid completion.`);
    }

    const scoresList = categoryReports.map((c) => c.percentage);
    if (scoresList.length > 1) {
      const maxDiff = Math.max(...scoresList) - Math.min(...scoresList);
      if (maxDiff > 35) {
        consistencyObservations.push(`Observed variance: High score variance (${maxDiff}% spread) observed across categories. Category scores range from ${Math.min(...scoresList)}% to ${Math.max(...scoresList)}%.`);
      }
    }
  } else {
    consistencyObservations.push('Data note: No individual question transcript array provided; analysis relies strictly on authoritative category score values.');
  }

  if (consistencyObservations.length === 0) {
    consistencyObservations.push('Response pattern appears consistent across assessed categories with steady metric distribution.');
  }

  // Confidence Level Evaluation
  let level: 'High' | 'Medium' | 'Low' = 'High';
  let reason = `Complete dataset evaluated with ${category_scores.length} category scores and total score of ${overall_score}/${maximum_score}.`;

  if (!answers || answers.length === 0) {
    level = 'Medium';
    reason = 'Analysis based on category summary scores without individual response item transcripts.';
  } else if (answers.length < 3) {
    level = 'Medium';
    reason = `Evaluated based on limited response count (${answers.length} answer item(s)).`;
  }

  const overallSummary = `The assessment "${assessmentTitle}" completed with an authoritative overall score of ${overall_score} out of ${maximum_score} (${overallPercentage}%). The user demonstrated key performance indicators across ${category_scores.length} evaluated categories, led by top scores in ${sortedCategories[0]?.name || 'primary category'}.`;

  return {
    overallSummary,
    overallScore: overall_score,
    categories: categoryReports,
    strengths,
    developmentAreas,
    recommendations,
    consistencyObservations,
    confidence: {
      level,
      reason,
    },
  };
}

/**
 * Main Winnify Assessment Engine entrypoint.
 * Attempts OpenAI structured analysis if OPENAI_API_KEY is defined, otherwise uses the evidence-based rule engine.
 */
export async function analyzeWinnifyAssessment(input: WinnifyAssessmentInput): Promise<WinnifyAnalysisReport> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const userPrompt = `
INPUT DATA:

Assessment:
${JSON.stringify(input.assessment_data, null, 2)}

Category Scores:
${JSON.stringify(input.category_scores, null, 2)}

Overall Score:
${input.overall_score}

Maximum Score:
${input.maximum_score}

USER ANSWERS:
${JSON.stringify(input.answers, null, 2)}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content) as WinnifyAnalysisReport;
          // Ensure overallScore matches input exactly per Rule #2
          parsed.overallScore = input.overall_score;
          return parsed;
        }
      }
    } catch (err) {
      console.warn('OpenAI API call failed or timed out. Falling back to Winnify deterministic rule engine:', err);
    }
  }

  return generateDeterministicWinnifyReport(input);
}
