import React, { useState, createRef, useCallback } from "react";
import { Image as KonvaImage, Layer, Stage } from 'react-konva';
import useImage from 'use-image';
import Toolkits from "components/partials/Toolkits/Toolkits";
import { stickersData } from "data/Images";
import { Sticker } from "components/partials/ToolComponents/Sticker/Sticker";

function Designer() {
    const [image] = useImage("/diary_bg.png");
    const toolTypes = { sticker: 'sticker', customizedSticker: 'customize', text: 'text'};
    const addStickerToCanvas = ({ src, width, height, x, y}) => {
      setSticers((currentStickers) => [
        ...currentStickers,
        { width, height, x, y, src, resetButtonRef: createRef()}
      ]);
    };

    const defaultToolConfig = {
      objs: stickersData,
      objType: toolTypes.sticker,
      callBack: addStickerToCanvas
    }

    const toolConfigs = {
      'sticker': defaultToolConfig,
      'customize': {
        objs: stickersData,
        objType: toolTypes.customizedSticker,
        callBack: addStickerToCanvas
      },
      'text': {
        objs: stickersData,
        objType: toolTypes.text,
        callBack: addStickerToCanvas
      } 
    }

    const [stickers, setSticers] = useState([]);
    const [currentTool, setCurrentTool] = useState(toolTypes.sticker);
    const [toolConfig, setToolConfig] = useState(defaultToolConfig);

    const resetAll = useCallback(() => {
      stickers.forEach((sticker) => {
        if (sticker.resetButtonRef.current) {
          sticker.resetButtonRef.current();
        }
      });
    }, [stickers]);

    const handleCanvasClick = useCallback(
      (e) => {
        if (e.target.attrs.id === 'bg-image') {
          resetAll();
        }
      }, [resetAll]
    );

    return (
        <>
          <div className="designer-container">
            Designer Page
            <Stage width={1500} height={750} onClick={handleCanvasClick}>
                <Layer>
                    <KonvaImage image={image} id="bg-image"></KonvaImage>
                    {stickers.map((sticker, index) => {
                      return (
                        <Sticker 
                          onDelete={() => {
                            const newStickers = [...stickers];
                            newStickers.splice(index, 1);
                            setSticers(newStickers);
                          }}
                          onDragEnd={(e) => {
                            sticker.x = e.target.x();
                            sticker.y = e.target.y();
                          }}
                          key={index}
                          image={sticker}
                        />
                      )
                    })}
                </Layer>
            </Stage>
          </div>
          <div className="tool-selector">
            Tools Controller
            {Object.keys(toolTypes).map((k, index) => (
              <button key={`tool-${index}`} onClick={() => {
                setCurrentTool(toolTypes[k]);
                setToolConfig(toolConfigs[currentTool]);
              }}>{toolTypes[k]}</button>
            ))}
          </div>
          <div className="toolkits-container">
            Toolkits
            <Toolkits {...toolConfig}></Toolkits>
          </div>
        </>
    );
}

export default Designer;