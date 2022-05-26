import React from "react";
import TextField from "@material-ui/core/TextField";
import { Checkbox, IconButton } from "@material-ui/core";
import "./option.scss";
const Option = ({
  option = {},
  pool,
  isCreateMode,
  isEditMode,
  onChange,
  checked,
  select = () => {},
  isPlaceholder = false,
}) => {
  function handleChange({ target }) {
    const updatedQuestions = pool.options.map((opt) => {
      if (opt.id === option.id) {
        return {
          ...opt,
          [target.name]: target.value,
        };
      }
      return opt;
    });

    onChange({ name: "options", value: updatedQuestions });
  }
  function handleDelete() {
    const updatedQuestions = pool.options.filter(({ id }) => id !== option.id);

    onChange({ name: "options", value: updatedQuestions });
  }
  function addQuestion() {
    const updatedQuestions = [
      ...pool.options,
      {
        value: `Option ${pool.options.length + 1}`,
        id: pool.options.length,
      },
    ];
    onChange({ name: "options", value: updatedQuestions });
  }
  function renderQuestionType() {
    return (
      <Checkbox
        checked={checked}
        onChange={select(option.id)}
        color="primary"
        size="small"
        disableRipple
        disabled={isCreateMode}
        readOnly={!isEditMode || !isCreateMode}
      />
    );
  }

  return (
    <div className="option-container">
      {renderQuestionType()}
      <div className="field-container option">
        {isPlaceholder && (
          <TextField
            placeholder="Add option"
            name="option"
            size="small"
            variant="outlined"
            type="text"
            fullWidth
            disabled
            onClick={addQuestion}
            InputProps={{
              readOnly: !isEditMode || !isCreateMode,
            }}
          />
        )}
        {!isPlaceholder && (
          <TextField
            onChange={handleChange}
            value={option.value}
            name="option"
            size="small"
            variant="outlined"
            type="text"
            fullWidth
            InputProps={{
              readOnly: !isEditMode || !isCreateMode,
            }}
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

export default Option;
