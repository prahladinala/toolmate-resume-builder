export interface WeakVerbMatch {
  phrase: string;
  suggestions: string[];
}

export const WEAK_VERB_MAP: Record<string, string[]> = {
  "worked on": [
    "Architected",
    "Engineered",
    "Developed",
    "Spearheaded",
    "Constructed",
  ],
  "responsible for": ["Led", "Orchestrated", "Oversaw", "Directed", "Executed"],
  "helped with": [
    "Collaborated on",
    "Facilitated",
    "Accelerated",
    "Contributed to",
    "Co-engineered",
  ],
  "assisted in": [
    "Partnered with",
    "Enabled",
    "Facilitated",
    "Streamlined",
    "Supported",
  ],
  handled: ["Managed", "Administered", "Executed", "Resolved", "Orchestrated"],
  "participated in": [
    "Contributed to",
    "Steered",
    "Co-authored",
    "Implemented",
  ],
  "tasked with": [
    "Appointed to",
    "Mandated to",
    "Assigned to lead",
    "Designated to develop",
  ],
  "involved in": ["Spearheaded", "Executed", "Drove", "Mobilized"],
  did: ["Executed", "Accomplished", "Produced", "Delivered"],
  made: ["Built", "Engineered", "Created", "Authored", "Established"],
  "was in charge of": ["Led", "Directed", "Governed", "Captained", "Oversaw"],
  "tried to": ["Pioneered", "Experimented with", "Piloted", "Iterated on"],
};

/**
 * Scans a text string for weak action verbs and returns occurrences with strong ATS alternatives.
 */
export function detectWeakActionVerbs(text: string): WeakVerbMatch[] {
  if (!text) return [];

  const matches: WeakVerbMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const [weakPhrase, suggestions] of Object.entries(WEAK_VERB_MAP)) {
    // Regex for word boundary matching
    const regex = new RegExp(`\\b${weakPhrase}\\b`, "i");
    if (regex.test(lowerText)) {
      matches.push({
        phrase: weakPhrase,
        suggestions,
      });
    }
  }

  return matches;
}

/**
 * Replaces a weak phrase with a chosen strong action verb, preserving capitalization.
 */
export function replaceWeakVerb(
  text: string,
  weakPhrase: string,
  strongVerb: string,
): string {
  const regex = new RegExp(`\\b${weakPhrase}\\b`, "i");
  return text.replace(regex, strongVerb);
}
