import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { getAllChats } from "../../actions/chat";

const ChatsPage = ({ chats, getAllChats }) => {
  const [load, setLoad] = useState(true);

  const fetchData = () => {
    getAllChats();
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

export default connect(
  store => {
    return {
      chats: store.chat.chats
    };
  },
  { getAllChats }
)(ChatsPage);
