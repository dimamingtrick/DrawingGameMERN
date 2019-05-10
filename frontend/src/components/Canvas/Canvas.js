import React from "react";
import { Button } from "reactstrap";
import "./canvas.css";
import { socket } from "../../pages/DashboardContainer/DashboardContainer";

class Canvas extends React.Component {
  isPainting = false;
  userStrokeStyle = "#fff";
  guestStrokeStyle = "#F0C987";
  line = [];
  prevPos = { offsetX: 0, offsetY: 0 };

  onMouseDown = ({ nativeEvent }) => {
    if (this.props.user.role !== "admin") return;

    const { offsetX, offsetY } = nativeEvent;
    this.isPainting = true;
    this.prevPos = { offsetX, offsetY };
  };

  onMouseMove = ({ nativeEvent }) => {
    if (this.props.user.role !== "admin") return;

    if (this.isPainting) {
      const { offsetX, offsetY } = nativeEvent;
      const offSetData = { offsetX, offsetY };
      // Set the start and stop position of the paint event.
      const positionData = {
        start: { ...this.prevPos },
        stop: { ...offSetData }
      };
      // Add the position to the line array
      this.line = this.line.concat(positionData);
      this.paint(this.prevPos, offSetData, this.userStrokeStyle);
    }
  };

  endPaintEvent = () => {
    if (this.props.user.role !== "admin") return;
    if (this.isPainting) this.isPainting = false;
  };

  paint = (prevPos, currPos, strokeStyle) => {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    // Move the the prevPosition of the mouse
    this.ctx.moveTo(x, y);
    // Draw a line to the current position of the mouse
    this.ctx.lineTo(offsetX, offsetY);
    // Visualize the line using the strokeStyle
    this.ctx.stroke();

    socket.emit("sendNewDraw", {
      prevPos,
      currPos
    });

    this.prevPos = { offsetX, offsetY };
  };

  componentDidMount() {
    this.canvas.width = 1000;
    this.canvas.height = 1000;

    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = this.userStrokeStyle;

    socket.on("newDraw", ({ draw }) => {
      if (!draw) {
        this.clearCanvas();
        return;
      }
      this.ctx.beginPath();
      this.ctx.lineTo(draw.prevPos.offsetX, draw.prevPos.offsetY);
      this.ctx.lineTo(draw.currPos.offsetX, draw.currPos.offsetY);
      this.ctx.stroke();
    });
  }

  componentWillUnmount() {
    socket.off("newDraw");
  }

  /** Send request to clear canvas to all users */
  clearCanvasRequest = () => {
    socket.emit("clearDrawRequest");
    this.clearCanvas();
  };

  clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  render() {
    const {
      user: { role }
    } = this.props;
    return (
      <>
        <canvas
          ref={ref => (this.canvas = ref)}
          style={{ background: "#343a40" }}
          onMouseDown={this.onMouseDown}
          onMouseLeave={this.endPaintEvent}
          onMouseUp={this.endPaintEvent}
          onMouseMove={this.onMouseMove}
        />
        {role === "admin" && (
          <Button
            className="canvas-clear-button"
            onClick={this.clearCanvasRequest}
            outline
            color="primary"
          >
            Clear
          </Button>
        )}
      </>
    );
  }
}
export default Canvas;
