import React, { useState } from "react";
import {Button} from 'reactstrap';
import { CSSTransition } from "react-transition-group";

import "./image-with-preview.scss";

const ImageWithPreview = ({ className, src, alt }) => {
  const [previewState, setPreviewState] = useState(false);

  const toggleImagePreview = () => {
    setPreviewState(!previewState);
  }

  return (
    <>
    <div
      className={`image-with-preview ${className}`}
      style={{
        backgroundImage: `url('${src}')`,
      }}
      onClick={toggleImagePreview}
    />
    <CSSTransition
      classNames="imagePreviewAnim"
      in={previewState}
      timeout={200}
      unmountOnExit
    >
      <div className="image-preview">
        <div className="image-preview-bg" onClick={toggleImagePreview} />
        <Button onClick={toggleImagePreview} close />

          <img className="image-preview-img" src={src} alt={alt}/>
      </div>
    </CSSTransition>
    </>
  );
};

export default ImageWithPreview;
