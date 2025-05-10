import { css } from "@emotion/react";

export const ViewBackground = css`
    background-color: #1A1E2F; /* ベースとなる暗いブルーグレー */
    background-image: 
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.015) 0%, transparent 60%),
        radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.01) 0%, transparent 60%),
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><filter id='noiseFilter'><feTurbulence type='fractalNoise' baseFrequency='0.06' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23noiseFilter)' opacity="0.2"/></svg>");
    background-blend-mode: overlay;
    background-size: auto;
    background-repeat: repeat;
`;
