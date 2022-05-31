import React from "react";
import TextField from "@material-ui/core/TextField";
import "./option.scss";
import { generateId } from "../../../../App";
import DeleteButton from "../../../Shared/DeleteButton/DeleteButton";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { FormControlLabel, Radio } from "@material-ui/core";
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
  function renderOptionHeading() {
    if (isVoted) {
      return (
        <>
          <div className="result-number">{`${option.result}%`}</div>
          {checked && <CheckCircleIcon aria-hidden className="checked-icon" />}
        </>
      );
    }
    return (
      <FormControlLabel
        value="female"
        control={
          <Radio
            checked={checked}
            onChange={() => select(option.id, !checked)}
            color="primary"
            size="small"
            disableRipple
            disabled={isCreateMode}
            readOnly={!isEditMode || !isCreateMode}
          />
        }
      />
    );
  }

  return (
    <div
      className="option-container"
      onClick={!isCreateMode ? () => select(option.id, !checked) : null}
    >
      <div className={`option-heading ${checked ? "checked" : ""}`}>
        {renderOptionHeading()}
      </div>
      <div className="wrapper">
        <div className="option-field">
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
            <DeleteButton
              onClick={handleDelete}
              className="delete-icon-container"
            />
          )}
        </div>
        <div className={`result-container ${isVoted ? "voted" : ""}`}>
          <div className="bar-container">
            <div className="bar" style={{ width: `${option.result}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Option;
