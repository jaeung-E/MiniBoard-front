import AbstractView from './AbstractView.js';
import { navigateTo } from '../js/router.js';
import ajax from '../js/ajax.js';
import style from '../css/write.css';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('UpdatePage');
    }

    async getHtml() {
        return `
        <article>
            <form method="put" action="/board">
                <div class="${style.title_wrap}">
                    <input type="text" name="title" class="${style.input} ${style.title}" placeholder="제목">
                    <input type="password" name="password" class="${style.input} ${style.password}" placeholder="비밀번호">
                </div>
                <div class="${style.content_wrap}">
                    <textarea name="content" class="${style.ta_content}"></textarea>
                </div>
                <div class="${style.btnbox}">
                    <div class="${style.right_box}">
                        <button type="submit" class="${style.create_btn} ${style.btn}">수정</button>
                        <button type="button" class="${style.cancle_btn} ${style.btn}">취소</button>
                    </div>
                </div>
            </form>
        </article>
        `
    }

    async getBoardDetail() {
        const data = JSON.parse(await ajax('GET', `${this.url}/board/${this.params.id}`));
        const title = document.querySelector(`.${style.title}`);
        const content = document.querySelector(`.${style.ta_content}`);

        title.value = data.board.title;
        content.value = data.board.content;
    }

    attachEvent() {
        document.querySelector('form').addEventListener('submit', async e => {
            e.preventDefault();
            const title = e.target.title.value;
            const password = e.target.password.value;
            const content = e.target.content.value;
            await ajax('PUT', `${this.url}/board/${this.params.id}`, { title : title, content : content, password : password });
            navigateTo(`/board/${this.params.id}`);
        });

        document.querySelector(`.${style.cancle_btn}`).addEventListener('click', e => {
            e.preventDefault();
            navigateTo(`/board/${this.params.id}`);
        });
    }
}