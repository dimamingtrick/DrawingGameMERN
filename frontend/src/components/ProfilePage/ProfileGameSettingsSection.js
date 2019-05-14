import React, { useState, useEffect } from "react";
import { useProfileState } from "../../hooks";
import { Row, Col, Input, Button, Spinner } from "reactstrap";
import { FaEdit } from "react-icons/fa";

const ProfileGameSettingsSection = ({
  gameSettings,
  getGameSettings,
  updateGameSettings
}) => {
  const [settingsLoad, setSettingsLoad] = useState(!gameSettings);
  const [state, handleField, toggleEditState, updateData] = useProfileState(
    updateGameSettings
  );

  const fetchGameSettings = async () => {
    await getGameSettings();
    setSettingsLoad(false);
  };

  useEffect(() => {
    if (!gameSettings) fetchGameSettings();
  }, []);

  return (
    <Row className="profileGameSettingsRow">
      {!settingsLoad ? (
        <Col xs={12} className="profileContent profileGameSettings">
          <div className="profile-fields-container">
            {!state.editing ? (
              <div className="edit-icon">
                <FaEdit onClick={toggleEditState} />
              </div>
            ) : (
              <Button
                outline
                color="primary"
                disabled={state.loading}
                onClick={updateData}
              >
                {state.loading ? <Spinner /> : "Save"}
              </Button>
            )}

            <h2>Game settings</h2>
            <div className="profile-field">
              <span>Background:</span>
              {state.editing ? (
                <div>
                  <Input
                    name="background"
                    onChange={handleField}
                    defaultValue={gameSettings.background}
                  />
                  <div className="todo-error">{state.errors.background}</div>
                </div>
              ) : (
                gameSettings.background
              )}
            </div>
          </div>
        </Col>
      ) : (
        <Spinner />
      )}
    </Row>
  );
};

export default ProfileGameSettingsSection;
