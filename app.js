const app = Vue.createApp({
    data() {
        return {
            Title: 'ストップボタンで 1 首選ぼう',
            stopTitle: '今日の百人一首',
            randomNumber: null,
            intervalId: null,
            isStarted: false,
            isStopped: false,
            items: []
        };
    },
    methods: {
        start() {
            this.isStarted = true;
            this.isStopped = false;
            this.randomNumber = 1;
            /*
            this.intervalId = setInterval(() => {
                this.randomNumber = Math.floor(Math.random() * 100) + 1;
            }, 100);
            */
        },
        stop() {
            this.isStarted = false;
            this.isStopped = true;
            const selectedItem = this.items.find((item) => item.No === this.randomNumber);
            console.log(selectedItem);
            this.Poet = selectedItem.Poet;
            this.Author = selectedItem.Author;
            this.Description = selectedItem.Description;
            this.ColorName = selectedItem.ColorName;
            this.ColorCode = selectedItem.ColorCode;
            this.ImagePath = selectedItem.ImagePath;
        },
        goHome() {
            this.isStarted = false;
            this.isStopped = false;
            this.randomNumber = null;
        }
    },
    async mounted() {
        const response = await fetch('data.csv');
        const csvData = await response.text();
        const rows = csvData.split('\n');
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',');
            console.log(row);
            if (row.length === 7) {
                this.items.push({ No: parseInt(row[0]), Poet: row[1], Author: row[2], Description: row[3], ColorName: row[4], ColorCode: row[5], ImagePath: row[6] });
            }
        }
    },

});

app.mount('#app');

