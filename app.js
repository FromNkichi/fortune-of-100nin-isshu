const app = Vue.createApp({
    data() {
        return {
            title: 'ストップボタンで 1 首選ぼう',
            stopTitle: 'あなたが選んだ 1 首は…',
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
            this.intervalId = setInterval(() => {
                this.randomNumber = Math.floor(Math.random() * 100) + 1;
            }, 100);
        },
        stop() {
            this.isStarted = false;
            this.isStopped = true;
            const selectedItem = this.items.find((item) => item.no === this.randomNumber);
            this.title = selectedItem.title;
            this.description = selectedItem.description;
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
            if (row.length === 3) {
                this.items.push({ no: parseInt(row[0]), title: row[1], description: row[2] });
            }
        }
    },

});

app.mount('#app');

