export interface AIOption {
  id: string;
  title: string;
  focus: string;
  text: string;
  isRecommended: boolean;
}

export interface AIParsedResult {
  options: AIOption[];
  recommendedIndex: number;
  explanation?: string;
  originalText?: string;
}

/**
 * Cleans markdown quotes, stray labels, and surrounding punctuation from a candidate text.
 */
function cleanCandidateText(raw: string, preserveParagraphs = false): string {
  let text = raw.trim();

  // If preserveParagraphs is enabled or content looks like a multi-paragraph cover letter
  if (
    preserveParagraphs ||
    /dear\s+/i.test(raw) ||
    (raw.match(/\n\s*\n/g) || []).length >= 2
  ) {
    text = text
      .split("\n")
      .map((line) => line.replace(/^\s*>\s*/, ""))
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
  } else {
    // Single-bullet mode: join into a single concise line
    text = text
      .split("\n")
      .map((line) => line.replace(/^\s*>\s*/, "").trim())
      .filter(Boolean)
      .join(" ");
  }

  // Remove leading leftover asterisks, colons, or dashes before text
  text = text.replace(/^(\*{1,2}|_{1,2}|:|\s)+/, "");
  // Remove leading option prefixes if any
  text = text.replace(/^Option\s*\d+\s*(\([^)]*\))?:?\s*/i, "");
  // Remove leading bold labels like **Rewrite:**
  text = text.replace(/^\*\*[^*]+:\*\*\s*/i, "");
  // Strip trailing asterisks or underscores
  text = text.replace(/(\*{1,2}|_{1,2}|\s)+$/, "");
  // Remove wrapping quotes
  text = text.replace(/^["'“](.*)["'”]$/, "$1");

  return text.trim();
}

/**
 * Parses raw Gemini Nano output into clean, structured ATS options and explanations.
 */
export function parseAIResponse(
  rawResponse: string,
  originalText?: string,
  preserveParagraphs = false,
): AIParsedResult {
  if (!rawResponse || !rawResponse.trim()) {
    return {
      options: [],
      recommendedIndex: 0,
      originalText,
    };
  }

  // 1. Separate Explanation section if present
  let optionsPart = rawResponse;
  let explanationPart = "";

  const explanationMatch = rawResponse.match(
    /(?:\*{0,2}(?:Explanation|Why this works|Why this was optimized|ATS Insights)\*{0,2}:?\*{0,2})([\s\S]*)/i,
  );

  if (explanationMatch) {
    explanationPart = explanationMatch[1].trim();
    // Clean any leading asterisks or colons leaving markdown bullets intact
    explanationPart = explanationPart
      .replace(/^(\*{2}:?\*{0,2}\s*)+/, "")
      .trim();
    optionsPart = rawResponse.substring(0, explanationMatch.index).trim();
  }

  // 2. Extract options (e.g. "**Option 1 (Focus on Improvement):**", "Option 2:", etc.)
  const optionRegex =
    /(?:\*{0,2}Option\s*(\d+|[A-Z])\s*(?:\(([^)]+)\))?\*{0,2}:?\*{0,2})([\s\S]*?)(?=(?:\*{0,2}Option\s*(?:\d+|[A-Z])|\*{0,2}Explanation|###|$))/gi;

  const matches = [...optionsPart.matchAll(optionRegex)];
  const options: AIOption[] = [];

  if (matches.length > 0) {
    matches.forEach((match, index) => {
      const optNum = match[1] || `${index + 1}`;
      const focusRaw = match[2] ? match[2].trim() : "";
      const bodyRaw = match[3] || "";
      const cleanText = cleanCandidateText(bodyRaw, preserveParagraphs);

      if (cleanText) {
        let focus = focusRaw;
        if (!focus) {
          if (index === 0) focus = "Clear & Concise";
          else if (index === 1) focus = "Action & Expertise";
          else focus = "High Impact & Metrics";
        }

        // Clean up common focus phrases
        focus = focus.replace(/^focus on\s+/i, "");
        if (/significant improvement/i.test(focus)) {
          focus = "High Impact & Metrics";
        }
        if (focus) {
          focus = focus.charAt(0).toUpperCase() + focus.slice(1);
        }

        options.push({
          id: `opt-${optNum}-${index}`,
          title: `Option ${optNum}`,
          focus,
          text: cleanText,
          isRecommended: false,
        });
      }
    });
  }

  // Fallback: If no structured "Option X" matches, try numbered list "1. ... 2. ..."
  if (options.length === 0) {
    const numberedRegex =
      /(?:^|\n)\s*(\d+)\.\s+(?:\(([^)]+)\)\s*)?([^\n]+(?:\n(?!\d+\.)[^\n]+)*)/g;
    const numMatches = [...optionsPart.matchAll(numberedRegex)];

    if (numMatches.length >= 2) {
      numMatches.forEach((m, idx) => {
        const num = m[1];
        const focus = m[2]
          ? m[2].trim()
          : idx === 0
            ? "Direct"
            : idx === 1
              ? "Expertise"
              : "Impact";
        const cleanText = cleanCandidateText(m[3], preserveParagraphs);
        if (cleanText) {
          options.push({
            id: `opt-${num}-${idx}`,
            title: `Option ${num}`,
            focus: focus.charAt(0).toUpperCase() + focus.slice(1),
            text: cleanText,
            isRecommended: false,
          });
        }
      });
    }
  }

  // Fallback: If still no options, treat the cleaned whole text as a single option
  if (options.length === 0) {
    const singleText = cleanCandidateText(optionsPart, preserveParagraphs);
    if (singleText) {
      options.push({
        id: "opt-1-single",
        title: "Recommended Option",
        focus: "ATS Optimized",
        text: singleText,
        isRecommended: true,
      });
    }
  }

  // 3. Determine the best / recommended option
  let bestIndex = 0;

  if (options.length > 0) {
    // Look for option with numbers/percentages (metrics) or keywords
    const metricIndex = options.findIndex((o) =>
      /\b\d+%\b|\b\d+x\b|\b\$\d+|\breduced by|\bincreased by|\bimproved by/i.test(
        o.text,
      ),
    );

    const explicitRecIndex = options.findIndex((o) =>
      /recommended|significant|high impact|metrics/i.test(o.focus),
    );

    if (metricIndex !== -1) {
      bestIndex = metricIndex;
    } else if (explicitRecIndex !== -1) {
      bestIndex = explicitRecIndex;
    } else if (options.length >= 3) {
      bestIndex = 2; // Option 3 is high impact
    } else if (options.length >= 2) {
      bestIndex = 1;
    }

    options[bestIndex].isRecommended = true;
  }

  return {
    options,
    recommendedIndex: bestIndex,
    explanation: explanationPart,
    originalText,
  };
}
