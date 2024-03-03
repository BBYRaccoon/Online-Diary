import useImage from "use-image";
import React, { useState, useEffect, useRef } from "react";
import { Image as KonvaImage, Group, Transformer, Rect, Text } from "react-konva";
import { useHoverDirty } from "react-use";

export const Sticker = ({ image, onDelete, onDragEnd, onChange }) => {
  const isText = (image.isText ? image.isText: false);
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

  const onTransformEndcallback = (e) => {
    const node = imageRef.current;
    const scalerX = node.scaleX();
    const scalerY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    // if (isText) {

    // } else {
    //   onChange({
    //     ...image,
    //     x: image.x,
    //     y: image.y,
    //     width: image.width * scalerX,
    //     height: image.height * scalerY
    //   });
    // }
    onChange({
      ...image,
      x: image.x,
      y: image.y,
      width: image.width * scalerX,
      height: image.height * scalerY,
      rotation: node.rotation()
    });
    
    setIsSelected(false);
  };

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
      {!isText && (<KonvaImage
        ref={imageRef}
        width={stickerWidth}
        height={stickerHeight}
        image={stickerImage}
        onClick={()=>setIsSelected(true)}
        onTransformEnd={onTransformEndcallback}
      />)}
      {isText && (
        <> 
          <Rect
            ref={imageRef}
            width={stickerWidth}
            height={stickerHeight}
            onClick={()=>setIsSelected(true)}
            onTransformEnd={onTransformEndcallback}/>
          <Text fontSize={40} fontFamily={"Work Sans"} fill={"#333A73"} text={image.text} align="center" rotation={image.rotation}></Text>
        </>
      )}
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