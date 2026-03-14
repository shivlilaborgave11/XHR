cl=console.log;

let BASE_URL="https://jsonplaceholder.typicode.com/";

let POST_URL=`${BASE_URL}/posts`

let XHR=new XMLHttpRequest();

XHR.open("GET",POST_URL);

XHR.onload=function(){
    cl(XHR.status);
    let data=JSON.parse(XHR.response);
    cl(data);
}

XHR.send(null);