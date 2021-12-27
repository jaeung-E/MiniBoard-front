import ListView from '../views/ListView.js';
import WriteView from '../views/WriteView.js';
import DetailView from '../views/DetailView.js';
import UpdateView from '../views/UpdateView.js';

async function router() {
    const routes = [
        { path : '/board', view : ListView },
        { path : '/write', view : WriteView },
        { path : '/board/:id', view : DetailView },
        { path : '/update/:id', view : UpdateView }
    ];

    let match = routes
    .filter(route => location.pathname.match(pathToRegex(route.path)))
    .map(route => {
        return { route : route, result : location.pathname.match(pathToRegex(route.path))}; 
    })[0];

    if(!match) {
        match = { route : routes[0], result : [] };
    }

    const view = new match.route.view(getParams(match));
    const appRoot = document.querySelector('.app-root');
    appRoot.innerHTML = await view.getHtml();

    if(match.route.path === '/board') {
        await view.getBoardList();
        await view.getPageList();
    }

    if(match.route.path === '/board/:id' || match.route.path === '/update/:id') {
        await view.getBoardDetail();
    }

    view.attachEvent();
}

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const pathToRegex = path => new RegExp(`^${path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)')}$`);

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    const obj = Object.fromEntries(keys.map((key, i) => [key, values[i]]));

    return obj;
}

export { router, navigateTo };