export type DetectedLanguage =
  | 'c'
  | 'cpp'
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'php'
  | 'ruby'
  | 'bash'
  | 'json'
  | 'sql'
  | 'css'
  | 'html'
  | 'yaml'
  | 'markdown'
  | 'unknown';

export interface CodeDetectionResult {
  isCode: boolean;
  language: DetectedLanguage;
  score: number;
}

export type ContentType = 'markdown' | 'code' | 'text';

export interface ContentDetectionResult {
  type: ContentType;
  isMarkdown: boolean;
  isCode: boolean;
  language: DetectedLanguage;
  score: number;
}

const LANGUAGE_PATTERNS: Partial<Record<DetectedLanguage, RegExp[]>> = {
  c: [
    /#include\s*<stdio\.h>/g,
    /#include\s*<stdlib\.h>/g,
    /#include\s*<string\.h>/g,
    /#include\s*<math\.h>/g,
    /#include\s*<stdbool\.h>/g,
    /#include\s*<stdint\.h>/g,
    /#include\s*<unistd\.h>/g,
    /#include\s*<time\.h>/g,
    /#include\s*<ctype\.h>/g,
    /\bprintf\s*\(/g,
    /\bscanf\s*\(/g,
    /\bmalloc\s*\(/g,
    /\bcalloc\s*\(/g,
    /\brealloc\s*\(/g,
    /\bfree\s*\(/g,
    /\bsizeof\s*\(/g,
    /\btypedef\s+struct\b/g,
    /\bstruct\s+[a-zA-Z0-9_]+\s*\{/g,
    /\bNULL\b/g,
    /\bint\s+main\s*\(/g,
  ],
  cpp: [
    /#include\s*<iostream>/g,
    /#include\s*<vector>/g,
    /#include\s*<string>/g,
    /#include\s*<map>/g,
    /#include\s*<set>/g,
    /#include\s*<algorithm>/g,
    /#include\s*<memory>/g,
    /\bstd::/g,
    /\bcout\b/g,
    /\bcin\b/g,
    /\bendl\b/g,
    /\bvector</g,
    /\bnamespace\b/g,
    /\busing\s+namespace\s+std/g,
    /\btemplate\s*</g,
    /\bclass\s+[a-zA-Z0-9_]+\s*\{/g,
    /\bnullptr\b/g,
    /\bnew\s+[a-zA-Z0-9_]+/g,
    /\bdelete\s+/g,
    /\bconstexpr\b/g,
  ],
  javascript: [
    /\bconsole\.log\b/g,
    /\bdocument\./g,
    /\bwindow\./g,
    /\bfunction\s+\w+/g,
    /=>/g,
    /\bexport\s+const\b/g,
    /\bimport\s+.*from\s+['"]/g,
    /\bsetTimeout\b/g,
    /\bconst\s+\w+\s*=/g,
  ],
  typescript: [
    /\binterface\s+\w+\s*\{/g,
    /\btype\s+\w+\s*=/g,
    /:\s*string\b/g,
    /:\s*number\b/g,
    /:\s*boolean\b/g,
    /\bexport\s+interface\b/g,
    /\bexport\s+type\b/g,
    / as \w+/g,
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
    /:\s*$/gm,
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
    /@[a-zA-Z_]+/g,
    /\battr_accessor\b/g,
  ],
  bash: [
    /^#!\/bin\/(?:bash|sh)/gm,
    /\becho\s+["']/g,
    /\bsudo\s+\w+/g,
    /\bchmod\s+[+0-9]/g,
    /\bnpm\s+(?:run|install|i|test)/g,
    /\bgit\s+(?:clone|commit|push|pull|checkout)/g,
    /\bexport\s+\w+=/g,
  ],
  sql: [
    /\bSELECT\s+.+\s+FROM\b/gi,
    /\bINSERT\s+INTO\b/gi,
    /\bUPDATE\s+\w+\s+SET\b/gi,
    /\bDELETE\s+FROM\b/gi,
    /\bCREATE\s+TABLE\b/gi,
    /\bWHERE\s+\w+\s*=/gi,
  ],
  json: [
    /^\s*\{[\s\S]*"[\w-]+"\s*:\s*[\s\S]*\}\s*$/,
    /^\s*\[[\s\S]*\{[\s\S]*\}[\s\S]*\]\s*$/,
  ],
};

const STRONG_SIGNALS: { pattern: RegExp; lang: Exclude<DetectedLanguage, 'unknown'> }[] = [
  { pattern: /#include\s*<iostream>/, lang: 'cpp' },
  { pattern: /\busing\s+namespace\s+std;/, lang: 'cpp' },
  { pattern: /\bstd::/, lang: 'cpp' },
  { pattern: /\bcout\s*<</, lang: 'cpp' },
  { pattern: /\bcin\s*>>/, lang: 'cpp' },
  { pattern: /#include\s*<stdio\.h>/, lang: 'c' },
  { pattern: /#include\s*<stdlib\.h>/, lang: 'c' },
  { pattern: /<\?php/, lang: 'php' },
  { pattern: /\bpublic\s+static\s+void\s+main/, lang: 'java' },
  { pattern: /\bSystem\.out\.print/, lang: 'java' },
  { pattern: /\busing\s+System;/, lang: 'csharp' },
  { pattern: /\bConsole\.WriteLine/, lang: 'csharp' },
  { pattern: /\bpackage\s+main\b/, lang: 'go' },
  { pattern: /\bfmt\.Print/, lang: 'go' },
  { pattern: /\bfn\s+main\s*\(/, lang: 'rust' },
  { pattern: /\bprintln!/, lang: 'rust' },
  { pattern: /^#!\/bin\/(?:bash|sh)/m, lang: 'bash' },
  { pattern: /^\s*def\s+\w+/m, lang: 'python' },
  { pattern: /\bconsole\.log\b/, lang: 'javascript' },
  { pattern: /\binterface\s+\w+\s*\{/, lang: 'typescript' },
  { pattern: /\bimport\s+java\./, lang: 'java' },
];

const countMatches = (text: string, pattern: RegExp) => {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
};

const scoreText = (text: string, patterns: RegExp[]) => {
  return patterns.reduce((score, pattern) => {
    const count = Math.min(countMatches(text, pattern), 5);
    return score + count;
  }, 0);
};

export const LANGUAGE_DISPLAY_NAMES: Record<DetectedLanguage, string> = {
  c: 'C',
  cpp: 'C++',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
  ruby: 'Ruby',
  bash: 'Bash / Shell',
  json: 'JSON',
  sql: 'SQL',
  css: 'CSS',
  html: 'HTML',
  yaml: 'YAML',
  markdown: 'Markdown',
  unknown: '',
};

export const normalizeLanguage = (lang: string | undefined): DetectedLanguage => {
  if (!lang) return 'unknown';
  const clean = lang.trim().toLowerCase();
  const map: Record<string, DetectedLanguage> = {
    c: 'c',
    h: 'c',
    cpp: 'cpp',
    'c++': 'cpp',
    cxx: 'cpp',
    cc: 'cpp',
    hpp: 'cpp',
    hxx: 'cpp',
    js: 'javascript',
    javascript: 'javascript',
    ts: 'typescript',
    typescript: 'typescript',
    tsx: 'typescript',
    jsx: 'javascript',
    py: 'python',
    python: 'python',
    csharp: 'csharp',
    'c#': 'csharp',
    cs: 'csharp',
    java: 'java',
    go: 'go',
    golang: 'go',
    rust: 'rust',
    rs: 'rust',
    php: 'php',
    ruby: 'ruby',
    rb: 'ruby',
    bash: 'bash',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    json: 'json',
    sql: 'sql',
    css: 'css',
    html: 'html',
    xml: 'html',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    markdown: 'markdown',
  };
  return map[clean] || 'unknown';
};

/**
 * Checks if a string contains genuine Markdown syntax patterns.
 * Designed strictly to prevent false positives on code files (Python, Bash, Shell) and plain text.
 */
export function isMarkdownContent(text: string): { isMarkdown: boolean; score: number } {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized || normalized.length < 5) {
    return { isMarkdown: false, score: 0 };
  }

  // Check if text looks like source code (C, C++, Python, JS, Go, Java, Rust, Shell, etc.)
  const hasCodeKeywords =
    /^\s*(?:#include\s*[<"]|import\s+[a-zA-Z0-9_]|from\s+[a-zA-Z0-9_.]+\s+import|def\s+[a-zA-Z0-9_]+\s*\(|class\s+[a-zA-Z0-9_]+|function\s+[a-zA-Z0-9_]+\s*\(|export\s+(?:const|function|class|default)|const\s+[a-zA-Z0-9_]+\s*=|let\s+[a-zA-Z0-9_]+\s*=|public\s+class|package\s+[a-zA-Z0-9_]+|using\s+System|fn\s+main|int\s+main\s*\()/m.test(
      normalized
    );

  let score = 0;
  let strongSignalsCount = 0;

  // 1. Markdown Table with delimiter row (| header | / |---|---|)
  const tableRegex = /^\|[^\r\n]+\|[\r\n]+\|(?:\s*:?-+:?\s*\|)+\s*$/m;
  if (tableRegex.test(normalized)) {
    score += 10;
    strongSignalsCount += 1;
  }

  // 2. Fenced Code Blocks embedded within prose (```lang ... ```)
  const fencedBlocks = normalized.match(/```[a-zA-Z0-9_-]*\n[\s\S]+?\n```/g);
  if (fencedBlocks) {
    const textWithoutFences = normalized.replace(/```[\s\S]*?```/g, '').trim();
    if (textWithoutFences.length >= 10) {
      score += 10;
      strongSignalsCount += 1;
    }
  }

  // 3. Task List checkboxes (- [ ] task or * [x] task)
  const taskListMatches = normalized.match(/^\s*[-*+]\s+\[[ xX]\]\s+\S.*$/gm);
  if (taskListMatches && taskListMatches.length >= 1) {
    score += taskListMatches.length * 4;
    strongSignalsCount += 1;
  }

  // 4. Markdown Headings (# Heading, ## Subheading)
  // ONLY count if the document is NOT a pure source code file with '#' comments
  if (!hasCodeKeywords) {
    const headingMatches = normalized.match(/^#{1,6}\s+[a-zA-Z0-9\u00C0-\u017F][^\n]*$/gm);
    if (headingMatches) {
      score += headingMatches.length * 3;
      strongSignalsCount += 1;
    }
  }

  // 5. Valid Markdown Links ([text](https://...))
  const linkMatches = normalized.match(/\[[^\]\r\n]{1,80}\]\((?:https?:\/\/|\/|mailto:)[^\s)]+\)/g);
  if (linkMatches) {
    score += linkMatches.length * 4;
    strongSignalsCount += 1;
  }

  // 6. Multi-item Lists (At least 3 distinct list lines starting with - , * , or 1. )
  if (!hasCodeKeywords) {
    const listItems = normalized.match(/^\s*(?:[-*+]|\d+\.)\s+[a-zA-Z0-9\u00C0-\u017F].*$/gm);
    if (listItems && listItems.length >= 3) {
      score += Math.min(listItems.length, 5) * 2;
      strongSignalsCount += 1;
    }
  }

  // 7. Markdown Blockquote (> Quote)
  if (!hasCodeKeywords) {
    const blockquoteMatches = normalized.match(/^>\s+[a-zA-Z0-9\u00C0-\u017F].*$/gm);
    if (blockquoteMatches && blockquoteMatches.length >= 2) {
      score += 4;
      strongSignalsCount += 1;
    }
  }

  // 8. Bold text (**bold**)
  const boldMatches = normalized.match(/\*\*[a-zA-Z0-9\u00C0-\u017F][^*]{1,50}[a-zA-Z0-9\u00C0-\u017F]\*\*/g);
  if (boldMatches && !hasCodeKeywords) {
    score += Math.min(boldMatches.length, 3) * 2;
  }

  // Strict Threshold:
  // Requires either score >= 8 OR at least 2 distinct strong markdown signals
  const isMarkdown = score >= 8 || strongSignalsCount >= 2;

  return {
    isMarkdown,
    score,
  };
}

const contentCache = new Map<string, ContentDetectionResult>();
const MAX_CACHE_SIZE = 100;

/**
 * Detects whether content is pure code, Markdown, or plain text.
 */
export function detectContentType(text: string): ContentDetectionResult {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return { type: 'text', isMarkdown: false, isCode: false, language: 'unknown', score: 0 };
  }

  if (contentCache.has(normalized)) {
    return contentCache.get(normalized)!;
  }

  const compute = (): ContentDetectionResult => {
    // 1. Check if the text is entirely a single fenced code block (e.g. ```python\ndef foo():\n```)
    const singleFenceMatch = normalized.match(/^```([^\s\n]*)\n([\s\S]*?)\n?```$/);
    if (singleFenceMatch) {
      const rawLang = singleFenceMatch[1];
      const mapped = normalizeLanguage(rawLang);
      return {
        type: 'code',
        isMarkdown: false,
        isCode: true,
        language: mapped,
        score: 100,
      };
    }

    // 2. Check for Code Block detection
    const codeResult = detectCodeBlock(normalized);

    // 3. Check for structural Markdown indicators
    const hasFencedBlocks = /```[a-zA-Z0-9_-]*\n[\s\S]+?\n```/.test(normalized);
    const hasMarkdownTables = /^\|[^\r\n]+\|[\r\n]+\|(?:\s*:?-+:?\s*\|)+\s*$/m.test(normalized);
    const hasTaskLists = /^\s*[-*+]\s+\[[ xX]\]\s+\S/m.test(normalized);

    // If code signals dominate and there are NO mixed fenced blocks or markdown tables/tasklists, classify as CODE
    if (codeResult.isCode && codeResult.score >= 2 && !hasFencedBlocks && !hasMarkdownTables && !hasTaskLists) {
      return {
        type: 'code',
        isMarkdown: false,
        isCode: true,
        language: codeResult.language,
        score: codeResult.score,
      };
    }

    const markdownCheck = isMarkdownContent(normalized);

    // 4. If it meets genuine Markdown criteria:
    if (markdownCheck.isMarkdown) {
      return {
        type: 'markdown',
        isMarkdown: true,
        isCode: false,
        language: 'markdown',
        score: markdownCheck.score,
      };
    }

    // 5. If code signals exist at all:
    if (codeResult.isCode) {
      return {
        type: 'code',
        isMarkdown: false,
        isCode: true,
        language: codeResult.language,
        score: codeResult.score,
      };
    }

    // 6. Default to plain text
    return {
      type: 'text',
      isMarkdown: false,
      isCode: false,
      language: 'unknown',
      score: 0,
    };
  };

  const result = compute();

  if (contentCache.size >= MAX_CACHE_SIZE) {
    const firstKey = contentCache.keys().next().value;
    if (firstKey !== undefined) {
      contentCache.delete(firstKey);
    }
  }
  contentCache.set(normalized, result);

  return result;
}

/**
 * Retained for backwards compatibility across existing components.
 */
export function detectCodeBlock(text: string): CodeDetectionResult {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return { isCode: false, language: 'unknown', score: 0 };
  }

  // 1. Check for markdown code fences (e.g. ```python)
  const fenceMatch = normalized.match(/^```([^\s]+)/);
  if (fenceMatch && fenceMatch[1]) {
    const mappedLang = normalizeLanguage(fenceMatch[1]);
    if (mappedLang !== 'unknown') {
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
    if (patterns) {
      scores[lang] = scoreText(normalized, patterns);
    }
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
  const isCode = /```/.test(normalized) || maxScore >= minScore;

  // Refine C vs C++ disambiguation
  if (isCode && (bestLanguage === 'c' || bestLanguage === 'cpp')) {
    const isDefinitiveCpp = /\b(?:std::|cout|cin|endl|namespace\s+\w+|template\s*<|nullptr|constexpr|virtual\s+\w+|class\s+[a-zA-Z0-9_]+\s*\{|public:|private:|protected:|#include\s*<iostream>|#include\s*<vector>|#include\s*<string>|#include\s*<map>|#include\s*<set>|#include\s*<algorithm>)/.test(normalized);

    const isDefinitiveC = /\b(?:printf\s*\(|scanf\s*\(|malloc\s*\(|calloc\s*\(|realloc\s*\(|free\s*\(|typedef\s+struct|#include\s*<stdio\.h>|#include\s*<stdlib\.h>|#include\s*<string\.h>|#include\s*<stdbool\.h>|#include\s*<stdint\.h>|#include\s*<unistd\.h>)/.test(normalized);

    if (isDefinitiveCpp) {
      bestLanguage = 'cpp';
    } else if (isDefinitiveC) {
      bestLanguage = 'c';
    }
  }

  return {
    isCode,
    language: isCode ? bestLanguage : 'unknown',
    score: maxScore,
  };
}

