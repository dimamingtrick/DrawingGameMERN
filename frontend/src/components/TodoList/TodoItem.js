import React from 'react';
import {ListGroupItem, Row, Col, Button} from 'reactstrap';

export default function TodoItem({ _id, title, description, deleteTodoRequest, onClick }) {
  const openListItem = e => {
    if (e.target.tagName !== "SPAN" && e.target.tagName !== "BUTTON") {
      onClick(_id);
    }
  };

  return (
    <ListGroupItem className={"singleTodoListItem"} onClick={openListItem}>
      <Row>
        <Col xs={3}>{title}</Col>
        <Col xs={7}>{description}</Col>
        <Col xs={2}>
          <Button close onClick={() => deleteTodoRequest(_id)} />
        </Col>
      </Row>
    </ListGroupItem>
  );
}