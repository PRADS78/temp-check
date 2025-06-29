import { useEffect, useState } from "react";
import styles from "./RecommendedImagesView.module.scss";
import PropTypes from "prop-types";
import { LeftArrowIcon, RightArrowIcon } from "../../../Icons";
import { ImageProviderName } from "../../../Enums";

const RecommendedImagesView = ({
  defaultSearchText,
  onImageSelect,
  accessToken,
  description,
  onLoad,
  imageServiceUrl,
}) => {
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(-1);
  const [providerName, setProviderName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 6;

  useEffect(() => {
    fetch(imageServiceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
      body: JSON.stringify({
        title: defaultSearchText,
        description: description,
        orientation: "Horizontal",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setImages(res.images);
        setTotalImages(res.total);
        setProviderName(res.providerName);
        onLoad(res.providerName);
      });
  }, [defaultSearchText, accessToken, description, onLoad, imageServiceUrl]);

  const pages = Math.ceil(totalImages / imagesPerPage);

  const onPreviousPage = () => {
    setCurrentPage((previousPage) => previousPage - 1);
  };
  const onNextPage = () => {
    setCurrentPage((previousPage) => previousPage + 1);
  };

  const currentPageImages = images.slice(
    (currentPage - 1) * imagesPerPage,
    currentPage * imagesPerPage
  );

  return (
    <section className={styles.recommendedImageContainer} role="region">
      <div className={styles.gridContainer}>
        {currentPageImages.map((image) => (
          <div className={styles.image} key={image.imageId}>
            {providerName === ImageProviderName.UNSPLASH && (
              <div className={styles.providerContainer}>
                <a href={image.creditUrl} target="_blank" rel="noreferrer">
                  {image.photoTakenBy}
                </a>
              </div>
            )}
            <img
              src={image.smallImageUrl}
              onClick={() => onImageSelect(image)}
            ></img>
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className={styles.paginationContainer}>
          <LeftArrowIcon
            isDisabled={currentPage === 1}
            onClick={onPreviousPage}
            uniqueId={1679465246479}
            className={styles.controllers}
            data-role="previous-button"
          />

          {Array.from({
            length: pages,
          }).map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`${styles.navigationButton} ${
                index + 1 === currentPage ? styles.active : ""
              }`}
              role="button"
              data-role="navigation-button"
            />
          ))}

          <RightArrowIcon
            isDisabled={currentPage === pages}
            onClick={onNextPage}
            uniqueId={1679465246578}
            className={styles.controllers}
            data-role="next-button"
          />
        </div>
      )}
    </section>
  );
};

RecommendedImagesView.propTypes = {
  defaultSearchText: PropTypes.string,
  onImageSelect: PropTypes.func.isRequired,
  accessToken: PropTypes.string.isRequired,
  description: PropTypes.string,
  onLoad: PropTypes.func,
  imageServiceUrl: PropTypes.string,
};

/* istanbul ignore next */
RecommendedImagesView.defaultProps = {
  defaultSearchText: "",
  onImageSelect: () => undefined,
  accessToken: "",
  description: "",
  onLoad: () => undefined,
  imageServiceUrl: "https://imagesearch-msvc.disprz.com/images",
};

export default RecommendedImagesView;
