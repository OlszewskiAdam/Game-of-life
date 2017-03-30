var Game = {
    Settings: {
        Descriptions: {
            startButton: "Graj",
            pauseButton: "Pauza",
        },
        Colors: {
            borderColor: "#888",
            cellBackground: "#fff",
            gameBackground: "#ccc",
            liveCell: "#00f",
        },
        World: {
            cycleTime: 200, //ms
        },
    },
    DOMElements: {
        body: document.querySelector("body"),
        Game: {
            gameBox: 0,
            world: 0,
        },
        Menu: {
            menuBox: 0,
            Buttons: {
                startPause: 0,
            },
        }
    },
    Sizes: {
        worldWidth: 0,
        drawWidth: 0,
        drawHeight: 0,
        worldHeight: 0,
        cellWidth: 0,
    },
    CellArrays: {
        cellTab: [],
        newCellTab: [],
    },
    Counters: {
        liveCounter: 0,
    },
    Intervals: {
        gameInterval: 0,
        activeInterval: false,
    },
    Draw: {
        newWorld: function(height, width, cellWidth){
            Game.Sizes.drawWidth = width;
            Game.Sizes.drawHeight = height;
            Game.Sizes.cellWidth = cellWidth;
            for (var i = 0; i < height; i++){
                for (var j = 0; j < width; j++) {
                    var newCell = document.createElement('div');
                    var index = j + i * width;
                    newCell.style.backgroundColor = Game.Settings.Colors.cellBackground;
                    newCell.style.boxSizing = "border-box";
                    newCell.style.width = cellWidth + "px";
                    newCell.style.height = cellWidth + "px";
                    newCell.style.float = "left";
                    newCell.style.border = "0.5px solid " + Game.Settings.Colors.borderColor;
                    newCell.setAttribute("x", j);
                    newCell.setAttribute("y", i);
                    newCell.setAttribute("index", index);
                    newCell.setAttribute("live", 0);
                    Game.CellArrays.cellTab.push([j, i, index, 0]);
                    newCell.onclick = function(event){
                        var index = event.target.attributes.index.value;
                        if(event.target.className === "live"){
                            event.target.className = "";
                            event.target.style.backgroundColor = Game.Settings.Colors.cellBackground;
                            event.target.setAttribute("live", 0);
                            Game.CellArrays.cellTab[index][3] = 0;
                        }
                        else if(event.target.className === ""){
                            event.target.className = "live";
                            event.target.style.backgroundColor = Game.Settings.Colors.liveCell;
                            event.target.setAttribute("live", 1);
                            Game.CellArrays.cellTab[index][3] = 1;
                        }
                    };
                    Game.DOMElements.Game.world.appendChild(newCell);
                };
            };
            Game.Sizes.worldWidth = (width * cellWidth) + 1;
            Game.Sizes.worldHeight = (height * cellWidth) + 1;
            Game.DOMElements.Game.world.style.width = Game.Sizes.worldWidth + "px";
            Game.DOMElements.Game.world.style.height = Game.Sizes.worldHeight + "px";
        },
        gameMenu: function(){

        },
    },
    Check: {
        topLeft: function(xPos, yPos){
            if(!(xPos - 1 === -1 || yPos - 1 === -1)){
                var newX = xPos - 1;
                var newY = yPos - 1;
                var index = newX + newY * Game.Sizes.drawWidth;
                var cellHtml = Game.DOMElements.Game.world.children[index];
                var checkLive = cellHtml.attributes.live.value;
                Game.Counters.liveCounter += parseInt(checkLive);
            }
        },
        topCenter: function(xPos, yPos){
            if(!(yPos - 1 === -1)){
                var newX = xPos;
                var newY = yPos - 1;
                var index = newX + newY * Game.Sizes.drawWidth;
                var cellHtml = Game.DOMElements.Game.world.children[index];
                var checkLive = cellHtml.attributes.live.value;
                Game.Counters.liveCounter += parseInt(checkLive);
            }
        },
        topRight: function(xPos, yPos){
            if(!(xPos + 1 === Game.Sizes.drawWidth || yPos - 1 === -1)){
                var newX = xPos + 1;
                var newY = yPos - 1;
                var index = newX + newY * Game.Sizes.drawWidth;
                var cellHtml = Game.DOMElements.Game.world.children[index];
                var checkLive = cellHtml.attributes.live.value;
                Game.Counters.liveCounter += parseInt(checkLive);
            }
        },
        midLeft: function(xPos, yPos){
            if(!(xPos - 1 === -1)){
                var newX = xPos - 1;
                var newY = yPos;
                var index = newX + newY * Game.Sizes.drawWidth;
                var cellHtml = Game.DOMElements.Game.world.children[index];
                var checkLive = cellHtml.attributes.live.value;
                Game.Counters.liveCounter += parseInt(checkLive);
            }
        },
        midRight: function(xPos, yPos){
            if(!(xPos + 1 === Game.Sizes.drawWidth)){
                var newX = xPos + 1;
                var newY = yPos;
                var index = newX + newY * Game.Sizes.drawWidth;
                var cellHtml = Game.DOMElements.Game.world.children[index];
                var checkLive = cellHtml.attributes.live.value;
                Game.Counters.liveCounter += parseInt(checkLive);
            }
        },
        botLeft: function(xPos, yPos){
            if(!(xPos - 1 === -1 || yPos + 1 === Game.Sizes.drawHeight)){
                var newX = xPos - 1;
                var newY = yPos + 1;
                var index = newX + newY * Game.Sizes.drawWidth;
                var cellHtml = Game.DOMElements.Game.world.children[index];
                var checkLive = cellHtml.attributes.live.value;
                Game.Counters.liveCounter += parseInt(checkLive);
            }
        },
        botCenter: function(xPos, yPos){
            if(!(yPos + 1 === Game.Sizes.drawHeight)){
                var newX = xPos;
                var newY = yPos + 1;
                var index = newX + newY * Game.Sizes.drawWidth;
                var cellHtml = Game.DOMElements.Game.world.children[index];
                var checkLive = cellHtml.attributes.live.value;
                Game.Counters.liveCounter += parseInt(checkLive);
            }
        },
        botRight: function(xPos, yPos){
            if(!(xPos + 1 === Game.Sizes.drawWidth || yPos + 1 === Game.Sizes.drawHeight)){
                var newX = xPos + 1;
                var newY = yPos + 1;
                var index = newX + newY * Game.Sizes.drawWidth;
                var cellHtml = Game.DOMElements.Game.world.children[index];
                var checkLive = cellHtml.attributes.live.value;
                Game.Counters.liveCounter += parseInt(checkLive);
            }
        },
        checkCell: function(tabElement){
            Game.Counters.liveCounter = 0;
            var xPos = parseInt(tabElement[0]);
            var yPos = parseInt(tabElement[1]);
            Game.Check.topLeft(xPos, yPos);
            Game.Check.topCenter(xPos, yPos);
            Game.Check.topRight(xPos, yPos);
            Game.Check.midLeft(xPos, yPos);
            Game.Check.midRight(xPos, yPos);
            Game.Check.botLeft(xPos, yPos);
            Game.Check.botCenter(xPos, yPos);
            Game.Check.botRight(xPos, yPos);
            return Game.Counters.liveCounter;
        },
    },
    GameState: {
        setCellState: function(tabElement){
            var counter = Game.Check.checkCell(tabElement);
            var newState = tabElement;
            var index = tabElement[2];
            if(tabElement[3] === 1){ //jesli zyje
                if(counter < 2){
                    newState[3] = 0;
                }
                else if(counter === 2 || counter === 3){
                    newState[3] = 1;
                }
                else if(counter > 3){
                    newState[3] = 0;
                }
            }
            else if(tabElement[3] === 0){ //lub jest martwa
                if(counter === 3){
                    newState[3] = 1;
                }
            }
            Game.CellArrays.newCellTab[index] = newState;
        },
        setNewState: function(tab){
            Game.CellArrays.newCellTab = [];
            for (var i = 0; i < tab.length; i++) {
                Game.GameState.setCellState(tab[i]);
            };
        },
        drawNewState: function(tab){
            for (var i = 0; i < tab.length; i++) {
                var index = tab[i][2];
                var cell = Game.DOMElements.Game.world.children[index];
                if(tab[i][3] === 0){
                    cell.className = "";
                    cell.setAttribute("live", 0);
                    cell.style.backgroundColor = Game.Settings.Colors.cellBackground;
                }
                else if(tab[i][3] === 1){
                    cell.className = "live";
                    cell.setAttribute("live", 1);
                    cell.style.backgroundColor = Game.Settings.Colors.liveCell;
                }
            }
            Game.CellArrays.cellTab = Game.CellArrays.newCellTab;
            Game.CellArrays.newCellTab = [];
        },
    },
    Interface: {
        setStartPause: function(){
            if(Game.Start.firstRun === true){
                Game.DOMElements.Menu.Buttons.startPause.innerHTML = Game.Settings.Descriptions.startButton;
                Game.Start.firstRun = false;
            }
            Game.DOMElements.Menu.Buttons.startPause.onclick = function(){
                if(Game.Intervals.activeInterval === false){
                    Game.Intervals.gameInterval = setInterval(function(){
                        Game.GameState.setNewState(Game.CellArrays.cellTab);
                        Game.GameState.drawNewState(Game.CellArrays.newCellTab);
                    }, Game.Settings.World.cycleTime);
                    Game.Intervals.activeInterval = true;
                    Game.DOMElements.Menu.Buttons.startPause.innerHTML = Game.Settings.Descriptions.pauseButton;
                }
                else if(Game.Intervals.activeInterval === true){
                    clearInterval(Game.Intervals.gameInterval);
                    Game.Intervals.activeInterval = false;
                    Game.DOMElements.Menu.Buttons.startPause.innerHTML = Game.Settings.Descriptions.startButton;
                }
            };
        },
    },
    Start:{
        firstRun: true,
        buildGameBox: function(){
            var gameBox = document.createElement("div");
            var world = document.createElement("div");
            var newHeight = window.innerHeight;
            var newWidth = window.innerWidth;
            var body = Game.DOMElements.body;
            body.style.margin = 0;
            body.style.padding = 0;
            gameBox.style.backgroundColor = Game.Settings.Colors.gameBackground;
            gameBox.style.height = newHeight + "px";
            gameBox.style.width = newWidth + "px";
            gameBox.style.positon = "relative";
            gameBox.id = "gameBox";
            world.id = "world";
            world.style.top = 0;
            world.style.right = 0;
            world.style.bottom = 0;
            world.style.left = 0;
            world.style.position = "absolute";
            world.style.margin = "auto";
            gameBox.appendChild(world);
            Game.DOMElements.body.appendChild(gameBox);
            Game.DOMElements.Game.gameBox = document.getElementById("gameBox");
            Game.DOMElements.Game.world = document.getElementById("world");
        },
        buildMenu: function(){
            var menuBox = document.createElement("div");
            var startPause = document.createElement("div");

            startPause.id = "startPause";
            menuBox.id = "menuBox";

            menuBox.appendChild(startPause);
            Game.DOMElements.Game.gameBox.appendChild(menuBox);

            Game.DOMElements.Menu.menuBox = document.getElementById("menuBox");
            Game.DOMElements.Menu.Buttons.startPause = document.getElementById("startPause");
        },
    },
}
Game.Start.buildGameBox();
Game.Start.buildMenu();
Game.Interface.setStartPause();
Game.Draw.newWorld(40, 80, 15);
//Game.Interface.setButtons();
