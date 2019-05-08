import React from "react";
import {
  Container,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col
} from "reactstrap";
import "./game-page.css";

class GamePage extends React.Component {
  render() {
    return (
      <Container id="game-page-container">
        <Row>
          <Col xs={6} sm={8}>
            <Card body>
              <CardTitle>Game Draw Panel</CardTitle>
              <CardText>There will be canvas drawing panel</CardText>
              <Button>Some react canvas draw library</Button>
            </Card>
          </Col>
          <Col xs={6} md={4}>
            <Card body>
              <CardTitle>Game chat</CardTitle>
              <CardText>There will be chat</CardText>
              <Button>Make here chat component</Button>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default GamePage;
