import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import { get, getDatabase, ref, set, child, update, remove, onValue  } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
const firebaseConfig = {
  apiKey: "AIzaSyAU609d6vYpj0_oA0tzJN3nQyV8BpeOZTs",
  authDomain: "chatserver-1.firebaseapp.com",
  databaseURL: "https://chatserver-1-default-rtdb.firebaseio.com",
  projectId: "chatserver-1",
  storageBucket: "chatserver-1.appspot.com",
  messagingSenderId: "963813432594",
  appId: "1:963813432594:web:a83b6aabe165c0ca4467cb",
  measurementId: "G-VTEVMBJNGP"
};
var UrlParams = new URLSearchParams(window.location.search);
var userId = Number.parseInt(UrlParams.get('userId'));
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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

function sendMessage(message){
  var db = getDatabase();
  numMess += 1;
  console.log(numMess);
  set(ref(db, "messages/"+ numMess),{
    message:message,
    userId: userId,
    like: false,
  }).then(function(){
    console.log("Sent message to database successfully");
  }).catch(function(err){
    alert(err);
  })
}

var deleteMessage = (id)=>{
  var db = getDatabase();
  remove(ref(db, "messages/"+ id))
  .then(function(){
    console.log("Dleted successfully");
  }).catch(function(err){
    alert(err);
  })
}

var likeMessage = (id,userid,checkLike,mess)=>{
  var db = getDatabase();
  set(ref(db, "messages/"+ id),{
    message: mess,
    userId: userid,
    like: !checkLike,
  }).then(function(){
    console.log("change the status of the message was successfully");
  }).catch(function(err){
    alert(err);
  })
}

var numMess;
function getCount(type){
  var db = getDatabase();
  onValue(ref(db), (snapshot) => {
    const data = snapshot.val();
    numMess = Object.keys(data[type]).length + 1;
    
  }, (error) => {
    console.error(error);
  });
  return  numMess;
}

function getIdInlast(type){
  var db = getDatabase();
  onValue(ref(db), (snapshot) => {
    const data = snapshot.val();
    const keys = Object.keys(data[type]);
    const lengthOfKeys = keys.length ;
    const lastKeyString = keys[lengthOfKeys-1]
    const lastKeyInt = Number.parseInt(lastKeyString);
    numMess = lastKeyInt;
  }, (error) => {
    console.error(error);
  });
  return  numMess;
}

function getMessage(callback) {
  var db = getDatabase();
  onValue(ref(db), (snapshot) => {
      const data = snapshot.val();
      callback(data.messages);
  }, (error) => {
      console.error(error);
  });
}

function renderMessage(messages){
  const boxShowMessage = $('.boxChat');
  const listIdmessage = Object.keys(messages);
  var lisMess = listIdmessage.map(function(key){
    const message = messages[key];
      var like = message.like ? 'heart' : 'heart-outline'
      if(message.userId === userId){
          return React.createElement('div',{
              class: `content d-flex justify-content-end align-items-center`
          },
              React.createElement('button', {
                  class:`d-flex btn-delete mess-${key}`,
                  onClick: () => {deleteMessage(key)}
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
              onClick: () => {likeMessage(key,message.userId,message.like,message.message)}
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
  getIdInlast("messages");
}
start();