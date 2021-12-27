import AbstractView from './AbstractView.js';
import { navigateTo } from '../js/router.js';
import ajax from '../js/ajax.js';
import style from '../css/write.css';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('WritePage');
    }

    async getHtml() {
        return `
        <article>
            <form method="post" action="/board">
                <div class="${style.title_wrap}">
                    <input type="text" name="title" class="${style.input} ${style.title}" placeholder="제목">
                    <input type="password" name="password" class="${style.input} ${style.password}" placeholder="비밀번호">
                </div>
                <div class="${style.content_wrap}">
                    <textarea name="content" class="${style.ta_content}"></textarea>
                </div>
                <div class="${style.btnbox}">
                    <div class="${style.right_box}">
                        <button type="submit" class="${style.create_btn} ${style.btn}">등록</button>
                        <button type="button" class="${style.cancle_btn} ${style.btn}">취소</button>
                    </div>
                </div>
            </form>
        </article>
        `
    };

    attachEvent() {
        document.querySelector('form').addEventListener('submit', async e => {
            e.preventDefault();
            const title = e.target.title.value;
            const password = parseInt(e.target.password.value);
            const content = e.target.content.value;
            await ajax('POST', `${this.url}/board`, { title : title, password : password, content : content });
            navigateTo('/board');
        });
    
        document.querySelector(`.${style.cancle_btn}`).addEventListener('click', e => {
            e.preventDefault();
            navigateTo('/board');
        });
    }
}

