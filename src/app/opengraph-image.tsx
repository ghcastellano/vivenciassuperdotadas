import { ImageResponse } from "next/og";

export const alt = "Vivências Superdotadas — Acolhimento, Ciência e Voz em Primeira Pessoa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FAF7F2",
          padding: 40,
          color: "#171C1A",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            border: "2px solid #DDD4C3",
            background: "#FFFFFF",
          }}
        >
          {/* Left Editorial Column */}
          <div
            style={{
              flex: 1.35,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "52px 56px",
              borderRight: "2px solid #DDD4C3",
            }}
          >
            {/* Top Brand Row */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
                <g fill="#A8322D">
                  <ellipse cx="20" cy="8.2" rx="4.4" ry="7.2" />
                  <ellipse cx="20" cy="31.8" rx="4.4" ry="7.2" />
                  <ellipse cx="20" cy="8.2" rx="4.4" ry="7.2" transform="rotate(60 20 20)" />
                  <ellipse cx="20" cy="31.8" rx="4.4" ry="7.2" transform="rotate(60 20 20)" />
                  <ellipse cx="20" cy="8.2" rx="4.4" ry="7.2" transform="rotate(120 20 20)" />
                  <ellipse cx="20" cy="31.8" rx="4.4" ry="7.2" transform="rotate(120 20 20)" />
                </g>
                <circle cx="20" cy="20" r="10.2" fill="#FAF7F2" />
                <circle cx="20" cy="20" r="8.8" fill="#0F5C4D" />
                <path
                  d="M14.8 20C14.8 18.45 16.05 17.2 17.5 17.2C19.2 17.2 20.8 22.8 22.5 22.8C23.95 22.8 25.2 21.55 25.2 20C25.2 18.45 23.95 17.2 22.5 17.2C20.8 17.2 19.2 22.8 17.5 22.8C16.05 22.8 14.8 21.55 14.8 20Z"
                  stroke="#FAF7F2"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="20" r="1.4" fill="#E5A93C" />
              </svg>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
                  Vivências Superdotadas
                </span>
                <span style={{ fontSize: 13, color: "#0F5C4D", letterSpacing: "0.14em", fontWeight: 700 }}>
                  ASSOCIAÇÃO · AH/SD &amp; DUPLA EXCEPCIONALIDADE
                </span>
              </div>
            </div>

            {/* Center Headline */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: 44,
                  fontWeight: 700,
                  lineHeight: 1.16,
                  letterSpacing: "-0.025em",
                }}
              >
                <span>Compreender a superdotação</span>
                <div style={{ display: "flex" }}>
                  <span style={{ color: "#0F5C4D", fontStyle: "italic", fontWeight: 500 }}>sem mitos,</span>
                  <span>&nbsp;em primeira pessoa.</span>
                </div>
              </div>
              <div style={{ fontSize: 21, color: "#48524E", lineHeight: 1.45 }}>
                Acolhimento baseado em evidências, rede de profissionais habilitados, divulgação científica e voz da
                comunidade.
              </div>
            </div>

            {/* Bottom Metadata Strip */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid #DDD4C3",
                paddingTop: 20,
                fontSize: 15,
                color: "#66736E",
                letterSpacing: "0.06em",
              }}
            >
              <span>VIVENCIASSUPERDOTADAS.VERCEL.APP</span>
              <span style={{ color: "#0F5C4D", fontWeight: 700 }}>CADA PESSOA É ÚNICA · ∞</span>
            </div>
          </div>

          {/* Right Botanical Emblem Panel */}
          <div
            style={{
              flex: 0.65,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#F2ECE1",
              padding: 40,
              gap: 22,
            }}
          >
            <div
              style={{
                width: 240,
                height: 240,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                background: "#FAF7F2",
                border: "2px solid #DDD4C3",
              }}
            >
              <svg width="170" height="170" viewBox="0 0 40 40" fill="none">
                <g fill="#A8322D">
                  <ellipse cx="20" cy="8.2" rx="4.4" ry="7.2" />
                  <ellipse cx="20" cy="31.8" rx="4.4" ry="7.2" />
                  <ellipse cx="20" cy="8.2" rx="4.4" ry="7.2" transform="rotate(60 20 20)" />
                  <ellipse cx="20" cy="31.8" rx="4.4" ry="7.2" transform="rotate(60 20 20)" />
                  <ellipse cx="20" cy="8.2" rx="4.4" ry="7.2" transform="rotate(120 20 20)" />
                  <ellipse cx="20" cy="31.8" rx="4.4" ry="7.2" transform="rotate(120 20 20)" />
                </g>
                <circle cx="20" cy="20" r="10.2" fill="#FAF7F2" />
                <circle cx="20" cy="20" r="8.8" fill="#0F5C4D" />
                <path
                  d="M14.8 20C14.8 18.45 16.05 17.2 17.5 17.2C19.2 17.2 20.8 22.8 22.5 22.8C23.95 22.8 25.2 21.55 25.2 20C25.2 18.45 23.95 17.2 22.5 17.2C20.8 17.2 19.2 22.8 17.5 22.8C16.05 22.8 14.8 21.55 14.8 20Z"
                  stroke="#FAF7F2"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="20" r="1.4" fill="#E5A93C" />
              </svg>
            </div>
            <div
              style={{
                background: "#0F5C4D",
                color: "#FAF7F2",
                padding: "10px 18px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              ACOLHIMENTO · CIÊNCIA · VOZ
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
