import { ImageResponse } from "next/og";

export const alt = "ToolMate Resume Builder - Free ATS Resume Maker";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#09090b",
        padding: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            backgroundColor: "#a855f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "28px",
            fontWeight: 800,
          }}
        >
          T
        </div>
        <div
          style={{
            display: "flex",
            color: "#fafafa",
            fontSize: "32px",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          ToolMate Resume
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: "64px",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: "1000px",
          }}
        >
          Free ATS Resume Builder
        </div>
        <div
          style={{
            display: "flex",
            color: "#a1a1aa",
            fontSize: "28px",
            fontWeight: 500,
            maxWidth: "960px",
            lineHeight: 1.4,
          }}
        >
          18+ Developer & Executive Templates | Vector PDF & Word Export | 100%
          Local Privacy
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "10px 24px",
            borderRadius: "9999px",
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            color: "#34d399",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          No Login Required
        </div>
        <div
          style={{
            display: "flex",
            padding: "10px 24px",
            borderRadius: "9999px",
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            color: "#38bdf8",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          Word (.docx) & Vector PDF
        </div>
        <div
          style={{
            display: "flex",
            padding: "10px 24px",
            borderRadius: "9999px",
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            color: "#c084fc",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          AI Interview Prep
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
