import { useMemo } from "react";
import styles from "./Avatar.module.scss";
import PropTypes from "prop-types";
function Avatar(props) {
  const renderName = useMemo(() => {
    const [firstName, lastName] = props.name.split(" ");
    return (
      <div>
        {firstName[0]}
        {lastName ? lastName[0] : ""}
      </div>
    );
  }, [props.name]);

  return (
    <div className={`${styles.avatar}`} style={{ height: `${props.size}px` }}>
      {props.imageUrl ? (
        <img
          src={props.imageUrl}
          alt={props.name}
          height={`${props.size}px`}
          width={`${props.size}px`}
        />
      ) : (
        renderName
      )}
    </div>
  );
}

Avatar.propTypes = {
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
};

Avatar.defaultProps = {
  size: 36,
};

export default Avatar;
