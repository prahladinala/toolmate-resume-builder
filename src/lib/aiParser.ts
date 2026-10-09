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

  // Strip sub-explanation if included inside option block
  text = text.replace(/(?:\*{0,2}Explanation\*{0,2}:?[\s\S]*)/i, "").trim();

  // Strip any bot conversational remarks at beginning of option
  text = text.replace(
    /^(?:Okay|Sure|Certainly|Here is|Here are)[^.\n]*[.:]\s*/i,
    "",
  );

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
  text = text.replace(/^(\*{1,2}|_{1,2}|:|\s|>)+/, "");
  // Remove leading option prefixes if any
  text = text.replace(/^Option\s*\d+\s*(\([^)]*\))?:?\s*/i, "");
  // Remove leading bold labels like **Rewrite:**
  text = text.replace(/^\*\*[^*]+:\*\*\s*/i, "");
  // Strip trailing asterisks or underscores
  text = text.replace(/(\*{1,2}|_{1,2}|\s|>)+$/, "");
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

  // Strip conversational closing like "I am ready for another segment..."
  const cleanedRaw = rawResponse
    .replace(
      /(?:I am ready for another|Let me know if you|Feel free to ask|Hope this helps)[\s\S]*$/i,
      "",
    )
    .trim();

  // Match Option headers: e.g. "*Option 1 (Focus on Improvement):**", "**Option 1:**", "### Option 1", "Option 1:"
  const optionHeaderRegex =
    /(?:^|\n)\s*(?:\*{1,2}|#{1,4}\s*)?Option\s*(\d+|[A-Z])\s*(?:\(([^)]+)\))?\s*(?:\*{1,2})?:?\s*(?:\*{1,2})?/gi;

  const matches = [...cleanedRaw.matchAll(optionHeaderRegex)];
  const options: AIOption[] = [];
  let explanationPart = "";

  if (matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    const lastMatchEndIndex = lastMatch.index + lastMatch[0].length;
    const lastSection = cleanedRaw.substring(lastMatchEndIndex);

    const takeawayMatch = lastSection.match(
      /(?:\*{0,2}(?:Key Takeaways|Overall Explanation|Explanation for ATS|ATS Insights|Why this works)\*{0,2}:?\*{0,2})([\s\S]*)/i,
    );

    if (takeawayMatch) {
      explanationPart = takeawayMatch[1].trim();
      explanationPart = explanationPart
        .replace(/^(?:for ATS Optimization:?\*{0,2}|\*{1,2}|:\*{0,2}|\s)+/i, "")
        .trim();
    }

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const optNum = match[1] || `${i + 1}`;
      let focusRaw = match[2] ? match[2].trim() : "";
      let isOptionRecommended = false;

      if (/recommended/i.test(focusRaw)) {
        isOptionRecommended = true;
        focusRaw = focusRaw.replace(/[\s-–—]*recommended[\s]*/i, "").trim();
      }

      const startIdx = match.index + match[0].length;
      let endIdx = cleanedRaw.length;

      if (i + 1 < matches.length) {
        endIdx = matches[i + 1].index;
      } else if (takeawayMatch && takeawayMatch.index !== undefined) {
        endIdx = lastMatchEndIndex + takeawayMatch.index;
      }

      const bodyChunk = cleanedRaw.substring(startIdx, endIdx).trim();

      // If bodyChunk has an embedded "*Explanation: ...", extract it if we don't have explanation yet
      const subExpMatch = bodyChunk.match(
        /(?:\*{0,2}Explanation\*{0,2}:?\*{0,2})([\s\S]*)/i,
      );
      if (subExpMatch && !explanationPart) {
        const subExpText = subExpMatch[1]
          .replace(/(\*{1,2}|_{1,2}|\s|>)+$/, "")
          .trim();
        if (subExpText) {
          explanationPart =
            (explanationPart ? explanationPart + "\n" : "") + subExpText;
        }
      }

      const cleanText = cleanCandidateText(bodyChunk, preserveParagraphs);

      // Verify that this is not bot preamble
      if (
        cleanText &&
        !cleanText.toLowerCase().startsWith("okay, i'm ready") &&
        !cleanText.toLowerCase().startsWith("here's the original")
      ) {
        let focus = focusRaw;
        if (!focus) {
          if (i === 0) focus = "Clear & Concise";
          else if (i === 1) focus = "Action & Expertise";
          else focus = "High Impact & Metrics";
        }

        focus = focus.replace(/^focus on\s+/i, "");
        if (/significant improvement/i.test(focus)) {
          focus = "High Impact & Metrics";
        }
        if (focus) {
          focus = focus.charAt(0).toUpperCase() + focus.slice(1);
        }

        options.push({
          id: `opt-${optNum}-${i}`,
          title: `Option ${optNum}`,
          focus,
          text: cleanText,
          isRecommended: isOptionRecommended,
        });
      }
    }
  }

  // Fallback: If no structured "Option X" matches, try numbered list "1. ... 2. ..."
  if (options.length === 0) {
    const numberedRegex =
      /(?:^|\n)\s*(\d+)\.\s+(?:\(([^)]+)\)\s*)?([^\n]+(?:\n(?!\d+\.)[^\n]+)*)/g;
    const numMatches = [...cleanedRaw.matchAll(numberedRegex)];

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
        if (
          cleanText &&
          !cleanText.toLowerCase().startsWith("okay, i'm ready")
        ) {
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
    let singleText = cleanCandidateText(cleanedRaw, preserveParagraphs);
    singleText = singleText
      .replace(
        /^[\s\S]*?(?:Here(?:'s| is) (?:a|the) (?:rewrite|version|text):?|Here are \d+ (?:options|alternatives):?)/i,
        "",
      )
      .trim();

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

  // Determine best index
  let bestIndex = 0;
  if (options.length > 0) {
    const explicitRecIndex = options.findIndex(
      (o) => o.isRecommended || /recommended/i.test(o.focus),
    );
    const metricIndex = options.findIndex((o) =>
      /\b\d+%\b|\b\d+x\b|\b\$\d+|\breduced by|\bincreased by/i.test(o.text),
    );

    if (explicitRecIndex !== -1) {
      bestIndex = explicitRecIndex;
    } else if (metricIndex !== -1) {
      bestIndex = metricIndex;
    } else if (options.length >= 3) {
      bestIndex = 2;
    } else if (options.length >= 2) {
      bestIndex = 1;
    }

    options.forEach((o, idx) => {
      o.isRecommended = idx === bestIndex;
    });
  }

  return {
    options,
    recommendedIndex: bestIndex,
    explanation: explanationPart,
    originalText,
  };
}
