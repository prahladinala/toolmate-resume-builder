/* eslint-disable @typescript-eslint/no-explicit-any */
import { runChromeAIPrompt, checkChromeAIAvailability } from "./chromeAI";
import type { ResumeData } from "@/types/resume";

export interface CodeSnippet {
  language: string;
  code: string;
  explanation: string;
}

export interface InterviewQuestion {
  id: string;
  category: "technical" | "behavioral" | "situational" | "system-design";
  topic: string;
  difficulty: "Junior" | "Mid-Level" | "Senior" | "Staff / Lead";
  question: string;
  context: string;
  suggestedAnswerPoints: string[];
  fullAnswer: string;
  codeSnippet?: CodeSnippet;
}

/**
 * Curated knowledge base of interview questions, comprehensive answers,
 * and verified code solutions for key technical skills and behavioral categories.
 */
export const CURATED_SKILL_QUESTIONS: Record<string, InterviewQuestion[]> = {
  react: [
    {
      id: "react-1",
      category: "technical",
      topic: "React Reconciliation & Virtual DOM",
      difficulty: "Senior",
      question:
        "How does React's Reconciliation and Fiber architecture work, and how do keys prevent unnecessary DOM re-renders?",
      context:
        "Evaluates core React internals, rendering performance bottlenecks, and fiber work-loop understanding.",
      suggestedAnswerPoints: [
        "Fiber is an incremental rendering engine that breaks work into units of work that can be paused, resumed, or aborted.",
        "React uses a heuristic O(n) diffing algorithm comparing element types and unique keys.",
        "Keys allow React to match fiber nodes between commits, preventing re-mounts and state loss in lists.",
      ],
      fullAnswer: `React Reconciliation is the algorithm React uses to diff the tree of elements to determine which parts of the real DOM need to be updated.

1. **The Fiber Architecture:**
Prior to React 16, reconciliation was synchronous (the Stack Reconciler), meaning large component trees could block the main thread and drop frames. Fiber introduced a linked-list data structure representing units of work. It splits rendering into two phases:
- **Render Phase (Asynchronous / Interruptible):** Builds the work-in-progress fiber tree, computes effects, and can pause or yield to the browser for high-priority tasks (e.g. user input, animations).
- **Commit Phase (Synchronous / Uninterruptible):** Flushes all DOM mutations to the browser in one shot.

2. **The Role of 'key':**
When children change, React iterates over both lists of children simultaneously. Without keys, if an item is prepended to the start of a list, React mutates every single child. With stable keys, React maps existing fibers by key and reorders DOM nodes rather than destroying and recreating them. Never use array index as a key for dynamic lists where order or items can change.`,
      codeSnippet: {
        language: "tsx",
        code: `// Optimal List Rendering with Stable Keys and Memoization
import React, { memo } from "react";

interface Item {
  id: string; // Stable UUID or DB Primary Key
  title: string;
}

// Prevent re-rendering unchanged children
const ListItem = memo(function ListItem({ item }: { item: Item }) {
  return <li className="py-2 px-3 hover:bg-zinc-100">{item.title}</li>;
});

export function UserList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map((item) => (
        // Key MUST be unique and stable across re-renders
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
}`,
        explanation:
          "Using item.id as the key allows React Fiber to identify exactly which node moved, changed, or unmounted, eliminating redundant tree reconciliations.",
      },
    },
    {
      id: "react-2",
      category: "technical",
      topic: "React Hooks & Closures",
      difficulty: "Mid-Level",
      question:
        "What causes stale closures in React hooks like useEffect or useCallback, and how do you resolve them?",
      context:
        "Tests familiarity with JavaScript lexical closures, hook dependency arrays, and reference stability.",
      suggestedAnswerPoints: [
        "A stale closure occurs when a hook captures variables from an earlier render pass that are not updated because dependencies were omitted.",
        "Always list all reactive values inside dependency arrays.",
        "Use functional state updaters (e.g. setCount(c => c + 1)) or useRef for mutable values without re-subscribing.",
      ],
      fullAnswer: `In JavaScript, functions retain access to variables in their lexical scope at creation time. In React, every render creates a fresh set of local variables and state.

If a \`useEffect\`, \`useCallback\`, or asynchronous timer/promise callback references state or props without declaring them in the dependency array, it closes over the values from the initial render. When state changes on subsequent renders, the callback still references the original, 'stale' value.

**Solutions:**
1. **Exhaustive Dependencies:** Always include every referenced state and prop in the hook's dependency array.
2. **Functional State Updaters:** When updating state based on previous state, pass a callback \`setState(prev => prev + 1)\` instead of referencing the outer state.
3. **useRef for Event Listeners / Subscriptions:** Store the latest callback in a ref \`savedCallback.current = fn\` so long-lived listeners always invoke the fresh function.`,
      codeSnippet: {
        language: "tsx",
        code: `import { useState, useEffect } from "react";

export function CounterTimer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Stale closure if written as: setCount(count + 1) with [] deps
    const timer = setInterval(() => {
      // Functional updater guarantees access to the latest state:
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Safe empty dependency array because setCount is functionally updated

  return <div>Timer Count: {count}</div>;
}`,
        explanation:
          "By passing a callback function `(prevCount) => prevCount + 1` to `setCount`, the interval callback never needs to capture the outer `count` variable, avoiding stale closures.",
      },
    },
  ],

  typescript: [
    {
      id: "ts-1",
      category: "technical",
      topic: "TypeScript Advanced Generics & Utility Types",
      difficulty: "Senior",
      question:
        "How do conditional types, distributive types, and the 'infer' keyword work in TypeScript? Give a practical example.",
      context:
        "Tests mastery of TypeScript's type system, type-level programming, and writing robust library-grade typings.",
      suggestedAnswerPoints: [
        "Conditional types follow the ternary syntax: T extends U ? X : Y.",
        "When applied to naked type parameters, conditional types distribute across union types.",
        "The 'infer' keyword introduces a type variable within the conditional check to extract sub-types dynamically.",
      ],
      fullAnswer: `TypeScript conditional types provide type-level branching logic: \`T extends U ? X : Y\`.

1. **Distributive Property:**
When the checked type is a naked type parameter and provided with a union (e.g. \`string | number\`), TypeScript automatically distributes the evaluation across each member of the union: \`(string extends U ? ...) | (number extends U ? ...)\`.

2. **The 'infer' Keyword:**
\`infer\` acts as a pattern-matching variable inside the \`extends\` clause. It extracts nested types from promises, functions, or arrays without having to define manual mappings. Standard utilities like \`ReturnType<T>\`, \`Parameters<T>\`, and \`Awaited<T>\` are built using \`infer\`.`,
      codeSnippet: {
        language: "typescript",
        code: `// Unwrapping the resolved value of an asynchronous API response
type UnwrapPromise<T> = T extends Promise<infer R> ? UnwrapPromise<R> : T;

// Practical API function
async function fetchUserProfile() {
  return { id: 101, username: "dev_pro", role: "admin" as const };
}

// Extracts { id: number; username: string; role: "admin" }
type UserProfile = UnwrapPromise<ReturnType<typeof fetchUserProfile>>;

// Extracting array element types:
type ElementOf<T> = T extends (infer E)[] ? E : never;
type StringList = ElementOf<string[]>; // string`,
        explanation:
          "The `infer R` keyword extracts the inner generic argument of the Promise type recursively until a non-promise type is reached.",
      },
    },
  ],

  nextjs: [
    {
      id: "next-1",
      category: "technical",
      topic: "Next.js App Router (RSC vs Client Components)",
      difficulty: "Senior",
      question:
        "Explain the difference between React Server Components (RSC) and Client Components in Next.js. How do you optimize data fetching and avoid bundle bloat?",
      context:
        "Tests understanding of Next.js 13+ App Router, serialization boundaries, server-side caching, and bundle optimization.",
      suggestedAnswerPoints: [
        "Server Components render strictly on the server and send zero JavaScript to the browser.",
        "Client Components ('use client') run on both server (SSR for initial HTML) and hydrate on the browser.",
        "Push 'use client' directives as far down the component leaf tree as possible.",
        "Fetch data directly in Server Components using async/await without exposing secrets or heavy libraries to client bundles.",
      ],
      fullAnswer: `Next.js App Router is built on React Server Components:

1. **React Server Components (Default):**
- Execute exclusively on the server.
- Have direct access to backend resources (databases, filesystem, private env tokens).
- Dependencies and packages (like database drivers, markdown parsers, heavy date libraries) are never bundled into the client JavaScript payload, reducing First Load JS dramatically.
- Cannot use browser APIs, event listeners (\`onClick\`), or React state/effects (\`useState\`, \`useEffect\`).

2. **Client Components ('use client'):**
- Prerender on the server for fast initial HTML, then hydrate in the browser to provide interactivity, state, and browser event handling.
- Boundary rule: props passed from a Server Component to a Client Component must be serializable (JSON-compatible).

3. **Optimization Strategy:**
Keep leaves of the tree as Client Components (e.g. interactive buttons, forms, search inputs) while keeping layout, data fetching, and large content containers as Server Components.`,
      codeSnippet: {
        language: "tsx",
        code: `// app/users/page.tsx (Server Component - Zero client bundle cost)
import { db } from "@/lib/db";
import { UserAvatarClient } from "./UserAvatarClient"; // 'use client' leaf

export default async function UsersPage() {
  // Direct DB query on server - no API route needed
  const users = await db.query("SELECT id, name, email FROM users LIMIT 10");

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Team Directory</h1>
      <ul className="divide-y mt-4">
        {users.map((u) => (
          <li key={u.id} className="py-3 flex items-center justify-between">
            <span>{u.name} ({u.email})</span>
            {/* Interactive client component only where needed */}
            <UserAvatarClient userId={u.id} />
          </li>
        ))}
      </ul>
    </main>
  );
}`,
        explanation:
          "Data fetching happens directly in the Server Component without exposing database credentials, while interactive UI is delegated to small Client Component leaves.",
      },
    },
  ],

  nodejs: [
    {
      id: "node-1",
      category: "technical",
      topic: "Node.js Event Loop & Asynchronous I/O",
      difficulty: "Senior",
      question:
        "Walk through the phases of the Node.js Event Loop (Timers, Poll, Check) and explain how process.nextTick and setImmediate differ.",
      context:
        "Evaluates concurrency model, libuv understanding, microtasks, and diagnosing main-thread blocking.",
      suggestedAnswerPoints: [
        "The event loop orchestrates non-blocking I/O via libuv across phases: Timers, Pending Callbacks, Idle/Prepare, Poll, Check, and Close.",
        "Poll phase executes I/O callbacks; Check phase executes setImmediate().",
        "process.nextTick() executes immediately after the current operation before the event loop advances to the next phase.",
      ],
      fullAnswer: `Node.js runs single-threaded JavaScript powered by the libuv asynchronous event loop.

1. **Phases of the Event Loop:**
- **Timers:** Executes callbacks scheduled by \`setTimeout()\` and \`setInterval()\`.
- **Pending Callbacks:** Executes I/O callbacks deferred to the next loop iteration (e.g. system socket errors).
- **Idle / Prepare:** Internal libuv use only.
- **Poll:** Retrieves new I/O events (network connections, disk reads). If queue is empty, the loop will block and wait for incoming events.
- **Check:** Executes callbacks registered with \`setImmediate()\`.
- **Close Callbacks:** Executes socket closures (\`socket.on('close')\`).

2. **Microtasks vs Macro-tasks:**
- **Microtask Queue:** Contains \`process.nextTick()\` and Promise callbacks (\`Promise.then()\`).
- Crucially, microtasks drain **immediately** after the current synchronous JavaScript completes, before the event loop transitions to any other phase.
- \`process.nextTick()\` takes precedence over \`Promise.then()\`. Calling \`process.nextTick()\` recursively will starve the event loop and prevent I/O.`,
      codeSnippet: {
        language: "javascript",
        code: `// Execution Order Demonstration in Node.js
console.log("1. Synchronous Main Thread");

setTimeout(() => {
  console.log("5. Timers Phase (setTimeout)");
}, 0);

setImmediate(() => {
  console.log("6. Check Phase (setImmediate)");
});

Promise.resolve().then(() => {
  console.log("3. Microtask (Promise.then)");
});

process.nextTick(() => {
  console.log("2. Microtask (process.nextTick - highest priority)");
});

console.log("4. Synchronous End of Script");

// Output Order:
// 1 -> 4 -> 2 -> 3 -> 5 -> 6`,
        explanation:
          "Synchronous code runs first, followed immediately by process.nextTick, Promise microtasks, and then event loop timer and check phases.",
      },
    },
  ],

  sql: [
    {
      id: "sql-1",
      category: "technical",
      topic: "PostgreSQL Indexing & Query Optimization",
      difficulty: "Senior",
      question:
        "How do B-Tree and GIN indexes work in PostgreSQL, and how do you diagnose a slow query using EXPLAIN ANALYZE?",
      context:
        "Tests relational database performance, indexing strategies, p99 latency troubleshooting, and execution plan reading.",
      suggestedAnswerPoints: [
        "B-Tree indexes are standard for equality and range queries on scalar data (<, <=, =, >=, >).",
        "GIN (Generalized Inverted Index) is optimal for multi-valued fields like JSONB, full-text search, and arrays.",
        "EXPLAIN ANALYZE executes the query and prints actual execution times vs planner estimates, revealing Sequential Scans and Hash Joins.",
      ],
      fullAnswer: `Database indexing and execution plan inspection are critical for scaling high-throughput applications:

1. **B-Tree Indexes:**
- Self-balancing tree maintaining sorted data with O(log n) lookups.
- Ideal for primary keys, foreign keys, and sorting (\`ORDER BY\`).
- Supports composite indexing: leftmost prefix rule applies (an index on \`(tenant_id, created_at)\` accelerates searches on \`tenant_id\` alone or both, but not on \`created_at\` alone).

2. **GIN Indexes (Generalized Inverted Index):**
- Stores mappings from individual component elements (like keys inside a JSONB document or words in a document) to row IDs.
- Ideal for \`JSONB\` queries using the \`@>\` (contains) operator and array membership queries.

3. **EXPLAIN ANALYZE:**
- Run \`EXPLAIN (ANALYZE, BUFFERS) SELECT ...\`
- Look for **Seq Scan (Sequential Scan)** on large tables which indicates a missing index.
- Check **Index Scan** vs **Index Only Scan** (Index Only Scans read directly from the index without visiting table heap pages).`,
      codeSnippet: {
        language: "sql",
        code: `-- Diagnosing and Indexing JSONB + Range Queries in PostgreSQL

-- 1. Inspect Execution Plan
EXPLAIN ANALYZE
SELECT id, metadata->>'plan' AS plan, created_at
FROM subscriptions
WHERE tenant_id = 'c7e8f1a2'
  AND created_at >= NOW() - INTERVAL '30 days';

-- 2. Add Composite B-Tree Index for Tenant & Date range filtering
CREATE INDEX CONCURRENTLY idx_subscriptions_tenant_date
ON subscriptions (tenant_id, created_at DESC);

-- 3. Add GIN index for high-performance JSONB containment queries
CREATE INDEX CONCURRENTLY idx_subscriptions_metadata_gin
ON subscriptions USING GIN (metadata jsonb_path_ops);`,
        explanation:
          "CREATE INDEX CONCURRENTLY builds the index without acquiring an exclusive table lock, ensuring 100% production write availability during migration.",
      },
    },
  ],

  system_design: [
    {
      id: "sd-1",
      category: "system-design",
      topic: "Distributed Rate Limiting",
      difficulty: "Senior",
      question:
        "Design a distributed rate limiter that handles 100,000 requests per second across multiple data centers. How do you prevent race conditions?",
      context:
        "Evaluates distributed systems architecture, caching strategies, Redis algorithms, and handling network partitions.",
      suggestedAnswerPoints: [
        "Compare rate limiting algorithms: Token Bucket, Leaky Bucket, Sliding Window Counter.",
        "Use Redis with Lua scripts to guarantee atomic sliding window execution without race conditions.",
        "Implement graceful degradation: fallback to in-memory local token bucket if Redis cluster connectivity drops.",
      ],
      fullAnswer: `Designing a production-grade distributed rate limiter:

1. **Algorithm Selection: Sliding Window Counter**
Combines memory efficiency with strict boundary protection. Divides the time window (e.g. 1 minute) into small sub-windows (e.g. 1 second buckets) or uses a Redis sorted set (\`ZSET\`) where the score and member are the request timestamp.

2. **Atomic Execution via Redis Lua Script:**
When hundreds of application gateway instances receive concurrent requests for the same user, simple \`GET\` and \`INCR\` commands create race conditions. We execute an atomic Redis Lua script:
- Remove timestamps older than \`current_time - window_size\` using \`ZREMRANGEBYSCORE\`.
- Count active requests in window via \`ZCARD\`.
- If count < limit, add the current request timestamp with \`ZADD\` and allow the request.
- Otherwise, return HTTP 429 Too Many Requests with a \`Retry-After\` header.

3. **High Scale & Fault Tolerance:**
- Use Redis cluster partitioned by user/tenant hash key.
- Circuit breaker: If Redis is unreachable, fail-open or fall back to an in-memory local Token Bucket on each API gateway instance to protect backend databases without killing legitimate traffic.`,
      codeSnippet: {
        language: "javascript",
        code: `// Redis Sliding Window Rate Limiter Lua Script
const rateLimiterScript = \`
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local limit = tonumber(ARGV[3])

  local clearBefore = now - window
  redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)

  local currentRequests = redis.call('ZCARD', key)
  if currentRequests < limit then
    redis.call('ZADD', key, now, now)
    redis.call('EXPIRE', key, math.ceil(window / 1000))
    return 1 -- Allowed
  else
    return 0 -- Rate Limited (429)
  end
\`;`,
        explanation:
          "Executing as a single Lua script guarantees atomicity inside Redis's single-threaded command processor, eliminating race conditions across distributed microservices.",
      },
    },
  ],

  behavioral: [
    {
      id: "beh-1",
      category: "behavioral",
      topic: "High-Prority Production Outage / Incident Management",
      difficulty: "Senior",
      question:
        "Describe a critical production outage or bug you encountered. How did you identify the root cause, mitigate impact, and prevent it from recurring?",
      context:
        "Tests incident composure, blameless post-mortem culture, telemetry monitoring, and technical communication under pressure.",
      suggestedAnswerPoints: [
        "Situation: Clearly state the system context, user impact, and severity level (e.g. 500 errors on checkout, 25% traffic dropped).",
        "Task: Your exact responsibility during the active incident response.",
        "Action: Rollback or feature-flag mitigation first to stop user pain, followed by log/telemetry root cause analysis.",
        "Result: Blameless post-mortem, new automated canary deployments, and automated integration tests added.",
      ],
      fullAnswer: `A model STAR answer for incident management:

- **Situation:** At my previous company, during a Black Friday peak traffic window, our order processing service experienced cascading 504 gateway timeouts. Over 15% of checkout transactions were failing, directly threatening revenue.
- **Task:** As the on-call tech lead, my primary objective was to immediately restore service availability before diagnosing the deep code-level defect.
- **Action:**
  1. I immediately triggered an automated rollback to the previous stable container build and enabled our Redis cache fallback for product catalog queries.
  2. With user traffic stabilized in under 6 minutes, I analyzed distributed traces in Datadog and discovered an unindexed database query introduced in the latest release that caused database connection pool exhaustion under heavy concurrency.
  3. I implemented the missing composite index, adjusted connection pool thresholds, and added an automated CI query linter rule that blocks migrations introducing unindexed foreign key lookups.
- **Result:** We conducted a blameless team post-mortem, added automated load testing to our CI/CD pipeline, and had zero outage recurrences for the remainder of peak season.`,
    },
    {
      id: "beh-2",
      category: "behavioral",
      topic: "Technical Disagreement & Cross-Functional Alignment",
      difficulty: "Senior",
      question:
        "Tell me about a time you strongly disagreed with a senior colleague or product lead on an architecture or roadmap decision. How did you navigate it?",
      context:
        "Evaluates diplomacy, data-driven decision making, humility, and the 'disagree and commit' principle.",
      suggestedAnswerPoints: [
        "Ground discussions in objective data, latency benchmarks, and user requirements rather than personal pride.",
        "Build a fast proof-of-concept (POC) to test hypotheses with measurable metrics.",
        "Once a decision is reached by the team, fully commit and support execution.",
      ],
      fullAnswer: `A model STAR answer for resolving technical friction:

- **Situation:** Our team was debating whether to rewrite our core search microservice in Go or maintain our existing Node.js architecture with optimized worker threads. A senior engineer strongly advocated for a complete Go rewrite, which would require 3 months of migration time and delay critical product roadmap deliverables.
- **Task:** I needed to ensure we made the best technical decision for system throughput without needlessly delaying client-facing commitments.
- **Action:** Rather than having subjective debates, I proposed spending two days building a standardized benchmark test suite simulating our peak load (50,000 queries/min).
  1. The benchmark revealed that our Node.js bottleneck was not CPU execution speed, but unoptimized database serialization and missing cache headers.
  2. By adding Redis caching and stream-based JSON parsing in Node.js, we achieved a 99th percentile response time of 38ms—well within our 50ms SLA—without rewriting the codebase.
- **Result:** The team agreed to keep the Node.js service, saving 12 weeks of engineering time. We shipped the intended roadmap features on schedule, and my colleague and I maintained strong mutual respect.`,
    },
  ],
};

