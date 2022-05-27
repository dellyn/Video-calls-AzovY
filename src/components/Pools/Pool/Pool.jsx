import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";

import Option from "./Option/Option";
import isEmpty from "lodash.isempty";
import { Button, FormControl, FormLabel, IconButton } from "@material-ui/core";
import "./pool.scss";
import isEqual from "lodash.isequal";
import DeleteButton from "../../Shared/DeleteButton/DeleteButton";
import classNames from "classnames";

const Pool = ({
  isManager,
  pool: sourcePool,
  isCreateMode,
  createPool,
  updatePool,
  deletePool,
  userId,
}) => {
  const [pool, setPool] = useState(sourcePool);
  console.log(pool);
  const [isEditMode, setIsEditMode] = useState(false);
  const isEditing = isEditMode || isCreateMode;
  const isViewMode = !isEditMode && !isCreateMode;
  const selectedOptionId = pool.votes.users[userId]?.optionId;
  const isVoted = !!selectedOptionId;
  const options = Object.values(pool.options);
  const containerClassName = classNames("pool-container", {
    "is-view": isViewMode,
    voted: isVoted,
  });

  function handleSave(e) {
    e.preventDefault();

    if (isCreateMode) {
      createPool(pool);
    } else {
      updatePool(pool);
    }
  }
  function onChange({ target }) {
    setPool({
      ...pool,
      [target.name]: target.value,
    });
  }

  function onChangeQuestion({ name, value }) {
    setPool({
      ...pool,
      [name]: value,
    });
  }

  function vote(optionId) {
    return (event) => {
      // TODO prevent duplicates
      if (event.target.checked && !isVoted) {
        const optionUsers = pool.votes.options[optionId] || [];
        const updatedOptions = {
          ...pool.votes.options,
          [optionId]: [...optionUsers, userId],
        };

        const updatedUsers = {
          ...pool.votes.users,
          [userId]: {
            optionId,
          },
        };

        const updatedPool = {
          ...pool,
          votes: {
            options: updatedOptions,
            users: updatedUsers,
          },
        };
        updatePool(updatedPool);
      }
    };
  }

  function retractVote() {
    if (selectedOptionId) {
      const optionUsers = pool.votes.options[selectedOptionId] || [];
      const filteredUsers = optionUsers.filter((id) => id !== userId);
      const updatedOptions = {
        ...pool.votes.options,
        [selectedOptionId]: filteredUsers,
      };
      const updatedUsers = { ...pool.votes.users };
      delete updatedUsers[userId];
      const updatedPool = {
        ...pool,
        votes: {
          options: updatedOptions,
          users: updatedUsers,
        },
      };
      updatePool(updatedPool);
    }
  }

  function renderPoolActions() {
    if (isViewMode && isVoted) {
      return (
        <div className="actions">
          <IconButton onClick={retractVote} className="retract-btn">
            retract
          </IconButton>
        </div>
      );
    }
    if (isCreateMode) {
      return (
        <div className="actions">
          <IconButton onClick={() => setIsEditMode(true)} className="close-btn">
            e
          </IconButton>
          <DeleteButton onClick={() => deletePool(pool.id)} />
        </div>
      );
    }
  }

  useEffect(() => {
    setPool(sourcePool);
  }, [sourcePool]);

  return (
    <div className={containerClassName}>
      <form onSubmit={handleSave}>
        <header>
          <FormControl fullWidth required className="field-container title">
            <FormLabel className="field-label title" htmlFor="title">
              Pool Title
            </FormLabel>
            <TextField
              id="title"
              onChange={onChange}
              value={pool.title || "Question"}
              name="title"
              size="small"
              variant="outlined"
              type="text"
              fullWidth
              required
              InputProps={{
                readOnly: !isEditing,
              }}
            />
          </FormControl>
          {renderPoolActions()}
        </header>
        {(isEditing || pool.description) && (
          <span className="field-label description" htmlFor="description">
            Anonymous pool
          </span>
        )}

        <div className="options">
          <FormLabel className="field-label options">Options</FormLabel>
          {!isEmpty(options) &&
            options.map((option) => {
              return (
                <Option
                  key={option.id}
                  option={option}
                  pool={pool}
                  options={options}
                  select={vote}
                  checked={selectedOptionId === option.id}
                  isCreateMode={isCreateMode}
                  isEditMode={isEditMode}
                  onChange={onChangeQuestion}
                  isVoted={isVoted}
                />
              );
            })}
          {isEditing && (
            <div className="add-option-container">
              <Option
                pool={pool}
                options={options}
                isPlaceholder
                isCreateMode={isCreateMode}
                isEditMode={isEditMode}
                onChange={onChangeQuestion}
              />
            </div>
          )}
        </div>
        {isCreateMode && (
          <div className="create-btn-container">
            <Button disabled={isEqual(pool, sourcePool)} type={handleSave}>
              Create
            </Button>
          </div>
        )}
        {isManager && isEditMode && (
          <div className="save-btn-container">
            <Button disabled={isEqual(pool, sourcePool)} type={handleSave}>
              Save
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
export default Pool;
