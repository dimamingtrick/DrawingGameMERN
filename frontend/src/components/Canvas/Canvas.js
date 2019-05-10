import React from "react";
import { ChatService } from "../../services";
import socketIOClient from "socket.io-client";

const serverUrl = `${process.env.REACT_APP_SERVER}/`;
let socket;

class Canvas extends React.Component {
  constructor(props) {
    super(props);

    socket = socketIOClient(serverUrl);
  }

  isPainting = false;
  // Different stroke styles to be used for user and guest
  userStrokeStyle = "#EE92C2";
  guestStrokeStyle = "#F0C987";
  line = [];
  // v4 creates a unique id for each user. We used this since there's no auth to tell users apart
  prevPos = { offsetX: 0, offsetY: 0 };

  onMouseDown = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    this.isPainting = true;
    this.prevPos = { offsetX, offsetY };
  };

  onMouseMove = ({ nativeEvent }) => {
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
    if (this.isPainting) {
      this.isPainting = false;
      this.sendPaintData();
    }
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
    // ChatService.postPaint({
    //   prevPos,
    //   currPos
    // });

    this.prevPos = { offsetX, offsetY };
  };

  async sendPaintData() {
    const body = {
      line: this.line
    };
    // ChatService.postPaint(body);

    this.line = [];
  }

  componentDidMount() {
    // Here we set up the properties of the canvas element.
    this.canvas.width = 1000;
    this.canvas.height = 800;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = this.userStrokeStyle;

    socket.on("newDraw", ({ draw }) => {
      console.log("w");
      this.ctx.beginPath();
      // line.forEach(l => {
      this.ctx.lineTo(draw.prevPos.offsetX, draw.prevPos.offsetY);
      this.ctx.lineTo(draw.currPos.offsetX, draw.currPos.offsetY);
      this.ctx.stroke();
      // });
      this.ctx.stroke();
    });
  }

  render() {
    return (
      <canvas
        // We use the ref attribute to get direct access to the canvas element.
        ref={ref => (this.canvas = ref)}
        style={{ background: "black" }}
        onMouseDown={this.onMouseDown}
        onMouseLeave={this.endPaintEvent}
        onMouseUp={this.endPaintEvent}
        onMouseMove={this.onMouseMove}
      />
    );
  }
}
export default Canvas;
