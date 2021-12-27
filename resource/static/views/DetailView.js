import ajax from '../js/ajax.js';
import AbstractView from './AbstractView.js';
import { navigateTo } from '../js/router.js';
import style from '../css/detail.css';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('DetailPage');
    }

    async getHtml() {
        return `
        <div class="${style.title_wrap}">
            <h1 class="${style.title}"><span></span></h1>
            <span class="${style.create_date}"></span>
        </div>
        <div class="${style.content_wrap}">
            <article class="${style.content}"></article>
            <div class="${style.btnbox}">
                <div class="${style.right_box}">
                    <button type="button" class="update_btn ${style.btn}" data-value="update">수정</button>
                    <button type="button" class="${style.delete_btn} ${style.btn}" data-value="delete">삭제</button>
                </div>
            </div>
        </div>
        <div class="${style.comment_wrap}">
            <ol class="${style.comment_list}">
            </ol>
        </div>
        <div class="${style.comment_write_wrap}">
            <form method="post" action="/board/:id/comment">
                <input type="password" name="password" class="${style.comment_write_password}" placeholder="비밀번호">
                <div class="${style.comment_write_content_wrap}">
                    <textarea name="content" class="${style.comment_write_content}" placeholder="댓글 작성"></textarea>
                    <button type="submit" class="comment_submit_btn ${style.btn}">등록</button>
                </div>
            </form>
        </div>
        <div class="${style.modal_wrap} ${style.visual_hidden}">
            <div class="${style.modal_layer}">
                <form method="post" action="/board/:id/auth">
                    <div class="${style.modal_password_area}">
                        <strong>비밀번호를 입력하세요</strong>
                        <input type="password" name="password" class="${style.modal_password}" placeholder="비밀번호">
                    </div>
                    <div class="${style.btn_area}">
                        <button type="submit" class="modal_submit_btn ${style.btn}">확인</button>
                        <button type="button" class="modal_cancle_btn ${style.btn}">취소</button>
                    </div>
                </form>
            </div>
            <div class="${style.modal_dimmed}"></div>
        </div>
        `
    }

    async getBoardDetail() {
        //set board data
        const data = JSON.parse(await ajax('GET', `${this.url}/board/${this.params.id}`));
        const titleWrap = document.querySelector(`.${style.title_wrap}`);
        const title = document.querySelector(`.${style.title}`).firstChild;
        const titleText = document.createTextNode(`${data.board.title}`);
        title.appendChild(titleText);

        const createDate = document.querySelector(`.${style.create_date}`);
        const date = this.convertDate(new Date(data.board.createDate));
        const dateText = document.createTextNode(date);
        createDate.appendChild(dateText);
        titleWrap.appendChild(createDate);

        const content = document.querySelector(`.${style.content}`);
        const contentText = data.board.content.replaceAll(' ', '\u00A0').split('\n');

        for(const line of contentText) {
            content.appendChild(document.createTextNode(`${line}`));
            content.appendChild(document.createElement('br'));
        }

        //set comment data
        const commentList = document.querySelector(`.${style.comment_list}`);

        for(const comment of data.board.Comments) {
            const li = document.createElement('li');
            const span = document.createElement('span');
            const commentContent = document.createTextNode(comment.content);
            const btn = document.createElement('button');
            const btnText = document.createTextNode('X');

            btn.appendChild(btnText);
            btn.classList.add(`${style.comment_delete_btn}`);
            li.classList.add(`${style.comment}`);
            li.setAttribute('data-id', comment.commentId);
            span.appendChild(commentContent);
            li.appendChild(span);
            li.appendChild(btn);
            commentList.appendChild(li);
        }
    }

    createAuthWrap(event) {
        const li = event.target.parentNode;
        const div = document.createElement('div');
        const input = document.createElement('input');
        const authBtn = document.createElement('button');
        const cancleBtn = document.createElement('button');

        div.classList.add(`${style.comment_auth_wrap}`);
        input.setAttribute('type', 'password');
        input.setAttribute('placeholder', '비밀번호');
        authBtn.classList.add(`${style.comment_pwcheck_btn}`);
        authBtn.classList.add(`${style.auth_btn}`);
        authBtn.textContent = '확인';
        cancleBtn.classList.add(`${style.comment_cancle_btn}`);
        cancleBtn.classList.add(`${style.auth_btn}`);
        cancleBtn.textContent = '취소';
        div.appendChild(input);
        div.appendChild(authBtn);
        div.appendChild(cancleBtn);
        li.appendChild(div);
    }

    attachEvent() {
        // board events
        const modalWrap = document.querySelector(`.${style.modal_wrap}`);
        let target;

        document.querySelectorAll(`.${style.right_box} .${style.btn}`).forEach(btn => {
            btn.addEventListener('click', e => {
                target = e.target;
                modalWrap.classList.remove(`${style.visual_hidden}`);
            });
        });
        
        document.querySelector(`.modal_cancle_btn`).addEventListener('click', () => {
            document.querySelector(`.${style.modal_password}`).value = '';
            modalWrap.classList.add(`${style.visual_hidden}`);
        });

        document.querySelector(`.${style.btn_area} .modal_submit_btn`).addEventListener('click', async e => {
            e.preventDefault();
            const element = document.querySelector(`.${style.modal_password}`);
            const pwd = parseInt(element.value);
            const result = JSON.parse(await ajax('POST', `${this.url}/board/${this.params.id}/auth`, { password : pwd })).result;
            element.value = '';
            if(result === 'Y')
                if(target.getAttribute('data-value') === 'update')
                    navigateTo(`/update/${this.params.id}`);
                else {
                    await ajax('DELETE', `${this.url}/board/${this.params.id}`);
                    navigateTo('/board');
                }
            else {
                alert('비밀번호가 일치하지 않습니다.');
            }
        });

        // comment events
        document.querySelector(`.${style.comment_write_wrap} form`).addEventListener('submit', async e => {
            e.preventDefault();
            const obj = {
                content : e.target.content.value,
                password : parseInt(e.target.password.value)
            };
            await ajax('POST', `${this.url}/board/${this.params.id}/comment`, obj);
            navigateTo(`/board/${this.params.id}`);
        });

        document.querySelector(`.${style.comment_list}`).addEventListener('click', e => {
            if(e.target.classList.contains(`${style.comment_delete_btn}`)) {
                const authWrap = document.querySelector(`.${style.comment_auth_wrap}`);
                if(authWrap) authWrap.remove();
                this.createAuthWrap(e);

                document.querySelector(`.${style.comment_pwcheck_btn}`).addEventListener('click', async () => {
                    const commentId = e.target.parentNode.getAttribute('data-id');
                    const input = document.querySelector(`.${style.comment} input`);
                    const obj = { password : parseInt(input.value) };
                    const result = JSON.parse(await ajax('POST', `${this.url}/comment/${commentId}/auth`, obj)).result;

                    if(result === 'Y') {
                        await ajax('DELETE', `${this.url}/comment/${commentId}`);
                        navigateTo(`/board/${this.params.id}`);
                    } else {
                        alert('비밀번호가 일치하지 않습니다.');
                    }

                    input.value = '';
                });

                document.querySelector(`.${style.comment_cancle_btn}`).addEventListener('click', () => {
                    document.querySelector(`.${style.comment_auth_wrap}`).remove();
                });
            }
        });
    }
}
