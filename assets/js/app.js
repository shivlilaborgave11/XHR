

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



/* const createCards=arr=>{
    let res1=arr.map(p=>{
        return`
      <div id="postContainer">
                <div class="card mb-3 shadow rounded" id="${p.id}">
                    <div class="card-header">
                        <h3>${p.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${p.body}</p>

                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button  class="btn-sm btn-outline-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn-sm btn-outline-danger" onclick="onRemove(this)">Remove</button>
                    </div> 
                </div>
        </div> 

                    



        `
    }).join('')
    cl(res1)
    postContainer.innerHTML=res1;

} */




/* function fetchData(){

    let XHR=new XMLHttpRequest();

    XHR.open("GET",POST_URL)

    XHR.onload=function(){
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let data=JSON.parse(XHR.response)
            createCards(data)
        }
    }
    XHR.send(null)
}
fetchData()

function onFetchData(eve){
    eve.preventDefault()

    loader.classList.remove('d-none')

    let POST_OBJ={
        title:titleControl.value,
        body:contentControl.value,
        userId:userIdControl.value
    }
    cl(POST_OBJ)

    let XHR=new XMLHttpRequest()

    XHR.open("POST",POST_URL)

    XHR.onload=function(){
        loader.classList.add('d-none')
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4 ){
            let res=JSON.parse(XHR.response)
            eve.target.reset()
            
            let card=document.createElement("div")
            card.className="card mb-3 shadow rounded"
            card.id=res.id;
            card.innerHTML=
            `<div id="postContainer">
                    <div class="card-header">
                        <h3>${POST_OBJ.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${POST_OBJ.body}</p>

                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button  class="btn-sm btn-outline-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn-sm btn-outline-danger" onclick="onRemove(this)">Remove</button>
                    </div> 
                </div>
        </div> 
            `

        postContainer.append(card)

        snackbar("your POST is created successfully")
        }
       

    }
    XHR.send(JSON.stringify(POST_OBJ))
}

function onRemove(ele){
loader.classList.remove('d-none')
Swal.fire({
  title: "Do you want to Delete this item",
  showCancelButton: true,
  confirmButtonText: "Remove",
}).then((result) => {
  if (result.isConfirmed) {
    let REMOVE_ID=ele.closest('.card').id;
    cl(REMOVE_ID)

    let REMOVE_URL=`${POST_URL}/${REMOVE_ID}`;
    cl(REMOVE_URL)

    let XHR=new XMLHttpRequest()

    XHR.open("DELETE",REMOVE_URL);

    XHR.onload=function(){
        loader.classList.add('d-none')
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState){
            let res=XHR.response;
            
            ele.closest('.card').remove()

        }

    
    }
    XHR.send(null);

  }
});

    
}

function onEdit(ele){
    let EDIT_ID=ele.closest(".card").id;
    cl(EDIT_ID);

    localStorage.setItem('EDIT_ID',EDIT_ID)

    let EDIT_URL=`${POST_URL}/${EDIT_ID}`;
    cl(EDIT_URL);

    loader.classList.remove('d-none')

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
    cl(UPDATE_ID);

    let UPDATE_URL=`${POST_URL}/${UPDATE_ID}`;
    cl(UPDATE_URL);

    let UPDATE_OBJ={
        title:titleControl.value,
        body:contentControl.value,
        userId:userIdControl.value
    }
    cl(UPDATE_OBJ);



    let XHR=new XMLHttpRequest()

    XHR.open("PATCH",UPDATE_URL)

    XHR.onload=function(){
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let res=JSON.parse(XHR.response)
            cl(res)
            
            let cardElement=document.getElementById(UPDATE_ID)

            if(cardElement){
                cardElement.querySelector('h3').innerHTML=titleControl.value;
                cardElement.querySelector('p').innerHTML=contentControl.value;

                postForm.reset()



                 addPost.classList.remove('d-none')
                 updatePost.classList.add('d-none');
                 snackbar('Item with Id ${UPDATE_ID} Updated SuccessFully!!!,'success')
            }else{
               
                }
        }

    }
    XHR.send(JSON.stringify(UPDATE_OBJ));
}


postForm.addEventListener("submit",onFetchData)
updatePost.addEventListener("click",onPostUpdate) */




