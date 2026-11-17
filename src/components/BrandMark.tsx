import React from "react";

/**
 * Geometric 6-petal botanical crest distilled from the founding painting
 * (`public/images/logo-vivencias.jpg`): deep crimson petals, emerald spiral core,
 * and centered infinity ribbon — crisp at 28–40px with zero corner notification dot.
 */
export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* 6 symmetrical botanical petals */}
      <g fill="#A8322D">
        <ellipse cx="20" cy="8.2" rx="4.4" ry="7.2" />
        <ellipse cx="20" cy="31.8" rx="4.4" ry="7.2" />
        <ellipse cx="20" cy="8.2" rx="4.4" ry="7.2" transform="rotate(60 20 20)" />
        <ellipse cx="20" cy="31.8" rx="4.4" ry="7.2" transform="rotate(60 20 20)" />
        <ellipse cx="20" cy="8.2" rx="4.4" ry="7.2" transform="rotate(120 20 20)" />
        <ellipse cx="20" cy="31.8" rx="4.4" ry="7.2" transform="rotate(120 20 20)" />
      </g>
      {/* Petal inner hairline contour */}
      <circle cx="20" cy="20" r="10.2" fill="#FAF7F2" />
      {/* Emerald core */}
      <circle cx="20" cy="20" r="8.8" fill="#0F5C4D" />
      {/* Centered organic infinity loop */}
      <path
        d="M14.8 20C14.8 18.45 16.05 17.2 17.5 17.2C19.2 17.2 20.8 22.8 22.5 22.8C23.95 22.8 25.2 21.55 25.2 20C25.2 18.45 23.95 17.2 22.5 17.2C20.8 17.2 19.2 22.8 17.5 22.8C16.05 22.8 14.8 21.55 14.8 20Z"
        stroke="#FAF7F2"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Centered gold stamen point */}
      <circle cx="20" cy="20" r="1.4" fill="#E5A93C" />
    </svg>
  );
}
