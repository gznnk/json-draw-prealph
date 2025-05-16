// SplitView.tsx
import type React from "react";
import { useRef, useState } from "react";

import { Container, Pane, Divider } from "./SplitViewStyled";

type SplitViewProps = {
	initialRatio?: number; // 左右の幅比率（0〜1）
	left: React.ReactNode;
	right: React.ReactNode;
};

export const SplitView: React.FC<SplitViewProps> = ({
	initialRatio = 0.5,
	left,
	right,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [ratio, setRatio] = useState(initialRatio);

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		const startX = e.clientX;
		const container = containerRef.current;
		if (!container) return;

		const handleMouseMove = (moveEvent: MouseEvent) => {
			const dx = moveEvent.clientX - startX;
			const newRatio =
				(container.offsetWidth * ratio + dx) / container.offsetWidth;
			setRatio(Math.max(0.1, Math.min(0.9, newRatio))); // 最小0.1、最大0.9に制限
		};

		const handleMouseUp = () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
	};

	return (
		<Container ref={containerRef}>
			<Pane style={{ flex: ratio }}>{left}</Pane>
			<Divider onMouseDown={handleMouseDown} />
			<Pane style={{ flex: 1 - ratio }}>{right}</Pane>
		</Container>
	);
};