/* function fetchdata(){
let XHR=new XMLHttpRequest()

XHR.open("GET",POST_URL)

XHR.onload=function(){
    cl(XHR.readyState)
    cl(XHR.status)
    if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
        let data=JSON.parse(XHR.response)
        createCards(data)
    }

    
}
XHR.send(null)
}

fetchdata()

const onFetchData=(eve)=>{
    //start spinner when request is sent
    loader.classList.remove('d-none')
    eve.preventDefault()

    let POST_OBJ={
        title:titleControl.value,
        body:contentControl.value,
        userId:userIdControl.value,
    }
    cl(POST_OBJ)

    let XHR=new XMLHttpRequest()

    XHR.open("POST",POST_URL)

    XHR.onload=function(){
        //after getting data
        loader.classList.add('d-none')
        cl(XHR.readyState)
        cl(XHR.status)
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let res=JSON.parse(XHR.response)
            cl(res)
            eve.target.reset()
            let card=document.createElement("div");
            card.className="card mb-3 shadow rounded"
            card.id=res.id
            card.innerHTML=`
             <div id="postContainer">
                    <div class="card-header">
                        <h3>${POST_OBJ.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${POST_OBJ.body}</p>

                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button  class="btn-sm btn-outline-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn-sm btn-outline-danger" onclick="onRemove(this)">Remove</button>
                    </div> 
                
        </div> 

            
            
            `

             postContainer.append(card)
             snackbar("your post is created successFully!!!",'success')
        }
       
    }
    XHR.send(JSON.stringify(POST_OBJ))
    
   


}


 function onRemove(eve){

    loader.classList.remove('d-none')
    Swal.fire({
        title: "Do you want to delete this item?",
        showDenyButton: true,
        confirmButtonText: "Remove",
    }).then(result => {
        if (result.isConfirmed) {
        loader.classList.add('d-none')

                let REMOVE_ID=eve.closest('.card').id;
    cl(REMOVE_ID);

    let REMOVE_URL=`${BASE_URL}/posts/${REMOVE_ID}`;
    cl(REMOVE_URL)

    let XHR=new XMLHttpRequest()

    XHR.open("DELETE",REMOVE_URL)

    XHR.onload=function(){
        loader.classList.add('d-none')

        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let res=XHR.response
            cl(res)

            snackbar(`the post with ${REMOVE_ID} deleted!!!`,'success')
             eve.closest('.card').remove();
        }else{
            snackbar(`something went wrong!!!`,'error')
        }

    }

    XHR.send(null)
} 
 });
}

function onEdit(eve){
    let EDIT_ID=eve.closest('.card').id;
    cl(EDIT_ID);

    //save id to localstorage
    localStorage.setItem('EDIT_ID',EDIT_ID)
    //EDIT_URL
    let EDIT_URL=`${POST_URL}/${EDIT_ID}`;
    cl(EDIT_URL);

    loader.classList.remove('d-none')

    //API CALL

    let XHR=new XMLHttpRequest();

    XHR.open("GET",EDIT_URL);

    XHR.onload=function(){
    loader.classList.add('d-none')
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let res=JSON.parse(XHR.response)
            cl(res)

            titleControl.value=res.title;
            contentControl.value=res.body;
            userIdControl.value=res.userID;


            addPost.classList.add('d-none');
            updatePost.classList.remove('d-none');
        }
        
    }
    XHR.send(null)
    
} 

function onPostUpdate(){
    let UPDATE_ID=localStorage.getItem('EDIT_ID');

    let UPDATE_URL=`${POST_URL}/${UPDATE_ID}`;

    let UPDATE_OBJ={
        title:titleControl.value,
        body:contentControl.value,
        userID:userIdControl.value
    }
    cl(UPDATE_OBJ)

    let XHR=new XMLHttpRequest()

    XHR.open("PATCH",UPDATE_URL);

    XHR.onload=function(){
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let res=JSON.parse(XHR.response)
            
           let cardElement= document.getElementById(UPDATE_ID)

           if(cardElement){
            cardElement.querySelector('h3').innerHTML=titleControl.value;
            cardElement.querySelector('p').innerHTML=contentControl.value;
           }
            postForm.reset()
           addPost.classList.remove('d-none')
           updatePost.classList.add('d-none')

          

        }
        
        
    }
    XHR.send(JSON.stringify(UPDATE_OBJ))
}


            

   




 



postForm.addEventListener("submit",onFetchData)
updatePost.addEventListener("click",onPostUpdate)

 */
