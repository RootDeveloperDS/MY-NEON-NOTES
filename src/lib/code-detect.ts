export type DetectedLanguage = 'javascript' | 'python' | 'cpp' | 'java' | 'typescript' | 'csharp' | 'go' | 'rust' | 'php' | 'ruby' | 'unknown';

export interface CodeDetectionResult {
  isCode: boolean;
  language: DetectedLanguage;
  score: number;
}

const LANGUAGE_PATTERNS: Record<Exclude<DetectedLanguage, 'unknown'>, RegExp[]> = {
  javascript: [
    /\bconsole\.log\b/g,
    /\bdocument\.\b/g,
    /\bwindow\.\b/g,
    /\bfunction\s+\w+/g,
    /=>/g,
    /\bexport\s+const\b/g,
    /\bimport\s+.*from\s+['"]/g, // JS specific import syntax
    /\bsetTimeout\b/g,
  ],
  typescript: [
    /\binterface\s+\w+\s*\{/g,
    /\btype\s+\w+\s*=/g,
    /:\s*string\b/g,
    /:\s*number\b/g,
    /:\s*boolean\b/g,
    /\bexport\s+interface\b/g,
    / as \w+/g, // type assertion
  ],
  python: [
    /^\s*def\s+\w+/gm,
    /^\s*class\s+\w+/gm,
    /\bimport\s+\w+/g,
    /\bfrom\s+\w+\s+import\b/g,
    /\bprint\s*\(/g,
    /\bself\b/g,
    /\bNone\b/g,
    /\bTrue\b/g,
    /\bFalse\b/g,
    /:\s*$/gm, // blocks ending with colon
  ],
  cpp: [
    /#include\s*[<"][^>"]+[>"]/g,
    /\bstd::/g,
    /\bcout\b/g,
    /\bcin\b/g,
    /\bendl\b/g,
    /\bvector</g,
    /\bint\s+main\s*\(/g,
    /->/g,
  ],
  java: [
    /\bpublic\s+class\b/g,
    /\bpublic\s+static\s+void\s+main\b/g,
    /\bSystem\.out\.print/g,
    /\bimport\s+java\./g,
    /\bString\[\]\s+args\b/g,
    /\bextends\s+\w+/g,
    /\bimplements\s+\w+/g,
    /@Override/g,
  ],
  csharp: [
    /\busing\s+System;/g,
    /\bnamespace\s+\w+/g,
    /\bConsole\.WriteLine/g,
    /\bpublic\s+class\b/g,
    /\bget;\s*set;/g,
    /\bTask</g,
    /\bvar\s+\w+\s*=/g,
  ],
  go: [
    /\bpackage\s+main\b/g,
    /\bfunc\s+\w+/g,
    /\bfmt\.Print/g,
    /\bimport\s*\(/g,
    /\bchan\b/g,
    /\bgo\s+func/g,
    /\bdefer\b/g,
    /:\=/g,
  ],
  rust: [
    /\bfn\s+\w+/g,
    /\bprintln!/g,
    /\buse\s+std::/g,
    /\blet\s+mut\b/g,
    /\bimpl\s+\w+/g,
    /\bpub\s+struct\b/g,
    /\bmatch\s+\w+/g,
  ],
  php: [
    /<\?php/g,
    /\$this->/g,
    /\becho\b/g,
    /\$_POST/g,
    /\$_GET/g,
    /\bfunction\b/g,
    /=>/g,
  ],
  ruby: [
    /\bdef\s+\w+/g,
    /\bputs\b/g,
    /\brequire\s+['"]/g,
    /\bdo\s*\|/g,
    /\bend\b/g,
    /@[a-zA-Z_]+/g, // instance variables
    /\battr_accessor\b/g,
  ],
};

const STRONG_SIGNALS: { pattern: RegExp; lang: Exclude<DetectedLanguage, 'unknown'> }[] = [
  { pattern: /<\?php/, lang: 'php' },
  { pattern: /#include\s*[<"]/, lang: 'cpp' },
  { pattern: /\bstd::/, lang: 'cpp' },
  { pattern: /\bpublic\s+static\s+void\s+main/, lang: 'java' },
  { pattern: /\bSystem\.out\.print/, lang: 'java' },
  { pattern: /\busing\s+System;/, lang: 'csharp' },
  { pattern: /\bConsole\.WriteLine/, lang: 'csharp' },
  { pattern: /\bpackage\s+main\b/, lang: 'go' },
  { pattern: /\bfmt\.Print/, lang: 'go' },
  { pattern: /\bfn\s+main\s*\(/, lang: 'rust' },
  { pattern: /\bprintln!/, lang: 'rust' },
  { pattern: /^\s*def\s+\w+/m, lang: 'python' },
  { pattern: /\bconsole\.log\b/, lang: 'javascript' },
  { pattern: /\binterface\s+\w+\s*\{/, lang: 'typescript' },
  { pattern: /\bimport\s+java\./, lang: 'java' },
];

const FENCE_PATTERN = /```/;

const countMatches = (text: string, pattern: RegExp) => {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
};

const scoreText = (text: string, patterns: RegExp[]) => {
  return patterns.reduce((score, pattern) => {
    const count = Math.min(countMatches(text, pattern), 5); // Cap to avoid one keyword dominating
    return score + count;
  }, 0);
};

export function detectCodeBlock(text: string): CodeDetectionResult {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return { isCode: false, language: 'unknown', score: 0 };
  }

  // 1. Check for markdown code fences (e.g. ```python)
  const fenceMatch = normalized.match(/^```(\w+)/);
  if (fenceMatch && fenceMatch[1]) {
    const langMap: Record<string, DetectedLanguage> = {
      js: 'javascript', javascript: 'javascript',
      ts: 'typescript', typescript: 'typescript',
      py: 'python', python: 'python',
      cpp: 'cpp', c: 'cpp', 'c++': 'cpp',
      java: 'java',
      cs: 'csharp', csharp: 'csharp',
      go: 'go',
      rs: 'rust', rust: 'rust',
      php: 'php',
      rb: 'ruby', ruby: 'ruby'
    };
    const mappedLang = langMap[fenceMatch[1].toLowerCase()];
    if (mappedLang) {
      return { isCode: true, language: mappedLang, score: 100 };
    }
  }

  // 2. Check for unmistakable strong signals
  for (const signal of STRONG_SIGNALS) {
    if (signal.pattern.test(normalized)) {
      return { isCode: true, language: signal.lang, score: 50 };
    }
  }

  // 3. Score against all languages
  const scores: Record<string, number> = {};
  for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    scores[lang] = scoreText(normalized, patterns);
  }

  let bestLanguage: DetectedLanguage = 'unknown';
  let maxScore = 0;

  for (const [language, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestLanguage = language as DetectedLanguage;
    }
  }

  // Determine if it's actually code
  const minScore = normalized.length > 200 ? 5 : normalized.length > 100 ? 4 : normalized.length > 40 ? 3 : 2;
  const isCode = FENCE_PATTERN.test(normalized) || maxScore >= minScore;

  return {
    isCode,
    language: isCode ? bestLanguage : 'unknown',
    score: maxScore,
  };
}
