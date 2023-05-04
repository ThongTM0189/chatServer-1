
var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

var UrlParams = new URLSearchParams(window.location.search);
var APIMess = "http://localhost:3000/message";

var userId = Number.parseInt(UrlParams.get('userId'));

function handleEvent(){
    //send message click event
    const btnSend = $('#textSubmit');
    const textSubmit = $('#textBoxChat');
    
    btnSend.onclick = function(){
        const textSubmitMessage = textSubmit.value;
        if(textSubmitMessage !== ""){
            textSubmit.value = "";
            sendMessage(textSubmitMessage);
        }
    }
    //send message keyboard event
    window.onkeydown = function(event){
        const textSubmitMessage = textSubmit.value;
        if(event.keyCode === 13 && textSubmitMessage !== ""){
            textSubmit.value = "";
            sendMessage(textSubmitMessage);
        }
    }
}

var deleteMessage = (id)=>{
    const option ={
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
    }
    fetch(APIMess+`/${id}`, option);
}

var likeMessage = (id,userid,checkLike,mess)=>{
    const option ={
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            userId: userid,
            message: mess,
            like: !checkLike
        })
    }
    fetch(APIMess+`/${id}`, option);
}

function sendMessage(message){
    const option ={
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            message: message,
            like: false,
        })
    }
    fetch(APIMess, option);
}

function getMessage(callback) {
    fetch(APIMess)
    .then(function(response) {
        return response.json();
    })
    .then(callback);
}


function renderMessage(messages){
    const boxShowMessage = $('.boxChat');
    var lisMess = messages.map(function(message){
        var like = message.like ? 'heart' : 'heart-outline'
        if(message.userId === userId){
            return React.createElement('div',{
                class: `content d-flex justify-content-end align-items-center`
            },
                React.createElement('button', {
                    class:`d-flex btn-delete mess-${message.id}`,
                    onClick: () => {deleteMessage(message.id)}
                },
                'Delete'),
                React.createElement('p', {
                    class: 'mess'
                },
                message.message),
                React.createElement('ion-icon', {
                    name: like,
                    class: "like",
                },
                null),
            )
        }
        return React.createElement('div',{
            class: 'content d-flex justify-content-start align-items-center'
        },
            React.createElement('p', {
                class: 'mess'
            },
            message.message),
            React.createElement('ion-icon', {
                name: like,
                class: "like",
                onClick: () => {likeMessage(message.id,message.userId,message.like,message.message)}
            },
            null),
        )

    })
    var root = ReactDOM.createRoot(boxShowMessage);
    root.render(lisMess);
}

function start(){
    getMessage(renderMessage);
    handleEvent();
    /* setInterval(function(){
        getMessage(renderMessage);
    },1000); */
}

start()



