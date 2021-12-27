import { router, navigateTo } from './router.js';

window.addEventListener('popstate', router);

document.querySelector('.main-link').addEventListener('click', e => {
    e.preventDefault();
    navigateTo(e.target.href);
});

window.onload = () => {
    router();
}