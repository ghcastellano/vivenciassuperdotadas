import React from "react";

/**
 * Emblema Oficial da Associação Vivências Superdotadas
 * (Papoula vermelha + miolo espiral esmeralda + borboleta dourada, em PNG transparente sem borda).
 */
export function BrandMark({
  size = 36,
  variant = "emblem",
}: {
  size?: number;
  variant?: "emblem" | "vitral" | "flat";
}) {
  const src =
    variant === "vitral"
      ? "/brand/selo-vitral.png"
      : variant === "flat"
      ? "/brand/selo-flat.png"
      : "/brand/emblema-puro.png";

  return (
    <img
      src={src}
      alt="Vivências Superdotadas"
      width={size}
      height={size}
      className="shrink-0 rounded-full object-contain select-none"
      style={{ width: size, height: size }}
    />
  );
}
