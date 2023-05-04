import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
var $ = document.querySelector.bind(document);
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function getUser(callback) {
    var db = getDatabase();
    onValue(ref(db), (snapshot) => {
        const data = snapshot.val();
        console.log(data)
        callback(data.User);
    }, (error) => {
        console.error(error);
    });
}

function renderUser(data) {
    const selsection = $('form select');
    var lisUser = Object.keys(data);
    const listOption = lisUser.map(key => {
        const item = data[key];
        return React.createElement('option',{
            value: item.id},
            item.name
            );
    })
    var root = ReactDOM.createRoot(selsection);
    root.render(listOption)
    
}

getUser(renderUser);