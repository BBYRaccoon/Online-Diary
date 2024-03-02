function Toolkits({ objs, objType, callBack }) {
    return (
        <div className="toolkit-container">
            <span className="toolkit-text">Please click on a sticker to add it to the canvas.</span>
            {objs.map(({ url, alt, width, height }, index) => {
                const clickCallBack = () => callBack({ src: url, width: width, height: height, x: 100, y: 100 });
                return (
                    <button className="toolkit-button" key={`img-button-${index}`} onMouseDown={clickCallBack}>
                        <img src={url} alt={alt} width={width} height={height} />
                    </button>
                );
            })}
        </div>
    );
}

export default Toolkits;
