import React from "react";
import { Spinner } from "reactstrap";
import "./gameReloadingSpinner.css";

const GameReloadingSpinner = () => {
  return (
    <div className="game-reloading-wrapper">
      <h2>Wait! Game is loading...</h2>
      <Spinner style={{ width: "3rem", height: "3rem" }} />
    </div>
  );
};

export default GameReloadingSpinner;
