/**
 * GLOBAL VARIABLES
 */
const VIDEO_SCREEN = ".__video_screen";
const PUSH_SIZE = "h3";
const FONT_COLOR = "white";
const FONT_SIZE = 33;
const TOP = 40;
const LEFT = 0;
const Z_INDEX = 100000000;

/**
 * 
 */
class Bullet {
    /**
     * @param {string} pushComment - The text of the pushComment
     * @param {string} videoScreen - The class name of the parent node
     * @param {Number} randomIndex - The index in BulletTextList, used 
     *                               as a seed to get the randomized top position.
     */
    constructor(pushComment, videoScreen, randomIndex = -1) {
        // default bullet style setting
        this.fontColor = FONT_COLOR;
        this.fontSize = FONT_SIZE;
        this.top = TOP;
        this.left = LEFT;
        this.z_index = Z_INDEX;

        this.randomIndex = randomIndex;

        this.bullet = document.createElement(PUSH_SIZE);
        this.bulletText = document.createTextNode(pushComment);
        this.bullet.appendChild(this.bulletText);
        
        this.videoScreen = document.querySelector(videoScreen);

        // randomize top position
        this.randomizeTop();
        this.randomizeLeft();
        // set the initial position HERE
        this.setBulletStyle();
        this.videoScreen.appendChild(this.bullet);
    }

    // from 10 ~ 520
    randomizeTop() {
        if (this.randomIndex != -1) {
            let localTop = ( ( Date.now() + this.randomIndex*100 ) % 1000 ) + 10;
            this.setTop(localTop);
        }
    }

    randomizeLeft() {
        if (this.randomIndex != -1) {
            let localLeft = (( ( Date.now() + this.randomIndex*100 ) % 50 ) - 28) * 15;
            console.log(localLeft);
            this.setLeft(localLeft);
        }
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

    setLeft(left) {
        this.left = left;
        this.setBulletStyle();
    }

    getLeft() {
        return this.left;
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

class PttBaseballHelper {
    constructor() {
        this.bulletTextList = [];   // initial to empty array
        this.bulletList = [];       // list of all existing bullet instances
    }

    async getTestData() {
        let rawResponse = await fetch('https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=3&$format=JSON');
        let response = await rawResponse.json();
        console.log(response);
        for (let push of response)
            this.bulletTextList.push(push.Name);
    }

    // used for development testing
    setStaticTestData() {
        // this.bulletTextList = [' 我以為你忘了', ' 今天是11播 但是是MOMO拍球', ' 來了', ' 贏定了', ' 留名', ' 那三重球場的大專聯賽是哪邊拍??', ' 歷史性的開賽', ' 來看洋砲', ' 歷史性的', ' 現在統一主場要多一個ELEVEN播momo拍了的製作方式了?', ' 鏞基呢?', ' 味全回歸首戰 王維中首戰 留名', ' 剛剛列隊沒看到洋砲欸', ' 今天是捷盛哦哦哦哦哦', ' 又有新的吉祥物', ' 畫質有差', ' 簽到一下 回歸首戰', ' 打味全來練兵?', ' 要看誰剛好在三重球場有看到轉播車了....', ' 捷盛 今天可以看11了'];
        // this.bulletTextList = [' 我以為你忘了', ' 今天是11播 但是是MOMO拍球', ' 來了'];
        this.bulletTextList = [' 我以為你忘了', ' 今天是11播 但是是MOMO拍球', ' 來了', ' 贏定了', ' 留名', ' 那三重球場的大專聯賽是哪邊拍??', ' 歷史性的開賽', ' 來看洋砲', ' 歷史性的', ' 現在統一主場要多一個ELEVEN播momo拍了的製作方式了?'];
    }

    async createBullets() {
        console.log(this.bulletTextList);
        for (let text of this.bulletTextList) {
            let bullet = new Bullet(text, VIDEO_SCREEN, this.bulletTextList.indexOf(text));
            this.bulletList.push(bullet);
        }
    }

    async startBulletScreen() {
        // await this.getTestData();
        this.setStaticTestData();
        await this.createBullets();

        window.setInterval(() => {
            // move from top to bottom
            // for (let bullet of this.bulletList) {
            //     if (bullet.getTop() <= 430) {
            //         bullet.setTop(bullet.getTop() + 1.5);
            //     } else {
            //         bullet.deleteBullet();
            //         // remove the out-of-boundary bullet object from the list
            //         this.bulletList.splice(this.bulletList.indexOf(bullet), 1);
            //     }
            // }

            // move from left to right
            for (let bullet of this.bulletList) {
                if (bullet.getLeft() <= 1600) {
                    bullet.setLeft(bullet.getLeft() + 1.5);
                } else {
                    bullet.deleteBullet();
                    // remove the out-of-boundary bullet object from the list
                    this.bulletList.splice(this.bulletList.indexOf(bullet), 1);
                }
            }
        }, 20);
    }
}

const pttBaseballHelper = new PttBaseballHelper();
pttBaseballHelper.startBulletScreen();


/**
 * -------------SEPARATION-------------
 */

/**
 * Global Variable For Ptt Comment Request
 */
let bulletList = [];    // List of all existing bullet instances
let timer = null;       // The timer of long poll
const postURL = "";     // PTT Baseball Web Post URL
const dataPollURL = "https://www.ptt.cc/poll/Baseball/M.1615889803.A.3A3.html?cacheKey=2084-348061217&offset=165180&offset-sig=945634653cf6c7f9c6cd84183a6ca21e822a107c";
const dataLongPollURL = "https://www.ptt.cc/v1/longpoll?id=f72ebae044dec61e9996689dc279beef75a37141";
let pollURL = dataPollURL;

/**
 * BELOW FOR OLD DATA FETCH AND BULLET DISPLAY
 */

const getData = async () => {
    let rawResponse = await fetch('https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=3&$format=JSON');
    let response = await rawResponse.json();
    return response[2].Name;
}

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

/**
 * BELOW FOR PTT COMMENT FETCH
 */

const requestLongPoll = async () => {
    try {
        let rawResponse = await fetch(dataLongPollURL);
        let jsonResponse = await rawResponse.json();
        console.log(jsonResponse);
        // add try...catch... later!
        await requestPoll(pollURL + '&size=' + jsonResponse.size + '&size-sig=' + jsonResponse.sig);
    } catch (err) {
        throw (err);
    }

}

const requestPoll = async (url) => {
    try {
        let rawResponse = await fetch(url);
        let jsonResponse = await rawResponse.json();
        // SUCCESS
        if (jsonResponse.success) {
            console.log(jsonResponse);
            await getPushContent(jsonResponse.htmlContent);
            pollURL = jsonResponse.pollUrl;
            // scheduleNextPoll
        }
    } catch (err) {
        throw (err);
    }
        
}

const getPushContent = async (htmlContent) => {
    // parse push content
    let content = htmlContent;
    console.log(content);
}

// requestLongPoll();

// top: 430px時，刪除bullet物件



