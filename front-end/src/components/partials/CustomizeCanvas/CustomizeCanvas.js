import React, { useRef } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import { Modal, Box } from "@mui/material"

function CustomizeCanvas({ open, handleClose }){
  const [tool, setTool] = React.useState('pen');
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);
  const stageRef = useRef(null);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleSave = () => {
    const dataURL = stageRef.current.toDataURL();
    console.log(dataURL);

    const link = document.createElement('a');
    link.href = dataURL;

    link.download = 'my_drawing.png';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
        <Box className="modal-style">
            <select
                value={tool}
                onChange={(e) => {
                setTool(e.target.value);
                }}
            >
                <option value="pen">Pen</option>
                <option value="eraser">Eraser</option>
            </select>
            <button onClick={handleSave}>Save Drawing</button>
            <Stage
                width={700}
                height={500}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                ref={stageRef}
            >
                <Layer>
                <Text text="Just start drawing" x={5} y={30} />
                {lines.map((line, i) => (
                    <Line
                    key={i}
                    points={line.points}
                    stroke="#df4b26"
                    strokeWidth={5}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={
                        line.tool === 'eraser' ? 'destination-out' : 'source-over'
                    }
                    />
                ))}
                </Layer>
            </Stage>
        </Box>
        </Modal>
      );
}
export default CustomizeCanvas;