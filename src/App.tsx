import SvgCanvas from "./components/molecules/SvgCanvas";
import { useSvgCanvas } from "./components/molecules/SvgCanvas/hooks";
import Button from "./components/atoms/Button";
import Input from "./components/atoms/Input";

function App() {
	// console.log("App render");

	const {
		state: [canvasState, setCanvasState],
		canvasProps,
		canvasFunctions,
	} = useSvgCanvas([
		{
			id: "1",
			type: "rect",
			point: { x: 10, y: 10 },
			width: 100,
			height: 100,
			fill: "transparent",
			stroke: "black",
			strokeWidth: "1px",
			isSelected: false,
		},
		{
			id: "2",
			type: "ellipse",
			point: { x: 110, y: 110 },
			width: 100,
			height: 100,
			fill: "transparent",
			stroke: "black",
			strokeWidth: "1px",
			isSelected: false,
		},
	]);

	const handleAddRectangle = () => {
		canvasFunctions.addItem({
			type: "rect",
		});
	};

	const handleAddEllipse = () => {
		canvasFunctions.addItem({
			type: "ellipse",
		});
	};

	return (
		<div className="App">
			<header
				className="App-header"
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "50px",
					backgroundColor: "black",
					color: "white",
				}}
			>
				<h1 style={{ margin: 0 }}>SVG Canvas</h1>
			</header>
			<div
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					bottom: 0,
					width: "100px",
					backgroundColor: "lightgray",
					overflow: "hidden",
				}}
			>
				<Button onClick={handleAddRectangle}>Add Rectangle</Button>
				<Button onClick={handleAddEllipse}>Add Ellipse</Button>
				<div>{canvasState.selectedItemId}</div>
				<Input
					value={canvasFunctions.getSelectedItem()?.fill || ""}
					onChange={(e) => {
						if (!canvasState.selectedItemId) return;
						canvasFunctions.updateItem({
							id: canvasState.selectedItemId,
							fill: e.target.value,
						});
					}}
				/>
			</div>
			<div
				style={{
					position: "absolute",
					top: "50px",
					left: 0,
					right: "100px",
					bottom: 0,
				}}
			>
				<SvgCanvas {...canvasProps} />
			</div>
		</div>
	);
}

export default App;
