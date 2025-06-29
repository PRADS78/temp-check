import PropTypes from "prop-types";
import { useState } from "react";
import { useRef } from "react";
import { Children, cloneElement } from "react";
import styles from "./Accordion.module.scss";

const AccordionContainer = ({ children }) => {
  const [listItem, setListItem] = useState(Children.toArray(children));
  const allListRef = useRef(listItem);

  const [dragItem, setDragItem] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [dropIndex, setDropIndex] = useState(-1);
  const [dragOverIndex, setDragOverIndex] = useState(-1);

  const onDragStart = (e, { index, key }) => {
    setDragItem({ index, key });
  };

  const onDragEnd = (e) => {
    setDragItem({});
    setDragOverIndex(-1);
    e.dataTransfer.effectAllowed = "uninitialized";
    e.dataTransfer.dropEffect = "none";
  };

  // eslint-disable-next-line no-unused-vars
  const onDrop = (e, { index, key }) => {
    e.preventDefault();
    if (dragItem.index !== index) {
      allListRef.current = listItem;
    }
  };

  const rearrangeListItems = (_dragOverIndex) => {
    const allItems = [...allListRef.current];
    const dragItemContent = allItems[dragItem.index];
    allItems.splice(dragItem.index, 1);
    allItems.splice(_dragOverIndex, 0, dragItemContent);
    setListItem(allItems);
  };

  // eslint-disable-next-line no-unused-vars
  const onDragOver = (e, { index, key }) => {
    e.preventDefault();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
    if (dragOverIndex !== index) {
      rearrangeListItems(index);
    }
  };

  return (
    <div className={styles.accordionContainer}>
      {Children.map(listItem, (child, index) => {
        const isDragging = dragItem.key === child.key;
        const isDropping = dropIndex === index;
        const isDragOver = dragOverIndex === index;
        return (
          <div
            className={`${styles.dndItem} ${
              isDragging ? styles.isDragged : ""
            } ${isDropping ? styles.isDropping : ""} ${
              isDragOver ? styles.isDragOver : ""
            }`}
            draggable={true}
            onDragStart={(e) => onDragStart(e, { key: child.key, index })}
            onDragOver={(e) => onDragOver(e, { key: child.key, index })}
            onDragEnd={(e) => onDragEnd(e, { key: child.key, index })}
            onDrop={(e) => onDrop(e, { key: child.key, index })}
            key={child.key}
          >
            {cloneElement(child, {
              isDraggable: true,
            })}
          </div>
        );
      })}
    </div>
  );
};

AccordionContainer.propTypes = {
  children: PropTypes.any,
};

export default AccordionContainer;
