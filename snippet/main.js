const VIDEO_SCREEN = ".__video_screen";
const PUSH_SIZE = "h3";
const FONT_COLOR = "white";
const FONT_SIZE = 33;
const TOP = 40;
const LEFT = 40;
const Z_INDEX = 100000000;

/**
 * 
 */
class Bullet {
    /**
     * @param {string} pushComment - The text of the pushComment
     * @param {string} videoScreen - The class name of the parent node
     */
    constructor(pushComment, videoScreen) {
        // default bullet style setting
        this.fontColor = FONT_COLOR;
        this.fontSize = FONT_SIZE;
        this.top = TOP;
        this.left = LEFT;
        this.z_index = Z_INDEX;

        this.bullet = document.createElement(PUSH_SIZE);
        this.bulletText = document.createTextNode(pushComment);
        this.bullet.appendChild(this.bulletText);
        
        this.videoScreen = document.querySelector(videoScreen);
        // set the initial position HERE
        this.setBulletStyle();
        this.videoScreen.appendChild(this.bullet);
    }

    /**
     * @param {string} size - the string containing the size of the bullet
     */
    setFontSize(size) {
        this.fontSize = size;
    } 

    setFontColor(color) {
        this.fontColor = color;
    }

    setTop(top) {
        this.top = top;
        this.setBulletStyle();
    }

    getTop() {
        return this.top;
    }

    deleteBullet() {
        this.bullet.parentNode.removeChild(this.bullet);
    }

    // Set the new bullet style to DOM
    setBulletStyle() {
        const style_fontColor = `color: ${this.fontColor};`;
        const style_fontSize = `font-size: ${this.fontSize.toString()}px;`;
        const style_top = `top: ${this.top.toString()}px;`;
        const style_left = `left: ${this.left.toString()}px;`;
        this.bullet.style.cssText += style_fontColor + style_fontSize + style_top + style_left + "position: absolute;" + `z-index: ${this.z_index.toString()}`;
    }
}



const getData = async () => {
    let rawResponse = await fetch('https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=3&$format=JSON');
    let response = await rawResponse.json();
    return response[2].Name;
}

let bulletList = [];
const bulletMainLoop = async () => {
    let bulletText = await getData(); 
    let bullet = new Bullet(bulletText, VIDEO_SCREEN);
    bulletList.push(bullet);

    // TIMER
    window.setInterval(() => {
    for (let bullet of bulletList) {
            if (bullet.getTop() <= 430) {
                bullet.setTop(bullet.getTop() + 1.5);
            }
            else {
                bullet.deleteBullet();
                // remove the bullet from bulletList
            }
        }
    }, 20);
}

// top: 430px時，刪除bullet物件

bulletMainLoop();


