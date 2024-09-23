const cible = document.getElementById('cible');
const clearCrew = document.getElementById('reset');
const listItems = document.querySelectorAll('#myList li');
const inputCreateNewPlayer = document.getElementById("input-create-new-player");

let players = [];
let equipeArray = [];
let buttonsActions = {save: 0, clearCible: 0, addPlayer: 0}
let countOfPlayersSelected = 0
let counterBtnSaveIsClicked = 0;

window.addEventListener('load', function () {
    localStorage.clear();
    console.log('Tous les éléments de la page sont complètement chargés.');
    save.disabled = true;
    clearCrew.disabled = true;
    deleteCibleContains.disabled = true
    disabledButtonAddNewPlayer (inputCreateNewPlayer.value)
    displayNumberPlayersAvailable()
    localStorage.setItem('saveIsClicked', counterBtnSaveIsClicked)
    localStorage.setItem('newPlayerAdded', buttonsActions.addPlayer)
});

function dragstart_handler(ev) {
    let isSelect = ev.target.id;
    ev.dataTransfer.setData("text", isSelect);
    ev.dataTransfer.effectAllowed = "move"
    hidePlayerSelected(isSelect)
}

function hidePlayerSelected(selectedPlayer){
    const listItems = document.querySelectorAll('#myList li');
    buttonsActions.clearCible = 0
    buttonsActions.save = 0
    const array = Object.entries(listItems)
    if(selectedPlayer){
        for (let i=0; i< array.length; i++){
            if(selectedPlayer === array[i][1].id && buttonsActions.clearCible === 0){
                document.getElementById(array[i][1].id).hidden = true
            }
        }
    }
}

function dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

function deleteDoublon (array) {
    array = array.reduce((acc, valCourante) => {
        if (acc.indexOf(valCourante) === -1) {
            acc.push(valCourante)
        }
        return acc;
    }, []);

    return array;
}

function createElement(element, value, id){
    let node = document.createElement(element); 
    const textNode = document.createTextNode(value); 
    node.appendChild(textNode);
    document.getElementById(id).appendChild(node);
    return node;
}

function drop_handler(ev) {
    ev.preventDefault();

    deleteCibleContains.disabled = false
    save.disabled = false;
    updateNumberPlayersAvailable()
    displayNumberPlayersAvailable()

    const data = ev.dataTransfer.getData("text");

    let dataValue = document.getElementById(data);

    players.push(dataValue);

    if(localStorage.getItem('saveIsClicked') >= 1){

        let dataValueIdArray = JSON.parse(localStorage.getItem('dataValueIdArray')) || [];

        dataValueIdArray.push(dataValue.id);

        localStorage.setItem('dataValueIdArray', JSON.stringify(dataValueIdArray));
    }

    const even = (player) => player !== dataValue;
    
    if(players.some(even)){
        const playerFilter = players.filter(player => player === dataValue)
        return createElement("p", playerFilter[0].innerHTML, "cible")
    }
    else{
        return createElement("p", players[0].innerHTML, "cible")
    }
}

const deleteCibleContains = document.getElementById('btn');

deleteCibleContains.addEventListener('click', function () {
    let dataValueIdStorage = JSON.parse(localStorage.getItem('dataValueIdArray')) || []
    if(localStorage.getItem('saveIsClicked') >= 1){
        dataValueIdStorage
    }
    buttonsActions.clearCible = 1;
    cible.innerHTML = "";
    players = [];
    countOfPlayersSelected = 0;
    disableButtonSave();
    displayItemsHidden();
    displayNumberPlayersAvailable();
});

clearCrew.addEventListener('click', function clear(){
    localStorage.clear();
    document.location.reload();
})

const save = document.querySelector('#save');
const equipe = document.getElementById('equipe')

save.addEventListener('click', function save() {
    buttonsActions.save = 1
    localStorage.setItem('saveIsClicked', counterBtnSaveIsClicked += 1)
    disableButtonSave()
    countNumberPlayersSelected()
    displayNumberPlayersAvailable()
    clearCrew.disabled = false;
    cible.innerHTML = "";
    let savedPlayers = deleteDoublon(players) || [];
    players = [];
    
    savedPlayers.forEach(savedPlayer => {
        equipeArray.push(savedPlayer.id)
        equipe.innerHTML += `${savedPlayer.innerHTML}, `;
    });
})

