function Toolkits({objs, objType, callBack}) {
    return (
        <>
          <div style={{backgroundColor: "gray", height: '60px'}}>
            This is the toolkit box.
            {objs.map(({url, alt, width, height}, index) => {
              const clickCallBack = () => callBack({ src: url, width: width, height: height, x: 100, y: 100 });
              return (
                <button key={`img-button ${index}`} onMouseDown={() => clickCallBack()}>
                  <img src={url} alt={alt} width={width} height={height}/>
                </button>
              );
            })}
          </div>
        </>
    );
}

export default Toolkits;