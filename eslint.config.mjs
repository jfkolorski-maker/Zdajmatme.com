import next from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...next,
  ...nextTs,
  {
    // React Three Fiber mutates Three.js objects (camera, materials, uniforms)
    // imperatively inside useFrame – outside React's render cycle. That is the
    // intended R3F pattern, so the compiler's immutability rules don't apply here.
    files: ["src/components/three/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/use-memo": "off",
    },
  },
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
];

export default config;
