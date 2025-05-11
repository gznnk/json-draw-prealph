import React from "react";
import { StyledIframe } from "./SandboxedIframeStyled";

type SandboxedIframeProps = {
	srcdoc: string;
};

export const SandboxedIframe = React.memo(
	({ srcdoc }: SandboxedIframeProps) => {
		return <StyledIframe sandbox="allow-scripts" srcDoc={srcdoc} />;
	},
);
