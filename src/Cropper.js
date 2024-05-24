
import React, { useState, useRef } from "react";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "./setCanvasPreview";

const MIN_DIMENSION = 151;
const ASPECT_RATIO = 1;

const Cropper = () => {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const handle = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const imageUrl = reader.result?.toString() || "";
      setSrc(imageUrl);
    });

    reader.readAsDataURL(file);
  };

  const imageload = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
    const initialCrop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(initialCrop, width, height);
    setCrop(centeredCrop);
  };

  const handleCrop = (pixelCrop, percentCrop) => {
    setCrop(percentCrop);
  };

  const handleCropImage = () => {
    if (imgRef.current && previewCanvasRef.current) {
      setCanvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
      );
    }
  };

  return (
    <>
      <div className="conainer">
        <div className="row">
          <div className="col-6">
            <div>
              <input type="file" accept="image/*" onChange={handle} />
            </div>
          </div>
          <div className="col-6">
            {src && (
              <div>
                <ReactCrop
                  onChange={handleCrop}
                  keepSelection
                  aspect={ASPECT_RATIO}
                  minWidth={MIN_DIMENSION}
                  crop={crop}
                >
                  <img ref={imgRef} src={src} alt="ded" onLoad={imageload} />
                </ReactCrop>
                <button
                  className="btn btn-primary fw-bold"
                  onClick={handleCropImage}
                >
                  Crop Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="conatiner">
          <div className="row"><div className="col-12 ms-5"> {crop && (
          <canvas
            ref={previewCanvasRef}
            className="mt-4"
            style={{
              display: "block",
              
              objectFit: "contain",
              width: MIN_DIMENSION,
              height: MIN_DIMENSION,
            }}
          />
        )}
       </div></div>
        </div>
       
      </div>
    </>
  );
};

export default Cropper;

