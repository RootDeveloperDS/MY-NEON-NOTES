export type DetectedLanguage = 'javascript' | 'python' | 'cpp' | 'java' | 'unknown';

export interface CodeDetectionResult {
  isCode: boolean;
  language: DetectedLanguage;
  score: number;
}

const LANGUAGE_PATTERNS: Record<'javascript' | 'python' | 'cpp' | 'java', RegExp[]> = {
  javascript: [
    /\bconst\b/g,
    /\blet\b/g,
    /\bvar\b/g,
    /\bfunction\b/g,
    /\bconsole\.log\b/g,
    /\bexport\b/g,
    /\bimport\b/g,
    /=>/g,
    /\basync\b/g,
    /\bawait\b/g,
    /\bclass\b/g,
  ],
  python: [
    /^\s*def\s+\w+/gm,
    /^\s*class\s+\w+/gm,
    /\bimport\b/g,
    /\bfrom\b/g,
    /\bprint\s*\(/g,
    /\bself\b/g,
    /\bNone\b/g,
    /#.+$/gm,
    /:\s*$/gm,
  ],
  cpp: [
    /#include\s*[<"][^>"]+[>"]/g,
    /\bstd::\b/g,
    /\bcout\b/g,
    /\bcin\b/g,
    /\bendl\b/g,
    /\busing\s+namespace\s+std\b/g,
    /\bint\s+\w+/g,
    /\bvoid\s+\w+/g,
    /\bclass\s+\w+/g,
    /->/g,
  ],
  java: [
    /\bpublic\s+class\b/g,
    /\bimport\s+java\./g,
    /\bSystem\.out\.print/g,
    /\bString\b/g,
    /\bpublic\s+static\s+void\s+main\b/g,
    /\bextends\b/g,
    /\bimplements\b/g,
  ],
};

const STRONG_SIGNALS: RegExp[] = [
  /^\s*def\s+\w+/m,
  /#include\s*[<"]/,
  /\bconsole\.log\b/,
  /\bfunction\s+\w+/,
  /^\s*class\s+\w+/m,
  /\bpublic\s+class\b/,
];

const FENCE_PATTERN = /```/;

const countMatches = (text: string, pattern: RegExp) => {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
};

const scoreText = (text: string, patterns: RegExp[]) => {
  return patterns.reduce((score, pattern) => {
    const count = Math.min(countMatches(text, pattern), 6);
    return score + count;
  }, 0);
};

export function detectCodeBlock(text: string): CodeDetectionResult {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return { isCode: false, language: 'unknown', score: 0 };
  }

  const scores = {
    javascript: scoreText(normalized, LANGUAGE_PATTERNS.javascript),
    python: scoreText(normalized, LANGUAGE_PATTERNS.python),
    cpp: scoreText(normalized, LANGUAGE_PATTERNS.cpp),
    java: scoreText(normalized, LANGUAGE_PATTERNS.java),
  };

  const entries = Object.entries(scores) as Array<['javascript' | 'python' | 'cpp' | 'java', number]>;
  let bestLanguage: DetectedLanguage = 'unknown';
  let maxScore = 0;

  for (const [language, score] of entries) {
    if (score > maxScore) {
      maxScore = score;
      bestLanguage = language;
    }
  }

  const hasStrongSignal = STRONG_SIGNALS.some((pattern) => pattern.test(normalized));
  const minScore = normalized.length > 200 ? 6 : normalized.length > 120 ? 5 : normalized.length > 60 ? 4 : 3;

  const isCode =
    FENCE_PATTERN.test(normalized) ||
    (hasStrongSignal && maxScore >= 2) ||
    maxScore >= minScore;

  return {
    isCode,
    language: isCode ? bestLanguage : 'unknown',
    score: maxScore,
  };
}