/**
 * Normalizes input skills into matching keys from CURATED_SKILL_QUESTIONS.
 */
function matchCuratedQuestions(skills: string[]): InterviewQuestion[] {
  const matched: InterviewQuestion[] = [];
  const lowerSkills = skills.map((s) => s.toLowerCase().trim());

  for (const [key, questions] of Object.entries(CURATED_SKILL_QUESTIONS)) {
    if (
      lowerSkills.some(
        (s) =>
          s === key ||
          s.includes(key) ||
          (key === "sql" &&
            (s.includes("postgres") ||
              s.includes("database") ||
              s.includes("mysql"))) ||
          (key === "system_design" &&
            (s.includes("system") ||
              s.includes("architecture") ||
              s.includes("design"))),
      )
    ) {
      matched.push(...questions);
    }
  }

  // Always include at least one behavioral question for holistic prep
  if (!matched.some((q) => q.category === "behavioral")) {
    matched.push(...CURATED_SKILL_QUESTIONS.behavioral);
  }

  // Always include system design if not present
  if (!matched.some((q) => q.category === "system-design")) {
    matched.push(...CURATED_SKILL_QUESTIONS.system_design);
  }

  return matched;
}

/**
 * Generates targeted interview questions with full answers and code snippets
 * based on entered skills and target seniority.
 */
