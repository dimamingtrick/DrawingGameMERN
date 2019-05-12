import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import api from "../../services/api";

const AboutPage = () => {
  const [load, setLoad] = useState(true);

  const fetchData = () => {
    api({ method: "GET", url: "/" }).then(res => {
      setTimeout(() => {
        setLoad(false);
      }, 300);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (load) return <h1>LOADING...</h1>;

  return (
    <Container>
      <h1>About page</h1>
      <h3>{`Load state with hooks is - ${load}`}</h3>
    </Container>
  );
};

export default AboutPage;
