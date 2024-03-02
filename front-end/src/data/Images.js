const stickerContext = require.context('../../public/stickers', false);

const stickerFilePath = stickerContext.keys();

const stickersData = stickerFilePath.map(filePath => {
    const fileName = filePath.replace(/^\.\/|\.(png|jpg|jpeg|gif)/ig, '');
    const fullPath = stickerContext(filePath);
    return {
        src: fullPath,
        alt: fileName + ' logo',
        width: 30,
        height: 30
    }
});

export { stickersData };