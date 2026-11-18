import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const pngBuffer = fs.readFileSync(path.join(process.cwd(), "public/brand/emblema-puro.png"));
  const dataUri = `data:image/png;base64,${pngBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <img src={dataUri} width={32} height={32} style={{ borderRadius: "9999px" }} alt="" />
      </div>
    ),
    { ...size }
  );
}
