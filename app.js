const currentImplementedPoet = 16;
const app = Vue.createApp({
    data() {
        return {
            Title: 'ストップボタンで一首選ぼう',
            stopTitle: '今日の百人一首',
            randomNumber: null,
            intervalId: null,
            isStarted: false,
            isStopped: false,
            isDataLoaded: false,
            showImage: false,
            ImagePath: null,
            items: []
        };
    },
    methods: {
        start() {
            this.isStarted = true;
            this.isStopped = false;
            this.showImage = true;
            //this.randomNumber = 1;
            this.intervalId = setInterval(() => {
                this.randomNumber = Math.floor(Math.random() * currentImplementedPoet) + 1;
                this.ImagePath = this.items[this.randomNumber - 1].ImagePath;
            }, 100);
        },
        stop() {
            clearInterval(this.intervalId);
            this.isStarted = false;
            this.isStopped = true;
            this.showImage = false;
            this.randomNumber = Math.floor(Math.random() * currentImplementedPoet) + 1;
            const selectedItem = this.items.find((item) => item.No === this.randomNumber);
            this.Poet = selectedItem.Poet;
            this.Author = selectedItem.Author;
            this.Description = selectedItem.Description;
            switch (true) {
                case this.Description.length > 80:
                    document.documentElement.style.setProperty('--font-size', '4vw');
                    break;
                case this.Description.length > 78:
                    document.documentElement.style.setProperty('--font-size', '4.1vw');
                    break;
                case this.Description.length > 44:
                    document.documentElement.style.setProperty('--font-size', '4.3vw');
                    break;
                case this.Description.length > 34:
                    document.documentElement.style.setProperty('--font-size', '4.6vw');
                    break;
                default:
                    document.documentElement.style.setProperty('--font-size', '5vw');
            }
            this.ColorName = selectedItem.ColorName;
            this.ColorCode = selectedItem.ColorCode;
            adjustTextColor(this.ColorCode);
            this.ImagePath = selectedItem.ImagePath;
        },
        goHome() {
            this.isStarted = false;
            this.isStopped = false;
            this.randomNumber = null;
        },
        splitPoet() {
            return this.Poet.split(' ');
        }
    },

    async mounted() {
        const response = await fetch('data.csv');
        const csvData = await response.text();
        const rows = csvData.split('\n');
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',');
            if (row.length === 7) {
                this.items.push({ No: parseInt(row[0]), Poet: row[1], Author: row[2], Description: row[3], ColorName: row[4], ColorCode: "#" + row[5], ImagePath: "images/" + row[6] + ".jpg" });
            }
        }
        this.isDataLoaded = true;
    },
});

app.mount('#app');

function getBrightness(hexColor) {
    const rgb = parseInt(hexColor.toString().slice(1), 16);   // 先頭の'#'を取り除き、16進数を10進数に変換
    const r = (rgb >> 16) & 0xff;  // RGBのR値を取得
    const g = (rgb >>  8) & 0xff;  // RGBのG値を取得
    const b = (rgb >>  0) & 0xff;  // RGBのB値を取得

    // 明るさを計算（ここでは単純にR,G,Bの平均値を取っていますが、より精度の高い計算方法も存在します）
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness;
}

function adjustTextColor(backgroundColor) {
    const brightness = getBrightness(backgroundColor);
    if (brightness < 128) {  // 背景が十分に暗い場合
        document.documentElement.style.setProperty('--text-color', 'white');  // テキストの色を白に設定
    } else {  // 背景が明るい場合
        document.documentElement.style.setProperty('--text-color', 'black');  // テキストの色を黒に設定
    }
}
