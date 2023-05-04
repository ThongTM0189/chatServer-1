var $ = document.querySelector.bind(document);
var APIUser ="http://localhost:3000/User";

var selsection = $("#selecbox select");

function getUser(callback) {
    fetch(APIUser)
    .then(function(response) {
        return response.json();
    })
    .then(callback);
}

function renderUser(data) {
    var lisOption = data.map(function(item){
        return React.createElement('option',{
            value: item.id},
            item.name
            )
    })
    console.log(lisOption)
    var root = ReactDOM.createRoot(selsection);
    root.render(lisOption)
}

getUser(renderUser)