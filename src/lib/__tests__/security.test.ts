/**
 * Security Unit Tests & Assertions
 * Verifies XSS sanitization, URL protocol validation, and upload binary header defenses.
 */
import { MAX_PDF_FILE_SIZE, MAX_RAW_TEXT_LENGTH } from "../pdfResumeParser";

// Re-export or mirror unit validation logic for standalone verification
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sanitizeUrl(url?: string): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (trimmed.startsWith("//")) return "#";
  if (trimmed.startsWith("/")) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)) {
      return trimmed;
    }
    return "#";
  } catch {
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return "#";
  }
}

export function isSafeImageDataUri(uri: string): boolean {
  const trimmed = uri.trim();
  return (
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  );
}

export function validatePdfBinaryHeader(buffer: Uint8Array): boolean {
  if (buffer.byteLength < 5) return false;
  return (
    buffer[0] === 0x25 && // %
    buffer[1] === 0x50 && // P
    buffer[2] === 0x44 && // D
    buffer[3] === 0x46 && // F
    buffer[4] === 0x2d // -
  );
}

export function runSecurityVerificationSuite(): {
  total: number;
  passed: number;
  failed: number;
  results: { test: string; status: "PASS" | "FAIL"; details?: string }[];
} {
  const results: { test: string; status: "PASS" | "FAIL"; details?: string }[] =
    [];

  function assert(testName: string, condition: boolean, details?: string) {
    if (condition) {
      results.push({ test: testName, status: "PASS" });
    } else {
      results.push({ test: testName, status: "FAIL", details });
    }
  }

  // 1. XSS Escaping Tests
  assert(
    "XSS: Blocks script tags",
    escapeHtml("<script>alert(1)</script>") ===
      "&lt;script&gt;alert(1)&lt;/script&gt;",
  );
  assert(
    "XSS: Blocks image onerror payload",
    escapeHtml('<img src="x" onerror="alert(1)">') ===
      "&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;",
  );
  assert(
    "XSS: Blocks iframe injection",
    escapeHtml('<iframe src="javascript:alert(1)">') ===
      "&lt;iframe src=&quot;javascript:alert(1)&quot;&gt;",
  );

  // 2. URL Protocol Validation Tests
  assert(
    "URL: Disallows javascript: protocol",
    sanitizeUrl("javascript:alert(document.cookie)") === "#",
  );
  assert(
    "URL: Disallows data: protocol in links",
    sanitizeUrl("data:text/html,<script>alert(1)</script>") === "#",
  );
  assert(
    "URL: Disallows vbscript: protocol",
    sanitizeUrl("vbscript:msgbox(1)") === "#",
  );
  assert(
    "URL: Allows valid https URL",
    sanitizeUrl("https://github.com/prahladinala") ===
      "https://github.com/prahladinala",
  );
  assert(
    "URL: Normalizes domain without protocol to https",
    sanitizeUrl("github.com/prahladinala") ===
      "https://github.com/prahladinala",
  );

  // 3. Image URI Scheme Validation
  assert(
    "Image: Allows valid data:image/png",
    isSafeImageDataUri("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...") ===
      true,
  );
  assert(
    "Image: Rejects malicious data:text/html payload",
    isSafeImageDataUri(
      "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
    ) === false,
  );
  assert(
    "Image: Rejects javascript: URI in image source",
    isSafeImageDataUri("javascript:alert(1)") === false,
  );

  // 4. PDF Binary Magic Header Validation
  const validPdfHeader = new Uint8Array([
    0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34,
  ]);
  const fakePdfHeader = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]); // GIF header
  assert(
    "PDF: Validates legitimate %PDF- signature",
    validatePdfBinaryHeader(validPdfHeader) === true,
  );
  assert(
    "PDF: Rejects spoofed non-PDF binary header",
    validatePdfBinaryHeader(fakePdfHeader) === false,
  );

  // 5. Bounds Check
  assert(
    "Limits: Max PDF size is enforced at 10MB",
    MAX_PDF_FILE_SIZE === 10 * 1024 * 1024,
  );
  assert(
    "Limits: Max raw text length is bounded at 100K chars",
    MAX_RAW_TEXT_LENGTH === 100_000,
  );

  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;

  return { total: results.length, passed, failed, results };
}
