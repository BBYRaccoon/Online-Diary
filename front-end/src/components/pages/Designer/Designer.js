import React, { useState, createRef, useCallback, useEffect, useMemo } from "react";
import { Image as KonvaImage, Layer, Stage, Text } from 'react-konva';
import useImage from 'use-image';
import Toolkits from "components/partials/Toolkits/Toolkits";
import { stickersData } from "data/Images";
import { Sticker } from "components/partials/ToolComponents/Sticker/Sticker";

function Designer() {
    const toolTypes = { sticker: 'sticker', customizedSticker: 'customize', text: 'text'};
    const [image] = useImage("/Frame 1.png");


    const addStickerToCanvas = ({ src, width, height, x, y}) => {
      console.log(src, width, x, y);
      setStickers((currentStickers) => [
        ...currentStickers,
        { width, height, x, y, src, resetButtonRef: createRef()}
      ]);
    };

    const addTextToCanvas = (text, x, y) => {
      setStickers((currentStickers) => [
        ...currentStickers,
        { type: 'text', text, x, y, resetButtonRef: createRef()},
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
        callBack: addTextToCanvas
      } 
    }

    const [stickers, setStickers] = useState([]);
    const [currentTool, setCurrentTool] = useState(toolTypes.sticker);
    const [toolConfig, setToolConfig] = useState(defaultToolConfig);

    const [textInput, setTextInput] = useState({
      isVisible: false,
      value: 'Input text',
      x: 200,
      y: 200,
    });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const startDrag = (e) => {
      setDragging(true);
      setOffset({
        x: e.clientX - textInput.x,
        y: e.clientY - textInput.y,
      });
    };

    const onDrag = useCallback((e) => {
      if (dragging) {
        setTextInput((prevTextInput) => ({
          ...prevTextInput,
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        }));
      }
    }, [dragging, offset.x, offset.y]);

    const endDrag = () => {
      setDragging(false);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        addTextToCanvas(textInput.value, textInput.x, textInput.y);
        setTextInput({ ...textInput, isVisible: false, value: '' });
      } else if (e.key === 'Escape') {
        setTextInput({ ...textInput, isVisible: false, value: '' });
      }
    };
    
    useEffect(() => {
      if (dragging) {
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', endDrag);
        return () => {
          document.removeEventListener('mousemove', onDrag);
          document.removeEventListener('mouseup', endDrag);
        };
      }
    }, [dragging, onDrag]);
    
    const handleTextToolSelect = () => {
      setCurrentTool(toolTypes.text);
      setToolConfig(toolConfigs[currentTool]);
      setTextInput({ ...textInput, isVisible: true });
    };
    
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
              <h2>Start your own journey.</h2> {/* Wrap the text in a <h2> tag for styling */}
            <Stage width={1800} height={1000} onClick={handleCanvasClick}>
                <Layer>
                    <KonvaImage image={image} id="bg-image" x={300} />
                    {stickers.map((sticker, index) => {
                      if (sticker.type === 'text') {
                        return (
                          <Text
                            key={index}
                            text={sticker.text}
                            x={sticker.x}
                            y={sticker.y}
                            draggable
                            onDragEnd={(e) => {
                              const updatedStickers = stickers.slice();
                              updatedStickers[index] = { ...updatedStickers[index], x: e.target.x(), y: e.target.y() };
                              setStickers(updatedStickers);
                            }}
                          />
                        );
                      }
                      return (
                        <Sticker 
                          onDelete={() => {
                            const newStickers = [...stickers];
                            newStickers.splice(index, 1);
                            setStickers(newStickers);
                          }}
                          onDragEnd={(e) => {
                            sticker.x = e.target.x();
                            sticker.y = e.target.y();
                          }}
                          key={index}
                          image={sticker}
                          onChange={(newAttrs) => {
                            const newStickers = [...stickers];
                            newStickers[index] = newAttrs;
                            setStickers(newStickers);
                            console.log("changes occur");
                          }}
                        />
                      )
                    })}
                </Layer>
            </Stage>
          </div>
          {
            textInput.isVisible && (
              <div
                style={{
                  position: 'absolute',
                  top: textInput.y,
                  left: textInput.x,
                  zIndex: 100,
                }}
                onMouseDown={startDrag}
              >
                <input
                  type="text"
                  value={textInput.value}
                  onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
                  onKeyDown={handleKeyPress}
                  autoFocus
                />
              </div>
            )
          }
          <div className="tool-selector">
            Tools Controller
            {Object.keys(toolTypes).map((k, index) => (
              <button 
                key={`tool-${index}`} 
                className="tool-button"
                onClick={() => {
                k === 'text' ? handleTextToolSelect() : setCurrentTool(toolTypes[k])}
              }>
                {toolTypes[k]}
              </button>
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