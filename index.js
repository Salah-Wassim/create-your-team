const cible = document.getElementById('cible');
const clearCrew = document.getElementById('reset');
const listItems = document.querySelectorAll('#myList li');
let players = [];
let equipeArray = [];
let buttonsActions = {save: 0, clearCible: 0}
let countOfPlayersSelected = 0
let counterBtnSaveIsClicked = 0;

window.addEventListener('load', function () {
    localStorage.clear();
    console.log('Tous les éléments de la page sont complètement chargés.');
    save.disabled = true;
    clearCrew.disabled = true;
    deleteCibleContains.disabled = true
    displayNumberPlayersAvailable()
    localStorage.setItem('saveIsClicked', counterBtnSaveIsClicked)
});

function dragstart_handler(ev) {
    let isSelect = ev.target.id;
    ev.dataTransfer.setData("text", isSelect);
    ev.dataTransfer.effectAllowed = "move"
    hidePlayerSelected(isSelect)
}

function hidePlayerSelected(selectedPlayer){
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
        return cible.innerHTML += `${playerFilter[0].innerHTML}<br>`;
    }
    else{
        return cible.innerHTML += `${players[0].innerHTML}<br>`;
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