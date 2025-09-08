import { useEffect, useState } from "react";

export default function ProductMediaGallery({ media, productName }) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const currentMedia = media[currentMediaIndex];

  useEffect(() => {
    const videoIndex = media.findIndex(
      (singleMedia) => singleMedia.type === "video"
    );
    setCurrentMediaIndex(videoIndex !== -1 ? videoIndex : 0);
  }, [media]);

  return (
    <>
      <div className="position-relative">
        {currentMedia?.type === "img" ? (
          <img
            src={currentMedia.url}
            alt={productName}
            className="img-fluid w-100 rounded shadow"
            style={{ minHeight: "200px", objectFit: "cover" }}
          />
        ) : (
          <div className="ratio ratio-16x9">
            <iframe
              src={currentMedia.url}
              title={productName}
              className="rounded shadow"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {media.length > 1 && (
          <>
            <button
              onClick={handlePrevMedia}
              className="btn btn-dark position-absolute top-50 start-0 translate-middle-y ms-2"
            >
              &#10094;
            </button>
            <button
              onClick={handleNextMedia}
              className="btn btn-dark position-absolute top-50 end-0 translate-middle-y me-2"
            >
              &#10095;
            </button>
          </>
        )}
      </div>

      <div className="row mt-3 g-2">
        {media.map((mediaItem, index) => (
          <div key={index} className="col-6 col-md-4 col-lg-3 col-xl-2">
            <img
              src={
                mediaItem.type === "img"
                  ? mediaItem.url
                  : `https://img.youtube.com/vi/${mediaItem.url
                      .split("/")
                      .pop()}/mqdefault.jpg`
              }
              alt={`${productName} ${index + 1}`}
              className={`cursor-pointer ${
                index === currentMediaIndex ? "border-primary border-3" : ""
              }`}
              style={{
                width: "100%",
                height: "70px",
                objectFit: "cover",
              }}
              onClick={() => setCurrentMediaIndex(index)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
