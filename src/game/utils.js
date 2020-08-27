
const tileH = 1;
const tileW = 1;

export function screenToIso(x, y) {
    const posX = ((y * 2 / tileH) + (x / tileW))/2;
    const posY = (y * 2 / tileH) - posX;

    return [posX, posY];
}

