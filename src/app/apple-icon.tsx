import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const pngBuffer = fs.readFileSync(path.join(process.cwd(), "public/brand/selo-flat.png"));
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
          background: "#EDEFF0",
          borderRadius: 40,
        }}
      >
        <img src={dataUri} width={164} height={164} style={{ borderRadius: "9999px" }} alt="" />
      </div>
    ),
    { ...size }
  );
}
