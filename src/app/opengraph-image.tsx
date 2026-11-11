import { ImageResponse } from "next/og";

export const alt = "ZdajMatme.com — Matematyka przestaje być problemem. Korepetycje online 1:1";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#07162E", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 36, fontWeight: 800 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "#FFC928", display: "flex", alignItems: "center", justifyContent: "center", color: "#07162E", fontSize: 40 }}>√</div>
          <span>
            Zdaj<span style={{ color: "#FFC928" }}>Matme</span>.com
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Matematyka przestaje</div>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: "#FFC928" }}>być problemem.</div>
        </div>
        <div style={{ fontSize: 32, color: "rgba(255,255,255,0.75)" }}>Korepetycje online 1:1 · szkoła podstawowa i liceum · 110 zł / 60 min</div>
      </div>
    ),
    size,
  );
}
