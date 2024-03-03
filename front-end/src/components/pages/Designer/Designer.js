import React, { useState, createRef, useCallback, useEffect } from "react";
import { Image as KonvaImage, Layer, Stage } from 'react-konva';
import useImage from 'use-image';
import Toolkits from "components/partials/Toolkits/Toolkits";
import { stickersData } from "data/Images";
import { Sticker } from "components/partials/ToolComponents/Sticker/Sticker";
import CustomizeCanvas from "components/partials/CustomizeCanvas/CustomizeCanvas";

function Designer() {
    const toolTypes = { sticker: 'sticker', customizedSticker: 'customize', text: 'text'};
    const [image] = useImage("/Frame 1.png");


    const [textData, setTextData] = useState([]);

    const addStickerToCanvas = (object) => {
      setStickers((currentStickers) => [
        ...currentStickers,
        { ...object, resetButtonRef: createRef()}
      ]);
    };

    const handleAddText = (text) => {
      setTextData((currentTexts) => [
        ...currentTexts,
        {
          text: text,
          isText: true,
          width: 15,
          height: 15,
          x: 200,
          y: 200
        }
      ])
    }
    
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
        objs: textData,
        objType: toolTypes.text,
        callBack: addStickerToCanvas
      } 
    }

    const [stickers, setStickers] = useState([]);
    const [currentTool, setCurrentTool] = useState(toolTypes.sticker);
    const [toolConfig, setToolConfig] = useState(defaultToolConfig);
    const [openModal, setOpenModal] = useState(false);

    const [textInput, setTextInput] = useState({
      isVisible: false,
      value: 'Input text',
      x: 200,
      y: 200,
    });

    const handleCustomizeSelect = () => {
      setCurrentTool(toolTypes.customizedSticker);
      setToolConfig(toolConfigs[currentTool]);
      setOpenModal(true);
    };

    const handleCloseModal = () => {
      setOpenModal(false);
    }

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        // addTextToCanvas(textInput.value, textInput.x, textInput.y);
        setTextInput({ ...textInput, isVisible: false, value: '' });
        handleAddText(textInput.value);
      } else if (e.key === 'Escape') {
        setTextInput({ ...textInput, isVisible: false, value: '' });
      }
    };
    
    useEffect(() => {
      setToolConfig(toolConfigs[currentTool]);
    }, [currentTool, textData]);
    
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
          {/* <div className="toolkits-container">
            Toolkits
            <Toolkits objs={stickersData} objType={"imgButton"} callBack={addStickerToCanvas}></Toolkits>
          </div> */}
          <div className="designer-container">
              <h2>Start your own journey.</h2> {/* Wrap the text in a <h2> tag for styling */}
            <Stage width={1800} height={1000} onClick={handleCanvasClick}>
                <Layer>
                    <KonvaImage image={image} id="bg-image" x={300} />
                    {stickers.map((sticker, index) => {
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
                  if (toolTypes[k] === 'customize') {
                    handleCustomizeSelect();
                  } else if (toolTypes[k] === 'text') {
                    handleTextToolSelect();
                  } else {
                    setCurrentTool(toolTypes[k]);
                    setToolConfig(toolConfigs[currentTool]);
                  }
              }}>
                {toolTypes[k]}
              </button>
            ))}
          </div>
          {
            openModal && <CustomizeCanvas open={openModal} handleClose={handleCloseModal} />
          }
          <div className="toolkits-container">
            <Toolkits {...toolConfig}></Toolkits>
          </div>
        </>
    );
}

export default Designer;