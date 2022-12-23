let range = 28;
let page = 0;

function loadJson(){
    return new Promise(function(resolve, reject){
        let xobj = new XMLHttpRequest();
 
        xobj.onreadystatechange = function(){
            if(xobj.readyState == 4 && xobj.status == 200){
               resolve(xobj.response);
            };
        };
        xobj.open('GET', './games.json', true);
        let response = xobj.send();
    });
};


async function askForJson(){
    let data = await loadJson();
    return JSON.parse(data);
};

function createElements(_data){
    let lobby = document.getElementById("lobby");
    if (lobby != null){
        lobby.innerHTML = "";
        for (let i of _data.slice(page*20, page*20+20)){
            let element = lobby.appendChild(document.createElement("div"));
            element.setAttribute("class", "element");
            element.setAttribute("data-aos", "fade-up")
            element.innerHTML = "<h2 class='title'>" + i.Name + "</h2><div class='content'><p class='description'>" + i.Description + "</p><img src=" + i.ImageURL + " alt='' class='image'></div><a href=" + i.URL + " class='download'><div class='button'><span class='material-symbols-outlined'>download</span><h3>Download</h3></div></a>";
        };
        pageCount = document.getElementById("pageCount");
        pageCount.innerHTML = String(page) + " / " + String(range);
    };
    let reco = document.getElementsByClassName("recommendations")[0];
    if (page == 0){
        reco.style.display = "flex";
    }else{
        reco.style.display = "none";
    }
};

function nextPage(){
    if (page == range){
        page = 0;
    }
    else{
        page++;
    }
    askForJson().then(data => createElements(data));
};

function lastPage(){
    if (page == range-range){
        page = 28;
    }
    else{
        page -= 1;
    }
    askForJson().then(data => createElements(data));
};

document.addEventListener('DOMContentLoaded', function() {
    askForJson().then(data => createElements(data));
});


let gamesName = [];
let games;

function parseJSON(_data){
    for (i of _data){
        gamesName.push(i.Name);
    }
    games = _data;
};

askForJson().then(data => parseJSON(data));

let input = document.getElementById("search");
let matchs = [];
let res = [];
input.addEventListener("keyup", function(){
    const cleanValue = new RegExp(input.value, 'i')
    page = 0;
    if (input.value.length == 0){
        askForJson().then(data => createElements(data));
    }else{
        for (let i of gamesName){
            if (cleanValue.test(i)){
                matchs.push(i);
            };
        };
        for (let match of matchs){
            for (let game of games){
                if (match == game.Name){
                    res.push(game);
                };
            };
        };
        createElements(res);
    };
    matchs = [];
    res = [];
});

let suggestionInput = document.getElementById("suggestion-input");
let suggestionButton = document.getElementById("suggestion-button");
let thanks = document.getElementById("thanks");
let rootLink = document.getElementById("root");

function sendSuggestion(){
    let suggestion = suggestionInput.value;
    suggestionInput.style.display = "none";
    suggestionButton.style.display = "none";
    thanks.textContent = "Your suggestion \""+ suggestion +"\" has been succesfully sended. Thank you very much for your help.";
    rootLink.style.display = "block";
    sendWebhook(suggestion);
};

function sendWebhook(suggestion){
    let data = {
        content: "<@&1018109357810012188> <@&1018109357810012187>",
        embeds: [
            {
                "title": "Nouvelle suggestion venant du site :",
                "description": suggestion,
                "url": "https://pate-mayo-py.github.io/Privateware/",
                "color": 23192
            }
        ]
    };
    xhr = new XMLHttpRequest();
    xhr.open("POST", "https://discord.com/api/webhooks/1055851580500488322/L0v0T0rxK1uBfPmBQzHlbKE6oN9jnNG9gEsayQeXTcs0eZb9DTfi6ahZgEWSffaFYc9O");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
};
