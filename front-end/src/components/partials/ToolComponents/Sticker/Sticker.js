import useImage from "use-image";
import React, { useState, useEffect, useRef } from "react";
import { Image as KonvaImage, Group, Transformer } from "react-konva";
import { useHoverDirty } from "react-use";

export const Sticker = ({ image, onDelete, onDragEnd, onChange }) => {
  const imageRef = useRef(null);
  const transformRef = useRef();
  const isHovered = useHoverDirty(imageRef);
  const [stickerImage] = useImage(image.src);
  const [deleteImage] = useImage("./shared/delete.png");
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  
  image.resetButtonRef.current = () => {
    setShowDeleteButton(false);
  };

  const [isDragging, setIsDragging] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const stickerWidth = image.width * 5;
  const stickerHeight = image.height * 5;

  const checkDeselect = (e) => {
    if (e.target === e.target.getStage()) {
      setIsSelected(false);
    }
  }

  useEffect(() => {
    if (isHovered) {
      setShowDeleteButton(true);
    } else {
      setTimeout(() => {
        setShowDeleteButton(false);
      }, 2000);
    }
    if(isSelected) {
      transformRef.current.nodes([imageRef.current]);
      transformRef.current.getLayer().batchDraw();
    }
  }, [isHovered, isSelected]);

  return (
    <Group
      draggable
      x={image.x}
      y={image.y}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event) => {
        setIsDragging(false);
        onDragEnd(event);
      }}
      onMouseDown={checkDeselect}
    >
      <KonvaImage
        ref={imageRef}
        width={stickerWidth}
        height={stickerHeight}
        image={stickerImage}
        onClick={()=>setIsSelected(true)}
        onTransformEnd={(e) => {
          const node = imageRef.current;
          const scalerX = node.scaleX();
          const scalerY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          
          onChange({
            ...image,
            x: image.x,
            y: image.y,
            width: image.width * scalerX,
            height: image.height * scalerY
          });
          setIsSelected(false);
        }}
      />
      {showDeleteButton && !isDragging && (
        <KonvaImage
          onClick={onDelete}
          image={deleteImage}
          width={25}
          height={25}
          offsetX={-stickerWidth / 2 - 20}
        />
      )}
      {isSelected && (
        <Transformer ref={transformRef}/>
      )}
    </Group>
  );
};