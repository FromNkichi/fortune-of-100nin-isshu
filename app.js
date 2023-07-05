const currentImplementedPoet = 16;
const app = Vue.createApp({
    data() {
        return {
            Title: 'ストップボタンで 1 首選ぼう',
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
            this.ImagePath = selectedItem.ImagePath;
        },
        goHome() {
            this.isStarted = false;
            this.isStopped = false;
            this.randomNumber = null;
        },
        splitPoet: function () {
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