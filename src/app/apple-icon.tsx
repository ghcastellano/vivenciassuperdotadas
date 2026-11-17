import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#18492D",
          borderRadius: 40,
        }}
      >
        <svg width="132" height="132" viewBox="0 0 24 24" fill="none">
          <path
            d="M4.5 12C4.5 9.8 6.2 8.2 8.2 8.2C10.5 8.2 13.5 15.8 15.8 15.8C17.8 15.8 19.5 14.2 19.5 12C19.5 9.8 17.8 8.2 15.8 8.2C13.5 8.2 10.5 15.8 8.2 15.8C6.2 15.8 4.5 14.2 4.5 12Z"
            stroke="#FAF7F2"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2" fill="#E5A93C" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
