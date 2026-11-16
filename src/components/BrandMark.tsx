import React from "react";

/**
 * Minimalist vector brand mark inspired by the hand-painted Vivências artwork:
 * emerald neurodiversity infinity loop + crimson petal accent.
 * Crisp at 32-36px in navbars and favicons.
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
      <rect width="40" height="40" rx="11" fill="#0F5C4D" />
      {/* Infinity / neurodiversity ribbon */}
      <path
        d="M11.5 22.5C9.5 22.5 8 20.9 8 19C8 17.1 9.5 15.5 11.5 15.5C14.8 15.5 17.5 22.5 21.5 22.5C23.5 22.5 25 20.9 25 19C25 17.1 23.5 15.5 21.5 15.5C17.5 15.5 14.8 22.5 11.5 22.5Z"
        stroke="#FAF7F2"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(3.5, 2)"
      />
      {/* Crimson petal / butterfly accent */}
      <circle cx="29.5" cy="11.5" r="4" fill="#C83E37" />
      <circle cx="29.5" cy="11.5" r="1.5" fill="#E5A93C" />
    </svg>
  );
}
