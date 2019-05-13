import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col, Button, Container, Table, Spinner } from "reactstrap";
import { GameWordModal } from "../../components/GameWords";
import {
  getAllGameWords,
  addNewGameWord,
  deleteGameWord
} from "../../actions/game";
import { mainStateHook } from "../../hooks";
import moment from "moment";
import "./gameWords.css";

const initialState = {
  load: true,
  modalIsOpen: false,
  modalIsLoading: false,
  modalError: "",
  isDeleting: false,
  todoId: null,
  deleteState: {
    loading: false,
    itemId: null
  }
};

const GameWords = ({
  getAllGameWords,
  addNewGameWord,
  deleteGameWord,
  gameWords
}) => {
  const [state, setState] = mainStateHook(initialState);

  const fetchAllGameWords = () => {
    getAllGameWords().then(() => {
      setState({ load: false });
    });
  };

  useEffect(() => {
    fetchAllGameWords();
  }, []);

  const toggleModal = () => {
    setState({
      modalIsOpen: !state.modalIsOpen,
      ...(state.modalError ? { modalError: false } : {})
    });
  };

  const addNewWord = word => {
    setState({
      ...(state.modalError !== "" ? { modalError: "" } : {}),
      modalIsLoading: true
    });

    addNewGameWord({ word }).then(
      () => {
        setState({ modalIsOpen: false, modalIsLoading: false });
      },
      err => {
        setState({ modalError: err.word, modalIsLoading: false });
      }
    );
  };

  const deleteWord = id => {
    setState({
      deleteState: {
        loading: true,
        itemId: id
      }
    });
    deleteGameWord(id).then(() => {
      setState({
        deleteState: initialState.deleteState
      });
    });
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
      <Row className="game-words-row">
        <Col>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Word</th>
                <th>Created at</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gameWords.map((word, index) => (
                <tr key={word._id}>
                  <td>{index + 1}</td>
                  <td>{word.word}</td>
                  <td>{moment(word.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                  <td className="actionsTd">
                    {state.deleteState.loading &&
                    state.deleteState.itemId === word._id ? (
                      <Spinner />
                    ) : (
                      <Button close onClick={() => deleteWord(word._id)} />
                    )}
                  </td>
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
        error={state.modalError}
        loading={state.modalIsLoading}
      />
    </Container>
  );
};

export default connect(
  store => {
    return {
      gameWords: store.game.gameWords
    };
  },
  {
    getAllGameWords,
    addNewGameWord,
    deleteGameWord
  }
)(GameWords);
