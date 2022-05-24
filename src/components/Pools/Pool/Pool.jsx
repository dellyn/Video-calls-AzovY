import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";

import Question from "./Question/Question";
import isEmpty from "lodash.isempty";
import { Button, FormControl } from "@material-ui/core";
import { generateId } from "../../../App";
import "./pool.scss";

const defaultQuestions = [
  {
    option: "Option 1",
    id: 0,
  },
  {
    option: "Option 2",
    id: 1,
  },
  {
    option: "Option 3",
    id: 2,
  },
];
const defaultPool = {
  title: "",
  description: "",
  questions: defaultQuestions,
  questionsType: "checkbox",
};

const Pool = ({ pool: sourcePool, createPool, updatePool }) => {
  const isCreateMode = !sourcePool;
  const [selectedIds, setSelectedIds] = useState([]);
  const [pool, setPool] = useState(
    sourcePool || {
      ...defaultPool,
      id: generateId(),
    }
  );
  const [wasChanged, setWasChanged] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    if (isCreateMode) {
      createPool(pool);
    } else {
      updatePool(pool);
    }
  }
  function onChange({ target }) {
    setWasChanged(true);
    setPool({
      ...pool,
      [target.name]: target.value,
    });
  }

  function onChangeQuestion({ name, value }) {
    setWasChanged(true);
    setPool({
      ...pool,
      [name]: value,
    });
  }

  function select(id) {
    return (event) => {
      if (event.target.checked && !selectedIds?.includes(id)) {
        setSelectedIds([...selectedIds, id]);
      } else if (!event.target.checked) {
        const updatedIds = selectedIds.filter(
          (selectedId) => selectedId !== id
        );
        setSelectedIds(updatedIds);
      }
    };
  }

  return (
    <div className="pool">
      <form onSubmit={handleSave}>
        <FormControl fullWidth required className="field-container">
          <label className="field-label" htmlFor="title">
            Title
          </label>
          <TextField
            id="title"
            onChange={onChange}
            value={pool.title || "Untitled pool"}
            name="title"
            size="small"
            variant="outlined"
            type="text"
            fullWidth
            required
          />
        </FormControl>
        <FormControl fullWidth required className="field-container">
          <label className="field-label" htmlFor="description">
            Description
          </label>
          <TextField
            id="description"
            onChange={onChange}
            value={pool.description}
            placeholder="Pool description"
            name="description"
            size="small"
            variant="outlined"
            type="text"
            fullWidth
            multiline
          />
        </FormControl>
        <div className="questions">
          <label className="field-label">Options</label>
          {!isEmpty(pool.questions) &&
            pool.questions.map((question) => {
              return (
                <Question
                  question={question}
                  pool={pool}
                  select={select}
                  selectedIds={selectedIds}
                  isCreateMode={isCreateMode}
                  onChange={onChangeQuestion}
                />
              );
            })}
          <div className="add-option-container">
            <Question
              pool={pool}
              isPlaceholder
              isCreateMode={isCreateMode}
              onChange={onChangeQuestion}
            />
          </div>
        </div>
        <div className="save-btn-container">
          <Button disabled={!wasChanged} type={handleSave}>
            {isCreateMode ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default Pool;
