export default function myAjax(method, url, obj) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Accept', 'applcation/json');
    if(method === 'PUT' || method === 'POST')
        xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(obj || null));

    const promise = new Promise((resolve, reject) => {
        xhr.onreadystatechange = (evt) => {
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(new Error('status is not 200'));
                }
            }
        };
    });

    return promise;
};

