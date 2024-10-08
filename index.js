const cible = document.getElementById('cible');
const clearCrew = document.getElementById('reset');
const listItems = document.querySelectorAll('#myList li');
let players = [];
let buttonsActions = {save: 0, clearCible: 0}

window.addEventListener('load', function () {
    console.log('Tous les éléments de la page sont complètement chargés.');
    save.disabled = true;
    clearCrew.disabled = true;
    deleteCibleContains.disabled = true
    displayNumberPlayersAvailable()
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

deleteCibleContains.addEventListener('click', function reset() {
    buttonsActions.clearCible = 1
    disableButtonSave()
    cible.innerHTML = "";
    players = []
    displayItemsHidden()
    displayNumberPlayersAvailable()
});

clearCrew.addEventListener('click', function clear(){
    document.location.reload();
})

const save = document.querySelector('#save');
const equipe = document.getElementById('equipe')

save.addEventListener('click', function save() {
    buttonsActions.save = 1
    disableButtonSave()
    clearCrew.disabled = false;
    cible.innerHTML = "";
    const savedPlayers = deleteDoublon (players);
    players = [];
    return savedPlayers.map(savedPlayer => {
        equipe.innerHTML += `${savedPlayer.innerHTML},`
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
    if(Array.isArray(items)){
        for (let i=0; i< items.length; i++){
            if(items[i][1].hasAttribute("hidden")){
                document.getElementById(items[i][1].id).hidden = false
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

    let span = h2.querySelector('span');

    if (!span) {
        span = document.createElement('span');
        h2.appendChild(span);
    }

    span.textContent = ` ${updateNumberPlayersAvailable()}`;
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