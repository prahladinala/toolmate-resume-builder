/**
 * Specialized Prompt Engineering Templates for Chrome Gemini Nano
 * Formats inputs into bounded, structured prompts with strict anti-hallucination rules.
 */

export type ContextualActionType =
  | "improve"
  | "strengthen_verbs"
  | "make_concise"
  | "quantify_impact"
  | "executive_tone"
  | "fix_grammar"
  | "simplify";

export interface ContextualPromptConfig {
  action: ContextualActionType;
  sectionType:
    "summary" | "experience" | "project" | "skills" | "education" | "general";
  currentText: string;
}

export function buildContextualRewritePrompt(
  config: ContextualPromptConfig,
): string {
  const { action, sectionType, currentText } = config;

  let actionInstruction = "";
  switch (action) {
    case "strengthen_verbs":
      actionInstruction =
        "Replace passive language with high-power action verbs (e.g. Architected, Spearheaded, Optimized, Overhauled) at the beginning of each statement.";
      break;
    case "make_concise":
      actionInstruction =
        "Remove unnecessary filler words, preambles, and redundancies. Keep each option punchy, clear, and under 25 words.";
      break;
    case "quantify_impact":
      actionInstruction =
        "Structure using the Action-Context-Result method. Frame the outcome with placeholder metrics like [X%] or [N hours saved] only if applicable to the existing description. Do not invent fictitious numbers.";
      break;
    case "executive_tone":
      actionInstruction =
        "Elevate to an executive/senior tone highlighting technical ownership, strategic alignment, and cross-functional leadership.";
      break;
    case "fix_grammar":
      actionInstruction =
        "Correct all grammatical inconsistencies, tense mismatches, and punctuation while preserving the exact technical meaning.";
      break;
    case "simplify":
      actionInstruction =
        "Rewrite in crisp, accessible language removing jargon and overly convoluted sentence structures.";
      break;
    default:
      actionInstruction =
        "Rewrite for maximum ATS scan score, clarity, and recruiter appeal.";
      break;
  }

  return `You are an expert ATS resume writing assistant for ${sectionType} content.

GOAL: ${actionInstruction}

STRICT ANTI-HALLUCINATION RULES:
1. Preserve the candidate's actual responsibilities, tools, and roles exactly.
2. DO NOT fabricate companies, degrees, unmentioned certifications, or unverified facts.
3. DO NOT output conversational filler like "Sure, here are your options" or "Let me know if you need more".
4. Output EXACTLY 3 numbered options followed by an Explanation in this structure:

**Option 1 (Direct Polish):**
<polished version staying closest to original text>

**Option 2 (Dynamic & Action-Driven):**
<rephrased with powerful verbs and strong initiative>

**Option 3 (High-Impact & Strategic):**
<elevated version emphasizing value delivered and technical ownership>

**Explanation:**
* What Changed: <1-2 sentences on key vocabulary and structural improvements>

INPUT TEXT:
"${currentText.trim()}"`;
}

export interface AchievementDiscoveryContext {
  originalBullet: string;
  problemSolved: string;
  toolsUsed: string;
  verifiedMetric?: string;
}

export function buildAchievementSynthesisPrompt(
  ctx: AchievementDiscoveryContext,
): string {
  const metricNote = ctx.verifiedMetric?.trim()
    ? `VERIFIED USER METRIC: "${ctx.verifiedMetric.trim()}" (Integrate this exact metric directly into the accomplishment).`
    : `NO METRIC PROVIDED: Frame the impact around qualitative outcomes (e.g. improved reliability, reduced manual toil, seamless deployment). DO NOT invent fake numbers.`;

  return `You are a Principal Technical Resume Coach specializing in evidence-based STAR accomplishments.

USER'S RAW DRAFT:
"${ctx.originalBullet}"

USER'S VERIFIED CONTEXT:
- Problem Solved: "${ctx.problemSolved}"
- Tools & Approach: "${ctx.toolsUsed}"
- ${metricNote}

TASK:
Synthesize this real user context into 3 distinct, verified bullet points ready for a top-tier tech resume.

RULES:
- Start every bullet with a strong past-tense action verb (or present tense if current).
- Integrate the provided tools and problem-solving facts accurately.
- DO NOT invent any facts or metrics not mentioned by the user.
- Format output as:

**Option 1 (Results-Focused):**
<bullet point highlighting the outcome>

**Option 2 (Engineering & Implementation Focused):**
<bullet point highlighting architectural tools and execution>

**Option 3 (Balanced STAR Summary):**
<comprehensive bullet point capturing Situation, Task, Action, and Result>

**Explanation:**
* Key Improvements: <brief note on how this strengthens the candidate's candidacy>`;
}
