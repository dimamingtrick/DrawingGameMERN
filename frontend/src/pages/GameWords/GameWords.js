import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col, Button, Container, Table } from "reactstrap";
import { GameWordModal } from "../../components/GameWords";
import {
  getAllGameWords,
  addNewGameWord,
  updateGameWord,
  deleteGameWord,
} from "../../actions/game";
import { mainStateHook } from "../../hooks";
import moment from "moment";

const GameWords = ({
  getAllGameWords,
  addNewGameWord,
  updateGameWord,
  deleteGameWord,
  gameWords,
}) => {
  const [state, setState] = mainStateHook({
    load: true,
    modalIsOpen: false,
    isDeleting: false,
    todoId: null,
  });

  const fetchAllGameWords = () => {
    getAllGameWords().then(() => {
      setState({ load: false });
    });
  };

  useEffect(() => {
    fetchAllGameWords();
  }, []);

  const toggleModal = () => {
    setState({ modalIsOpen: !state.modalIsOpen });
  };

  const addNewWord = word => {
    // setState({load})
    addNewGameWord({ word }).then(
      res => {
        console.log(res);
        setState({ modalIsOpen: false });
      },
      err => {
        console.log(err);
      }
    );
  };

  return (
    <Container>
      <h1>Game Words</h1>
      <Row className="todo-row">
        <Col md={{ size: 10, offset: 1 }}>
          <Button color="primary" onClick={toggleModal}>
            Add new game word
          </Button>
        </Col>
      </Row>
      <Row className="todo-row">
        <Col>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Word</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              {gameWords.map((word, index) => (
                <tr key={word._id}>
                  <td>{index + 1}</td>
                  <td>{word.word}</td>
                  <td>{moment(word.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <GameWordModal
        isOpen={state.modalIsOpen}
        toggle={toggleModal}
        addNewWord={addNewWord}
      />
    </Container>
  );
};

export default connect(
  store => {
    return {
      gameWords: store.game.gameWords,
    };
  },
  {
    getAllGameWords,
    addNewGameWord,
    updateGameWord,
    deleteGameWord,
  }
)(GameWords);
