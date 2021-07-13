/*
COSAS A HACER:
- las armas se usan de forma aleatoria sin repetirse hasta que no haya más 

*/

let day = 0;

let players = []; //lista general de todos los jugadores vivos o muertos
let alivePlayers = [];
let deadPlayers = [];

const defaultPlayers = ['Michael', 'Pam', 'Dwight', 'Jim'];

let deathMessages = [
    "",
    ""
];

let scoreboardDiv;
let dayCountP;
let winBoxP;
let winBoxAlert;

// CONFIG
let showDeathMessages = false;

class Player {
    constructor(name, status='alive', kills=[], killedBy='', killedInDay) {
        this.name = name;
        this.status = status;
        this.kills = kills;
        this.killedBy = killedBy;
        this.killedInDay = killedInDay;
    }

    static getPlayers() {
        let players = [];
        let inputNames = document.getElementById('input-players').value.split(', ');
        for (let playerName of inputNames) {
            players.push(new Player(playerName))
        }
        return players;
    }

    get killAmount() {
        return this.kills.length;
    }
}

function battle() {
    day++;
    //actualizar jugadores vivos y muertos a sus arrays
    alivePlayers = players.filter(player => player.status == 'alive');
    deadPlayers = players.filter(player => player.status == 'dead');

    //seleccionar victima, eliminarla de la lista de vivos
    let victim = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
    alivePlayers = alivePlayers.filter(player => player.name !== victim.name);
    //seleccionar asesino
    let killer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];

    let remainingDays = function() {
        return alivePlayers.length - 1;   
    }
    //actualizar propiedades del array de players
    for (let player of players) {
        if (player.name == victim.name) {
            player.status = 'dead';
            player.killedBy = killer.name;
            player.killedInDay = remainingDays() + 2;
        }
        if (player.name == killer.name) {
            player.kills.push(victim.name);
        }
    }

    deadPlayers = players.filter(player => player.status == 'dead');

    let randomDeathMessage = deathMessages[Math.floor(Math.random() * deathMessages.length)];

    //create log message
    let logMessage = generateLogMessage(victim.name, killer.name, randomDeathMessage)

    //arreglar esto
    let logDiv = document.getElementById("log");
    
    let singleDiv = document.createElement('div')

    let dayh3 = document.createElement("h3");
    dayh3.appendChild(document.createTextNode(`Día ${day}`));

    // mensaje
    let messagep = document.createElement('h4')
    messagep.appendChild(document.createTextNode(logMessage))

    let alivePlayersul = document.createElement('ul')
    alivePlayersul.setAttribute('id', 'alive-list')

    for (let player of alivePlayers) {
        li = document.createElement('li')
        if (player.name == killer.name) {
            li.appendChild(document.createTextNode(`${player.name} ⚔️`))
        } else {
            li.appendChild(document.createTextNode(player.name))
        }
        alivePlayersul.appendChild(li)
    }
    
    singleDiv.appendChild(dayh3);
    singleDiv.appendChild(messagep);
    singleDiv.appendChild(alivePlayersul);
    logDiv.insertBefore(singleDiv, logDiv.firstChild);

    //actualizar scoreboard
    try {
        scoreboardDiv.remove();
        dayCountP.remove();
        winBoxP.remove();
    } catch (error) {
        
    }

    scoreboardDiv = document.createElement('div');
    scoreboardDiv.setAttribute('class', 'list-group');
    scoreboardDiv.setAttribute('id', 'player-list');

    let messageLog = document.createElement('h4');
    messageLog.appendChild(document.createTextNode(logMessage));
    scoreboardDiv.appendChild(messageLog);

    for (let player of players) {
        let playerLi = document.createElement('li')
        playerLi.setAttribute("id", "player-li")
        if (player.status == 'alive') {
            playerLi.setAttribute('class', 'list-group-item')
            if (player.killAmount > 0) {
                playerLi.appendChild(document.createTextNode(`${player.name} (${player.killAmount} kills)`))
            } else {
                playerLi.appendChild(document.createTextNode(`${player.name}`))
            }
        } else { //muerto
            playerLi.setAttribute('class', 'list-group-item list-group-item-danger list-group-item-action')
            
            if (player.killAmount > 0) {
                playerLi.appendChild(document.createTextNode(`${player.name} (⚔️${player.killedBy}) (${player.killAmount} kills) (Top ${player.killedInDay})`))
            } else {
                playerLi.appendChild(document.createTextNode(`${player.name} (⚔️${player.killedBy}) (Top ${player.killedInDay})`))
            }
        }
        if (player.name == killer.name) {
            playerLi.setAttribute('class', 'list-group-item list-group-item-success list-group-item-action')
            
        }
        
        scoreboardDiv.appendChild(playerLi);

    }

    dayCountP = document.createElement('h6');
    dayCountP.appendChild(document.createTextNode(`Días restantes: ${remainingDays()}`))

    let mainContainer = document.getElementById('container')

    mainContainer.appendChild(scoreboardDiv)
    mainContainer.insertBefore(scoreboardDiv, mainContainer.children[4])
    mainContainer.insertBefore(dayCountP, mainContainer.children[4])

    //mensaje cuando alguien gana
    if (remainingDays() == 0) {
        winBoxP = document.createElement('h1')
        winBoxP.appendChild(document.createTextNode(`${killer.name} ha ganado`))
        mainContainer.insertBefore(winBoxP, mainContainer.children[4])
    }
   
}

function generateLogMessage(victim, killer, deathMessage) {
    let message = `${killer} ha matado a ${victim}`;
    if (showDeathMessages) {
        message = `${killer} ha matado a ${victim} ${deathMessage}`
    }

    return message;
}

function start() {
    players = Player.getPlayers();
    document.getElementById('next-day-btn').style.display = 'inline';
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('death-msg-check-div').style.display = 'none';

    let deathMsgCheck = document.getElementById('death-msg-check');
    deathMsgCheck.style.display = 'none';
    if (deathMsgCheck.checked) {
        showDeathMessages = true;
    }
}

function nextDay() {
    battle();
}

