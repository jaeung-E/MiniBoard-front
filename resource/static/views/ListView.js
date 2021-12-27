import AbstractView from './AbstractView.js';
import ajax from '../js/ajax.js';
import { navigateTo } from '../js/router.js';
import style from '../css/list.css';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('ListPage');
        this.query = location.search === '' ? '?page=1&per_page=10' : location.search;
    }

    async getHtml() {
        return `
        <div class="${style.list_wrap}">
                <ol class="board_list"></ol>
            <div class="${style.btn_wrap}">
                <button type="button" class="${style.write_btn}">글쓰기</button>
            </div>
            <div class="${style.page_wrap}">
                <ol class="${style.page_list}"></ol>
            </div>
        </div>
        `
    };

    async getBoardList() {
        this.data = JSON.parse(await ajax('GET', `${this.url}/board${this.query}`));
        const boardList = document.querySelector(`.board_list`);
        
        for(const obj of this.data.boardList) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            const date = new Date(obj.createDate);
            li.appendChild(a);
            a.classList.add(`${style.board_wrap}`);
            a.setAttribute('href', `/board/${obj.boardId}`);
    
            for(let i = 0; i < 3; i++) {
                const span = document.createElement('span');
                let text;
    
                if(i === 0) {
                    span.classList.add(`${style.title}`);
                    text = document.createTextNode(obj.title);
                } else if(i === 1) {
                    span.classList.add(`${style.board_id}`);
                    text = document.createTextNode(`No. ${obj.boardId}`);
                } else {
                    span.classList.add(`${style.date}`);
                    text = document.createTextNode(this.convertDate(date));
                }
                
                span.appendChild(text);
                a.appendChild(span);
            }
    
            boardList.appendChild(li);
        }
    }

    async getPageList() {
        let perPage = 10;
        let maxPage = 5;
        const pageList = document.querySelector(`.${style.page_list}`);
        const currentPage = parseInt(this.query.match(/page=(\w+)/)[1]);
        const totalPage = Math.ceil(this.data.total / perPage);
        const pageGroup = Math.ceil(currentPage / maxPage);
        const lastPage = pageGroup * maxPage > totalPage ? totalPage : pageGroup * maxPage;
        const firstPage = (pageGroup - 1) * maxPage + 1;
        
        if(pageGroup !== 1) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.setAttribute('href', `/board?page=${firstPage - 1}&per_page=${perPage}`);
            a.classList.add(`${style.prev_btn}`);
            a.classList.add(`${style.btn_link}`);
            a.appendChild(document.createTextNode('<'));
            li.appendChild(a);
            pageList.appendChild(li);
        } 
    
        for(let i = firstPage; i <= lastPage; i++) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            let text;
            a.classList.add(`${style.btn_link}`);
            a.setAttribute('href', `/board?page=${i}&per_page=${perPage}`);
            text = document.createTextNode(`${i}`);

            if(i === currentPage) {
                a.classList.add(`${style.active}`);
            }

            a.appendChild(text);
            li.appendChild(a);
            pageList.appendChild(li);
        } 
    
        if(lastPage < totalPage) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.setAttribute('href', `/board?page=${lastPage + 1}&per_page=${perPage}`);
            a.classList.add(`${style.next_btn}`);
            a.classList.add(`${style.btn_link}`);
            a.appendChild(document.createTextNode('>'));
            li.appendChild(a);
            pageList.appendChild(li);
        }
    }
    
    attachEvent() {
        document.querySelectorAll(`.${style.list_wrap} a`).forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                navigateTo(a.href);
            });
        });

        document.querySelector(`.${style.write_btn}`).addEventListener('click', e =>{
            e.preventDefault();
            navigateTo('/write');
        });
    }
}

