

cl=console.log;
const postForm=document.getElementById('postForm');
const postContainer=document.getElementById('postContainer');
const titleControl=document.getElementById('title');
const contentControl=document.getElementById('content');
const userIdControl=document.getElementById('userId')
const addPost=document.getElementById('addPost');
const updatePost=document.getElementById('updatePost');
const loadControl=document.getElementById('load')


let BASE_URL="https://jsonplaceholder.typicode.com/"
  
let POST_URL=`${BASE_URL}/posts`

function snackbar(title,icon){
    Swal.fire({
        title,
        icon,
        timer:2500
    })
}

const createCards=arr=>{
    let res4=arr.map(p=>{
        return`
         <div id="postContainer">
            <div class="card mb-3 shadow rounded" id=${p.id}>
                <div class="card-header">
                    <h3>${p.title}</h3>
                </div>
                    <div class="card-body">
                        <p class="m-0">${p.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn-sm btn-outline-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn-sm btn-outline-danger" onclick="onRemove(this)">Remove</button>
                    </div> 
                   
        
            </div>
        `
    }).join('')
    postContainer.innerHTML=res4;
}

function fetchData(){
    let XHR=new XMLHttpRequest()

    XHR.open("GET",POST_URL);

    XHR.onload=function(){
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let res=JSON.parse(XHR.response);
            cl(res)
            createCards(res)
        }
    }
    XHR.send(null)
}
fetchData()

function onFetchData(ele){
    ele.preventDefault()

    let POST_OBJ={
        title:titleControl.value,
        body:contentControl.value,
        userId:userIdControl.value

    }
    cl(POST_OBJ)

    let XHR=new XMLHttpRequest()

    XHR.open("POST",POST_URL);
    XHR.setRequestHeader("Content-Type","application/json");

    XHR.onload=function(){
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState){
            let res=JSON.parse(XHR.response);
            
            let card=document.createElement('div')
            card.id=res.id;
            card.className='card mb-3 shadow rounded';
            card.innerHTML=`
                <div class="card-header">
                    <h3>${POST_OBJ.title}</h3>
                </div>
                    <div class="card-body">
                        <p class="m-0">${POST_OBJ.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn-sm btn-outline-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn-sm btn-outline-danger" onclick="onRemove(this)">Remove</button>
                    </div> 
                   
        
            </div>


            
            `
            postContainer.append(card);

            snackbar("Post is created successFully!!!",'success');
        }
    }
    XHR.send(JSON.stringify(POST_OBJ))

  

}

function onRemove(ele){
    Swal.fire({
  title: "Do you want to save the changes?",
  showCancelButton: true,
  confirmButtonText: "Remove",
}).then((result) => {
  if (result.isConfirmed){
        let REMOVE_ID=ele.closest('.card').id
    cl(REMOVE_ID);


    let REMOVE_URL=`${POST_URL}/${REMOVE_ID}`
    cl(REMOVE_URL)
    loader.classList.remove('d-none')
    
    let XHR=new XMLHttpRequest()

    XHR.open("DELETE",REMOVE_URL)

    XHR.onload=function(){
        loader.classList.add('d-none')
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let res=XHR.response;
            
            ele.closest('.card').remove()
        }
    }
    XHR.send(null)
}
    


})



}

function onEdit(eve){

    window.scrollTo({top:0,behavior:'smooth'});
    
    let EDIT_ID=eve.closest('.card').id;
    cl(EDIT_ID);
    loader.classList.remove('d-none')

    localStorage.setItem('EDIT_ID',EDIT_ID)

    let EDIT_URL=`${POST_URL}/${EDIT_ID}`;

    let XHR=new XMLHttpRequest()

    XHR.open("GET",EDIT_URL)

    XHR.onload=function(){
        loader.classList.add('d-none')
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let res=JSON.parse(XHR.response)
            cl(res)
           

            titleControl.value=res.title;
            contentControl.value=res.body;
            userIdControl.value=res.userId;

            addPost.classList.add('d-none')
            updatePost.classList.remove('d-none')

        }
        
    }
    XHR.send(null)
}

function onPostUpdate(){
    let UPDATE_ID=localStorage.getItem('EDIT_ID');
    cl(UPDATE_ID)

    let UPDATE_URL=`${POST_URL}/${UPDATE_ID}`;
    cl(UPDATE_URL)

    let UPDATE_OBJ={
        title:titleControl.value,
        body:contentControl.value,
        userId:userIdControl.value
    }
    cl(UPDATE_OBJ)

    let XHR=new XMLHttpRequest()

    XHR.open("PATCH",UPDATE_URL)
    XHR.setRequestHeader("Content-Type","application/json")

    XHR.onload=function(){
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let res=JSON.parse(XHR.response)
            cl(res)

            let cardElement=document.getElementById(UPDATE_ID)

            if(cardElement){
                cardElement.querySelector('h3').innerText=UPDATE_OBJ.title;
                cardElement.querySelector('p').innerText=UPDATE_OBJ.body;

            postForm.reset()
            addPost.classList.remove('d-none')
            updatePost.classList.add('d-none');

        }
    }
   
}
 XHR.send(JSON.stringify(UPDATE_OBJ))
}

postForm.addEventListener("submit",onFetchData)
updatePost.addEventListener("click",onPostUpdate)