/* let createCards=arr=>{
    let res1=arr.map(p=>{
        return`
        <div id="postContainer">
        <div class="card mb-3 shadow rounded" id="${p.id}">
                <div class="card-header">
                    <h3>${p.title}</h3>
                </div>
                    <div class="card-body">
                        <p class="m-0">${p.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button  class="btn-sm btn-outline-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn-sm btn-outline-danger" onclick="onRemove(this)">Remove</button>
                    </div> 
                   
        
            </div>
        `
    }).join('')
    postContainer.innerHTML=res1;

}

function fetchdata(){

    let XHR= new XMLHttpRequest()

    XHR.open("GET",POST_URL)

    XHR.onload=function(){
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let data=JSON.parse(XHR.response)
            cl(data)
            createCards(data)
        }
    }
    XHR.send(null)
}

fetchdata()

function onFetchData(eve){

    loader.classList.remove('d-none')

    eve.preventDefault()
    let POST_OBJ={
        title:titleControl.value,
        body:contentControl.value,
        userId:userIdControl.value
    }
    cl(POST_OBJ);

    let XHR=new XMLHttpRequest()

    XHR.open("POST",POST_URL)

    XHR.onload=function(){
        loader.classList.add('d-none')
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let res=JSON.parse(XHR.response);
            cl(res);
            eve.target.reset()
            let card=document.createElement('div')
            card.className="card mb-3 shadow rounded";
            card.id=res.id;
            card.innerHTML=`
            <div id="postContainer">
                <div class="card-header">
                    <h3>${POST_OBJ.title}</h3>
                </div>
                    <div class="card-body">
                        <p class="m-0">${POST_OBJ.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button  class="btn-sm btn-outline-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn-sm btn-outline-danger" onclick="onRemove(this)">Remove</button>
                    </div> 
                   
        
            </div>
            
            `
           
            snackbar("post is created successfully!!!",'success')
        }else{
            snackbar("something went wrong!!!",'error')
        }
    }
    XHR.send(JSON.stringify(POST_OBJ));
}

function onRemove(eve){
    
     Swal.fire({
        title: "Do you want to delete this item?",
        showDenyButton: true,
        confirmButtonText: "Remove",
    }).then(result => {
        if (result.isConfirmed) {
            //After user confirming loader should start
            loader.classList.remove('d-none')
                let REMOVE_ID=eve.closest('.card').id
    cl(REMOVE_ID)

    let REMOVE_URL=`${BASE_URL}/posts/${REMOVE_ID}`
    cl(REMOVE_URL);

    //make api

    let XHR=new XMLHttpRequest()

    XHR.open("DELETE",REMOVE_URL)

    XHR.onload=function(){
        //after work is done loader should removed 
        loader.classList.add('d-none')
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let res=XHR.response;
            cl(res)
            snackbar(`item with selected id ${REMOVE_ID} deleted`,'success')
            eve.closest('.card').remove()
        }else{
            snackbar("something went wrong!!!",'err')
        }
       

    }

     XHR.send(null)

    



        }
    })
}

function onEdit(eve){
    let EDIT_ID=eve.closest('.card').id;
    cl(EDIT_ID);

    localStorage.setItem('EDIT_ID',EDIT_ID)

    let EDIT_URL=`${POST_URL}/${EDIT_ID}`
    cl(EDIT_URL)

    loader.classList.remove('d-none')

    //make API

    let XHR=new XMLHttpRequest()
//GET data from BE
    XHR.open("GET",EDIT_URL)

    XHR.onload=function(){
        loader.classList.add('d-none')
    
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let res=JSON.parse(XHR.response)

//fill data from server to forms input
          titleControl.value=res.title;
          contentControl.value=res.body;
          userIdControl.value=res.userId;

    

    //switch buttons

            addPost.classList.add('d-none')
            updatePost.classList.remove('d-none')

            

        }else{
            snackbar('something went wrong','err')
        }
    }
   
    XHR.send(null)


}

function onPostUpdata(eve){
   let UPDATE_ID= localStorage.getItem('EDIT_ID')

    let UPDATE_URL=`${POST_URL}/${UPDATE_ID}`;
    cl(UPDATE_URL);

    let UPDATE_OBJ={
        title:titleControl.value,
        body:contentControl.value,
        userId:userIdControl.value
    }
    cl(UPDATE_OBJ)

    let XHR=new XMLHttpRequest()

    XHR.open("PATCH",UPDATE_URL)

    XHR.onload=function(){
        if(XHR.status>=200 && XHR.status<300 && XHR.readyState===4){
            let res=JSON.parse(XHR.response)

     let cardElement=document.getElementById(UPDATE_ID)

     if(cardElement){
        cardElement.querySelector('h3').innerHTML=titleControl.value;
        cardElement.querySelector('p').innerHTML=contentControl.value;

     }

            

            postForm.reset()
            addPost.classList.remove('d-none')
            updatePost.classList.add('d-none')

            snackbar("Posted object successfully",'success')


          

        }else{
            snackbar("something went wrong",'err')
        }
    }
     XHR.send(JSON.stringify(UPDATE_OBJ))
    }
   


    





postForm.addEventListener("submit",onFetchData)
updatePost.addEventListener("click",onPostUpdata) */





