import React, { useState } from "react";
import { Container, Button } from "reactstrap";

const HomePage = () => {
  const [load, setLoad] = useState(true);

  const toggleLoadState = () => {
    setLoad(!load);
  };

  return (
    <Container>
      <h1>Home page</h1>
      <h5>{`Load state is - ${load}`}</h5>
      <Button onClick={toggleLoadState}>Toggle count</Button>
    </Container>
  );
};

export default HomePage;