function disableButtonSave(){
    if(buttonsActions.save === 1){
        save.disabled = true
    }
    if(buttonsActions.clearCible === 1){
        save.disabled = false
    }
    if(buttonsActions.clearCible === 0 && buttonsActions.save === 1){
        deleteCibleContains.disabled = true
    }
    if(buttonsActions.clearCible === 1 && buttonsActions.save === 0){
        deleteCibleContains.disabled = true
        save.disabled = true;
    }
}

function displayItemsHidden(){    
    const listItems = document.querySelectorAll('#myList li');
    const items = Object.entries(listItems);
    let itemsToShow = [];
    if(Array.isArray(items) && items.length >= 1){
        for (let i=0; i< items.length; i++){
            itemsToShow.push(items[i][1].id);
        }
        const filterItemsToShowId = itemsToShow.filter(item => !equipeArray.includes(item)) 
        if(Array.isArray(filterItemsToShowId) && filterItemsToShowId.length >= 1){
            for(let i=0; i<filterItemsToShowId.length; i++){
                document.getElementById(filterItemsToShowId[i]).hidden = false
            }
        }
    }
}

function countNumberPlayersAvailable(){
    const listItems = document.querySelectorAll('#myList li');
    const sum = Array.from(listItems).reduce((acc, curr) => {
        return acc + 1;
    }, 0);

    return sum;
}

function displayNumberPlayersAvailable(){
    let h2 = document.getElementById("title-player-available");
    let h2Selected = document.getElementById("title-player-selected");

    let span = h2.querySelector('span');
    let spanSelected = h2Selected.querySelector('span')

    if (!span) {
        span = document.createElement('span');
        h2.appendChild(span);
        
        spanSelected = document.createElement('span');
        h2Selected.appendChild(spanSelected)
    }

    span.textContent = ` ${updateNumberPlayersAvailable()}`;
    spanSelected.textContent = ` ${countNumberPlayersSelected()}`;
}

function updateNumberPlayersAvailable(){
    const listItems = document.querySelectorAll('#myList li');
    let numbersOfPlayersAvailable = countNumberPlayersAvailable();
    const items = Array.from(listItems);
    let counter = 0;
    for(let i=0; i<items.length; i++){
        if(items[i].hasAttribute('hidden')){
            counter += 1;
        }
    }
    numbersOfPlayersAvailable -= counter;
    return numbersOfPlayersAvailable;
}

function countNumberPlayersSelected() {
    const listItems = document.querySelectorAll('#myList li');
    const items = Array.from(listItems).length;

    if (buttonsActions.save === 0 && buttonsActions.clearCible === 0) {
        if (localStorage.getItem('saveIsClicked') < 1) {
            countOfPlayersSelected = items - updateNumberPlayersAvailable();
        } else {
            countOfPlayersSelected += 1;
        }
    } else if (buttonsActions.save === 1 || buttonsActions.clearCible === 1) {
        countOfPlayersSelected = 0;
    }

    return countOfPlayersSelected;
}

const addNewPlayer = document.getElementById("btn-add-player");

addNewPlayer.addEventListener("click", function addPlayer() {
    if(inputCreateNewPlayer.value){
        localStorage.setItem('newPlayerAdded', buttonsActions.addPlayer = 1)
        const li = document.createElement("li");
        li.id = inputCreateNewPlayer.value;
        li.className = 'source';
        li.draggable = true;
        li.ondragstart = function(event) {
            dragstart_handler(event);
        };
        const textNode = document.createTextNode(inputCreateNewPlayer.value);
        li.appendChild(textNode);
        document.getElementById("myList").appendChild(li)
        inputCreateNewPlayer.value = ""
        disabledButtonAddNewPlayer(inputCreateNewPlayer.value)
        displayNumberPlayersAvailable()
    }  
})

function disabledButtonAddNewPlayer (value){
    if(value){
        addNewPlayer.disabled = false
    }
    else{
        addNewPlayer.disabled = true
        localStorage.setItem('newPlayerAdded', buttonsActions.addPlayer = 0)
    }
}