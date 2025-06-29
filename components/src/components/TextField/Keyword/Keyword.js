import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowClick } from "../../../hooks";
import styles from "./Keyword.module.scss";
import { ArrowDownIcon, ContainedCloseIcon } from "../../../Icons";
import { Accordion, WobbleRotate } from "../../../Animation";
import { TextFieldTypes } from "../../../Enums";
import PropTypes from "prop-types";
function Keyword(props) {
  const { onChange } = props;
  const inputRef = useRef();
  const menuRef = useRef();
  const [accordionReRenderKey, setAccordionReRenderKey] = useState(Date.now());
  const [chosenKeyword, setChosenKeyword] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useWindowClick(
    useCallback(
      (event) => {
        const textField = event.target.closest(`div.${props.textFieldClass}`);
        if (!textField) {
          setExpanded(false);
        }
      },
      [props.textFieldClass]
    )
  );

  const createKeywordDisabled = useCallback(() => {
    if (!inputRef.current) return true;
    if (keywords.includes(inputRef.current.value)) return true;
    return inputRef.current.value.length < 1;
  }, [keywords]);

  useEffect(
    function focusInput() {
      if (expanded) {
        inputRef.current?.focus();
        setAccordionReRenderKey(Date.now());
      }
      setInputValue("");
    },
    [expanded]
  );

  useEffect(
    function focusInputOnKeywordClear() {
      if (!chosenKeyword) {
        inputRef.current?.focus();
      }
    },
    [chosenKeyword]
  );

  useEffect(
    function initializeKeywords() {
      if (props.value && props.value?.length > 1) {
        setKeywords([props.value]);
        setChosenKeyword(props.value);
      }
    },
    [props.value]
  );

  useEffect(
    function invokeOnChangeCallback() {
      onChange(chosenKeyword);
    },
    [onChange, chosenKeyword]
  );

  const onInputValueChange = (event) => {
    setInputValue(event.target.value);
  };

  const onClickChosenKeyword = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setChosenKeyword(null);
    setExpanded(true);
  };

  const onClickCreateKeyword = () => {
    setKeywords([...keywords, inputValue]);
    setChosenKeyword(inputValue);
    setExpanded(false);
    setInputValue("");
  };

  const onClickLabel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setExpanded(!expanded);
  };

  const onKeyUp = (event) => {
    if (event.key === "Enter") {
      onClickCreateKeyword();
    }
  };

  return (
    <label
      className={`${styles.keyword} ${
        props.isDisabled ? styles.isDisabled : ""
      }`}
      onClick={onClickLabel}
      onKeyUp={onKeyUp}
    >
      {chosenKeyword ? (
        <button className={styles.chosenKeyword} onClick={onClickChosenKeyword}>
          <span className={styles.keywordText}>{chosenKeyword}</span>
          <span className={styles.chosenIcon}>
            <ContainedCloseIcon />
          </span>
        </button>
      ) : expanded ? (
        <input
          ref={inputRef}
          disabled={props.isDisabled}
          name={props.name}
          onChange={onInputValueChange}
          placeholder={props.placeholder}
          type={TextFieldTypes.TEXT}
          value={inputValue}
        />
      ) : (
        <span role="button">{props.placeholder}</span>
      )}
      <WobbleRotate in={expanded}>
        <span className={styles.iconContainer}>
          <ArrowDownIcon />
        </span>
      </WobbleRotate>
      <Accordion
        key={accordionReRenderKey}
        customClass={styles.keywordAccordion}
        contentRef={menuRef}
        expanded={expanded}
      >
        <div ref={menuRef} className={styles.keywordMenu}>
          <ul className={styles.keywordList}>
            <li>
              <button
                disabled={createKeywordDisabled()}
                onClick={onClickCreateKeyword}
              >
                Create &quot;{inputValue}&quot;
              </button>
            </li>
            {keywords.map((keyword, index) => {
              return (
                <li key={index}>
                  <button onClick={() => setChosenKeyword(keyword)}>
                    {keyword}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Accordion>
    </label>
  );
}

Keyword.propTypes = {
  isDisabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  textFieldClass: PropTypes.string,
  value: PropTypes.string,
};

export default Keyword;