export async function generateInterviewQuestionsForSkills(
  skills: string[],
  role: string = "Software Engineer",
  difficulty: string = "Senior",
): Promise<InterviewQuestion[]> {
  const availability = await checkChromeAIAvailability();
  const skillsString =
    skills.filter(Boolean).join(", ") ||
    "Full-Stack Development, React, Node.js, System Design";

  const prompt = `You are a Principal Software Architect and Executive Technical Interviewer.
Candidate Skills: ${skillsString}
Target Role: ${role}
Target Seniority: ${difficulty}

Generate exactly 5 comprehensive interview questions (2 Technical deep dives with code, 1 System Design, 2 Behavioral STAR questions) tailored strictly to their skills.

You must output a STRICT JSON array matching this TypeScript structure:
[
  {
    "id": "q1",
    "category": "technical",
    "topic": "React Hooks & State",
    "difficulty": "${difficulty}",
    "question": "What is the question?",
    "context": "What the interviewer is evaluating",
    "suggestedAnswerPoints": ["Point 1", "Point 2", "Point 3"],
    "fullAnswer": "Detailed 2-3 paragraph answer explaining the reasoning, architecture, and edge cases.",
    "codeSnippet": {
      "language": "typescript",
      "code": "// verified executable code demonstrating the solution",
      "explanation": "Why this code pattern solves the problem"
    }
  }
]
Output ONLY raw JSON. No markdown backticks, no comments.`;

  if (availability.isAvailable) {
    try {
      const raw = await runChromeAIPrompt(prompt, {
        systemPrompt:
          "You are an executive interviewer outputting pure valid JSON arrays with full answers and code snippets.",
      });

      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any, idx: number) => ({
            id: item.id || `ai-q-${idx}`,
            category: item.category || "technical",
            topic: item.topic || "Core Technical Skills",
            difficulty: item.difficulty || difficulty,
            question: item.question,
            context: item.context || "Evaluates real-world engineering depth.",
            suggestedAnswerPoints: Array.isArray(item.suggestedAnswerPoints)
              ? item.suggestedAnswerPoints
              : [],
            fullAnswer:
              item.fullAnswer || item.answer || "See suggested points above.",
            codeSnippet: item.codeSnippet,
          }));
        }
      }
    } catch (e) {
      console.warn("AI Interview generation failed, using curated library:", e);
    }
  }

  // Fallback to our rich curated database
  const curated = matchCuratedQuestions(skills);
  if (curated.length > 0) {
    return curated.slice(0, 6);
  }

  // Generic fallback if no specific skills matched
  return [
    ...CURATED_SKILL_QUESTIONS.react,
    ...CURATED_SKILL_QUESTIONS.system_design,
    ...CURATED_SKILL_QUESTIONS.behavioral,
  ];
}

/**
 * Generates tailored questions with full answers directly from a resume profile.
 */
export async function generateInterviewQuestionsWithNano(
  resumeData: ResumeData,
): Promise<InterviewQuestion[]> {
  const role = resumeData.personalInfo.title || "Software Engineer";
  const skillNames = resumeData.skills.map((s) => s.name);
  return generateInterviewQuestionsForSkills(skillNames, role, "Senior");
}
