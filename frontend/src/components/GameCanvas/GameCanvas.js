import React from "react";
import { socket } from "../../pages/DashboardContainer/DashboardContainer";
import { Button, Alert } from "reactstrap";
import { SketchPicker } from "react-color";
import "./canvas.css";

/**
 * Canvas Drawing component.
 * Using sockets to emit and get drawings.
 * Only admin can draw something.
 */
class GameCanvas extends React.Component {
  state = {
    color: "#000",
    wordToGuess: ""
  };

  isPainting = false;
  line = [];
  prevPos = { offsetX: 0, offsetY: 0 };

  componentDidMount() {
    if (this.props.user.role === "admin") socket.emit("getNewGameWordToGuess");

    this.canvas.width = document.querySelector(
      ".game-card.drawing-card.card.card-body"
    ).offsetWidth;
    this.canvas.height = document.querySelector(
      ".dashboard-wrapper.container-fluid > div"
    ).offsetHeight;

    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = this.state.color;

    socket.on("newGameDraw", ({ draw }) => {
      if (!draw) return this.clearCanvas();

      draw.forEach(d => {
        this.ctx.beginPath();
        this.ctx.strokeStyle = d.color;
        this.ctx.moveTo(d.start.offsetX, d.start.offsetY);
        this.ctx.lineTo(d.stop.offsetX, d.stop.offsetY);
        this.ctx.stroke();
      });
    });

    if (this.props.user.role === "admin") {
      socket.on("newGameWordToGuess", ({ word }) => {
        this.setState({ wordToGuess: word });
      });
    }
  }

  componentWillUnmount() {
    socket.off("newGameDraw");
    socket.off("newGameWordToGuess");
  }

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
        color: this.state.color,
        start: { ...this.prevPos },
        stop: { ...offSetData }
      };
      // Add the position to the line array
      this.line = [...this.line, positionData];
      this.paint(this.prevPos, offSetData, this.state.color);
    }
  };

  paint = (prevPos, currPos, strokeStyle) => {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();

    socket.emit("sendNewGameDraw", this.line);
    this.prevPos = { offsetX, offsetY };
  };

  endPaintEvent = () => {
    if (this.props.user.role !== "admin") return;
    if (this.isPainting) this.isPainting = false;
  };

  changeColor = ({ hex: color }) => {
    this.setState({ color });
  };

  /** Send request to clear canvas to all users */
  clearCanvasRequest = () => {
    socket.emit("clearGameDrawRequest");
    this.clearCanvas();
  };

  clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.line = [];
  };

  render() {
    const {
      user: { role }
    } = this.props;
    return (
      <>
        <canvas
          className={`gameCanvas ${role === "admin" ? "drawerCanvas" : ""}`}
          ref={ref => (this.canvas = ref)}
          style={{ background: "#fff" }}
          onMouseDown={this.onMouseDown}
          // onMouseLeave={this.endPaintEvent}
          onMouseUp={this.endPaintEvent}
          onMouseMove={this.onMouseMove}
        />
        {role === "admin" && (
          <>
            <SketchPicker
              onChangeComplete={this.changeColor}
              color={this.state.color}
            />
            <Alert className="word-to-guess-alert" color="primary">
              Word to guess is <span>"{this.state.wordToGuess}"</span>
            </Alert>
            <Button
              className="canvas-clear-button"
              onClick={this.clearCanvasRequest}
              outline
              color="primary"
            >
              Clear
            </Button>
          </>
        )}
      </>
    );
  }
}
export default GameCanvas;
