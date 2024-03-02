function Toolkits({ objs, objType, callBack }) {
    const isText = (objType === 'text');
    return (
        <div className="toolkit-container">
            <span className="toolkit-text">Please click on a sticker to add it to the canvas.</span>
            {objs.map((objData, index) => {
              const obj = { ...objData, x: 100, y: 100 };
              const clickCallBack = () => callBack(obj);
              return (
                  <button className="toolkit-button" key={`img-button-${index}`} onMouseDown={clickCallBack}>
                      {!isText && (<img src={obj.src} alt={obj.alt} width={obj.width} height={obj.height} />)}
                      {isText && (<p>{`Text ${index}`}</p>)}
                  </button>
              );
            })}
        </div>
    );
}

export default Toolkits;
