export default class {
    constructor(params) {
        this.params = params;
        this.url = 'in root url here';
        this.convertDate = date => {
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours() + 1}:${date.getMinutes()}`;
        }
    }

    setTitle(title) {
        document.title = title;
    }

    attachEvent() {}

    async getHtml() {
        return "";
    }
}