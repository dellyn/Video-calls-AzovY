import React from "react";
import TextField from "@material-ui/core/TextField";
import { Checkbox, IconButton } from "@material-ui/core";
import "./option.scss";
import { generateId } from "../../../../App";
const Option = ({
  option = {},
  options,
  isCreateMode,
  isEditMode,
  onChange,
  checked,
  select = () => {},
  isPlaceholder = false,
  isVoted,
}) => {
  function handleChange({ target }) {
    const updatedQuestions = options.map((opt) => {
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
    const updatedQuestions = options.filter(({ id }) => id !== option.id);

    onChange({ name: "options", value: updatedQuestions });
  }
  function addOption() {
    const id = generateId();
    const updatedOptions = {
      ...options,
      [id]: {
        value: `Option ${options.length + 1}`,
        id,
        index: options.length + 1,
      },
    };
    onChange({ name: "options", value: updatedOptions });
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
            name="value"
            size="small"
            variant="outlined"
            type="text"
            fullWidth
            disabled
            onClick={addOption}
          />
        )}
        {!isPlaceholder && (
          <TextField
            onChange={handleChange}
            value={option.value}
            name="value"
            size="small"
            variant="outlined"
            type="text"
            fullWidth
            InputProps={{
              readOnly: !isEditMode && !isCreateMode,
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
      {isVoted && <div className="result">{`${option.result}%`}</div>}
    </div>
  );
};

export default Option;
