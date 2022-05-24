import React from "react";
import TextField from "@material-ui/core/TextField";
import { Checkbox, IconButton } from "@material-ui/core";
import "./question.scss";
const Question = ({
  question = {},
  pool,
  isCreateMode,
  onChange,
  select = () => {},
  selectedIds = [],
  isPlaceholder = false,
}) => {
  function handleChange({ target }) {
    const updatedQuestions = pool.questions.map((quest) => {
      if (quest.id === question.id) {
        return {
          ...quest,
          [target.name]: target.value,
        };
      }
      return quest;
    });

    onChange({ name: "questions", value: updatedQuestions });
  }
  function handleDelete() {
    const updatedQuestions = pool.questions.filter(
      (quest) => quest.id !== question.id
    );

    onChange({ name: "questions", value: updatedQuestions });
  }
  function addQuestion() {
    const updatedQuestions = [
      ...pool.questions,
      {
        option: `Option ${pool.questions.length + 1}`,
        id: pool.questions.length,
      },
    ];
    onChange({ name: "questions", value: updatedQuestions });
  }
  function renderQuestionType(question = {}) {
    return (
      <Checkbox
        checked={selectedIds.includes(question.id)}
        onChange={select(question.id)}
        color="primary"
        size="small"
        disableRipple
        disabled={isCreateMode}
      />
    );
  }

  return (
    <div className="question-container">
      {renderQuestionType()}
      <div className="field-container option">
        {isPlaceholder ? (
          <TextField
            placeholder="Add option"
            name="option"
            size="small"
            variant="outlined"
            type="text"
            fullWidth
            disabled
            onClick={addQuestion}
          />
        ) : (
          <TextField
            onChange={handleChange}
            value={question.option}
            name="option"
            size="small"
            variant="outlined"
            type="text"
            fullWidth
          />
        )}
      </div>
      {!isPlaceholder && (
        <IconButton
          size="small"
          edge="end"
          classes={{ root: "delete-icon-container" }}
          onClick={handleDelete}
        >
          x
        </IconButton>
      )}
    </div>
  );
};

export default Question;
