import { useCallback, useEffect } from "react";
import { InteractionType, KeyCode } from "../../../Enums";

const useComboBox = ({
  comboBoxRef,
  isActive,
  setActive,
  setHighlightedItem,
  setInteractionType,
  setSelectedItem,
  focusInput,
  onTab,
  onBackspace,
}) => {
  const onArrowDown = useCallback(
    (event) => {
      event.preventDefault();
      if (!isActive) {
        setActive(true);
      } else {
        setHighlightedItem(event);
      }
    },
    [isActive, setActive, setHighlightedItem]
  );

  const onArrowUp = useCallback(
    (event) => {
      event.preventDefault();
      if (!isActive) {
        setActive(true);
      } else {
        setHighlightedItem(event);
      }
    },
    [isActive, setActive, setHighlightedItem]
  );

  const onEscape = useCallback(
    // eslint-disable-next-line no-unused-vars
    (event) => {
      setActive(false);
      focusInput();
      // TODO: Focus the input field again
    },
    [focusInput, setActive]
  );

  const onEnter = useCallback(
    (event) => {
      event.preventDefault();
      setSelectedItem(isActive);
    },
    [isActive, setSelectedItem]
  );

  const onSpace = useCallback(
    (event) => {
      if (!isActive) {
        event.preventDefault();
        setActive(true);
      }
    },
    [isActive, setActive]
  );

  const _onTab = useCallback(() => {
    onTab(isActive);
  }, [isActive, onTab]);

  const _onBackspace = useCallback(
    (event) => {
      onBackspace && onBackspace(event);
    },
    [onBackspace]
  );

  const isCombinationKeyEvent = (event) => {
    return event.altKey || event.ctrlKey || event.metaKey;
  };

  const isValidPrintableCharacter = (event) => {
    // Assumption to check if it's a printable character like a, b, c, 1, 2, 3, etc.
    return event.key.length === 1;
  };

  const onKeyDown = useCallback(
    (event) => {
      if (isCombinationKeyEvent(event)) {
        return false;
      }

      setInteractionType(InteractionType.KEYBOARD);

      if (isValidPrintableCharacter(event)) {
        if (!isActive) {
          setActive(true);
        }
      }

      switch (event.code) {
        case KeyCode.ARROW_DOWN:
          onArrowDown(event);
          break;
        case KeyCode.ARROW_UP:
          onArrowUp(event);
          break;
        case KeyCode.ENTER:
          onEnter(event);
          break;
        case KeyCode.ESCAPE:
          onEscape(event);
          break;
        case KeyCode.SPACE:
          onSpace(event);
          break;
        case KeyCode.TAB:
          _onTab(event);
          break;
        case KeyCode.BACKSPACE:
          _onBackspace(event);
          break;
        case KeyCode.PAGE_UP:
        case KeyCode.PAGE_DOWN:
        case KeyCode.HOME:
        case KeyCode.END:
          // Currently not handled
          break;
      }
    },
    [
      _onBackspace,
      _onTab,
      isActive,
      onArrowDown,
      onArrowUp,
      onEnter,
      onEscape,
      onSpace,
      setActive,
      setInteractionType,
    ]
  );

  useEffect(() => {
    const _comboBoxRef = comboBoxRef.current;
    if (_comboBoxRef) {
      _comboBoxRef.addEventListener("keydown", onKeyDown);
    }
    return () => {
      if (_comboBoxRef) {
        _comboBoxRef.removeEventListener("keydown", onKeyDown);
      }
    };
  }, [comboBoxRef, onKeyDown]);
};

export default useComboBox;
