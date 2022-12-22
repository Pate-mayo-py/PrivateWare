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
    lobby.innerHTML = "";
    for (let i of _data.slice(page*20, page*20+20)){
        let element = lobby.appendChild(document.createElement("div"));
        element.setAttribute("class", "element");
        element.innerHTML = "<h2 class='title'>" + i.Name + "</h2><div class='content'><p class='description'>" + i.Description + "</p><img src=" + i.ImageURL + " alt='' class='image'></div><a href=" + i.URL + " class='download'><div class='button'><span class='material-symbols-outlined'>download</span><h3>Download</h3></div></a>";
    };
    pageCount = document.getElementById("pageCount");
    pageCount.innerHTML = String(page) + " / " + String(range);
    let reco = document.getElementsByClassName("reco");
    if (page == 0){
        for (let i of reco){
            i.style.display = "block";
        }
    }else{
        for (let i of reco){
            i.style.display = "none";
        }
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
