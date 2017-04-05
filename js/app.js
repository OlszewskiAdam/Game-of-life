var Game = {
    Settings: {
        Default: {
            worldHeight: 25,
            worldWidth: 45,
            cellSize: 20,
        },
        Descriptions: {
            startButton: "Graj",
            pauseButton: "Pauza",
            worldHeight: "Wysokość",
            worldWidth: "Szerokość",
            cellSize: "Rozmiar komórki / px",
            drawButton: "Narysuj świat",
            cleanButton: "Resetuj świat",
            cycleTime: "Czas cyklu / ms",
            drawAlert: "Rozmiar planszy przekracza 35000 komórek. To może spowodować problemy z wydajnością. Czy na pewno chcesz narysować tak dużą plansze?",
            dataAlert: "Pola wysokość, szerokość, oraz rozmiar komórki, przyjmują tylko liczby całkowite",
        },
        Display: {
            Body: {
                margin: 0,
                padding: 0,
                font: "Arial",
            },
            Borders: {
                cellBorder: "0.5px solid #888",
                cellHover: "2.5px solid black",
            },
            Buttons: {
                padding: 0,
                borderRadius: 0,
                width: 150,
                margin: "10px auto",
            },
            Cells: {

            },
            Colors: {
                //cellBorderColor: "#888",
                cellBackground: "#fff",
                //cellHover: "rgba(0,0,0,0.5)",
                gameBackground: "#ccc",
                liveCell: "#00f",
                menuBackground: "#777",
                menuColor: "#fff",
                buttonsBackground: "#444",
                buttonsBorder: "#222",
                buttonsColor: "#fff",
            },
            GameBox: {
                position: "relative",
            },
            Inputs: {

            },
            Labels: {

            },
            Menu: {
                display: "block",
                textAlign: "center",
                position: "absolute",
                margin: "auto 0 auto 30px",
                top: 0,
                right: "auto",
                bottom: 0,
                left: 0,
                height: 250,
                width: 200,
            },
            World: {
                position: "absolute",
                margin: "auto",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        },
        World: {
            maxCell: 35000, //Test na 36400 komórkach. Chwile zajeło narysowanie a potem teoretycznie działał ale przybliżanie oddalanie obrazu trwało dobrych kilka sekund. Myślę że można ustawic nawet mniej.
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
            NewWorldMenu: {
                newWorld: 0,
                inHeight: 0,
                labelHeight: 0,
                inWidth: 0,
                labelWidth: 0,
                inCell: 0,
                labelCell: 0,
                drawButton: 0,
                cleanButton: 0,
            },
        },
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
        defaultTab: [],
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
            Game.DOMElements.Game.world.innerHTML = "";
            Game.CellArrays.cellTab = [];
            Game.CellArrays.newCellTab = [];
            Game.Sizes.drawWidth = width;
            Game.Sizes.drawHeight = height;
            Game.Sizes.cellWidth = cellWidth;
            for (var i = 0; i < height; i++){
                for (var j = 0; j < width; j++) {
                    var newCell = document.createElement('div');
                    var index = j + i * width;
                    newCell.style.backgroundColor = Game.Settings.Display.Colors.cellBackground;
                    newCell.style.boxSizing = "border-box";
                    newCell.style.width = cellWidth + "px";
                    newCell.style.height = cellWidth + "px";
                    newCell.style.float = "left";
                    newCell.style.border = Game.Settings.Display.Borders.cellBorder;
                    newCell.setAttribute("x", j);
                    newCell.setAttribute("y", i);
                    newCell.setAttribute("index", index);
                    newCell.setAttribute("live", 0);
                    Game.CellArrays.cellTab.push([j, i, index, 0]);
                    Game.CellArrays.defaultTab.push([j, i, index, 0]);
                    newCell.onclick = function(event){
                        var index = event.target.attributes.index.value;
                        if(event.target.attributes.live.value == 1){
                            event.target.style.backgroundColor = Game.Settings.Display.Colors.cellBackground;
                            event.target.setAttribute("live", 0);
                            Game.CellArrays.cellTab[index][3] = 0;
                        }
                        else if(event.target.attributes.live.value == 0){
                            event.target.style.backgroundColor = Game.Settings.Display.Colors.liveCell;
                            event.target.setAttribute("live", 1);
                            Game.CellArrays.cellTab[index][3] = 1;
                        }
                    };
                    newCell.onmouseover = function(event){
                        event.target.style.border = Game.Settings.Display.Borders.cellHover;
                        event.target.onmouseout = function(event){
                            event.target.style.border = Game.Settings.Display.Borders.cellBorder;
                        };
                    };
                    Game.DOMElements.Game.world.appendChild(newCell);
                };
            };
            Game.Sizes.worldWidth = (width * cellWidth) + 1;
            Game.Sizes.worldHeight = (height * cellWidth) + 1;
            Game.DOMElements.Game.world.style.width = Game.Sizes.worldWidth + "px";
            Game.DOMElements.Game.world.style.height = Game.Sizes.worldHeight + "px";
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
                    cell.setAttribute("live", 0);
                    cell.style.backgroundColor = Game.Settings.Display.Colors.cellBackground;
                }
                else if(tab[i][3] === 1){
                    cell.setAttribute("live", 1);
                    cell.style.backgroundColor = Game.Settings.Display.Colors.liveCell;
                }
            }
            Game.CellArrays.cellTab = Game.CellArrays.newCellTab;
            Game.CellArrays.newCellTab = [];
        },
    },
    Interface: {
        setStartPause: function(){
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
        setNewWorldMenu: function(){
            Game.DOMElements.Menu.NewWorldMenu.drawButton.onclick = function(){
                clearInterval(Game.Intervals.gameInterval);
                Game.Intervals.activeInterval = false;
                Game.DOMElements.Menu.Buttons.startPause.innerHTML = Game.Settings.Descriptions.startButton;
                var height = Math.floor(Game.DOMElements.Menu.NewWorldMenu.inHeight.value);
                var width = Math.floor(Game.DOMElements.Menu.NewWorldMenu.inWidth.value);
                var cellSize = Math.floor(Game.DOMElements.Menu.NewWorldMenu.inCell.value);
                if (height == 0 || width == 0 || cellSize == 0){
                     alert(Game.Settings.Descriptions.dataAlert);
                     return false;
                }
                else{
                    if(height * width > Game.Settings.World.maxCell){
                        var drawWarning = confirm(Game.Settings.Descriptions.drawAlert);
                        if(drawWarning){
                            Game.Draw.newWorld(height, width, cellSize);
                        }
                    }
                    else{
                        Game.Draw.newWorld(height, width, cellSize);
                    };
                }
            };
            Game.DOMElements.Menu.NewWorldMenu.cleanButton.onclick = function(){
                clearInterval(Game.Intervals.gameInterval);
                Game.Intervals.activeInterval = false;
                Game.DOMElements.Menu.Buttons.startPause.innerHTML = Game.Settings.Descriptions.startButton;
                Game.CellArrays.cellTab = Game.CellArrays.defaultTab;
                for (var i = 0; i < Game.DOMElements.Game.world.children.length; i++) {
                    Game.DOMElements.Game.world.children[i].setAttribute.live = 0;
                    Game.CellArrays.cellTab[i][3] = 0;
                };
                Game.GameState.drawNewState(Game.CellArrays.cellTab);
                Game.CellArrays.cellTab = Game.CellArrays.defaultTab;
            };
        },
    },
    Start:{
        buildGameBox: function(){
            var gameBox = document.createElement("div");
            var world = document.createElement("div");
            var newHeight = window.innerHeight;
            var newWidth = window.innerWidth;
            var body = Game.DOMElements.body;
            body.style.margin = Game.Settings.Display.Body.margin;
            body.style.padding = Game.Settings.Display.Body.padding;
            body.style.fontFamily = Game.Settings.Display.Body.font;
            gameBox.id = "gameBox";
            gameBox.style.backgroundColor = Game.Settings.Display.Colors.gameBackground;
            gameBox.style.height = newHeight + "px";
            gameBox.style.width = newWidth + "px";
            gameBox.style.position = Game.Settings.Display.GameBox.position;
            world.id = "world";
            world.style.top = Game.Settings.Display.World.top;
            world.style.right = Game.Settings.Display.World.right;
            world.style.bottom = Game.Settings.Display.World.bottom;
            world.style.left = Game.Settings.Display.World.left;
            world.style.position = Game.Settings.Display.World.position;
            world.style.margin = Game.Settings.Display.World.margin;
            gameBox.appendChild(world);
            Game.DOMElements.body.appendChild(gameBox);
            Game.DOMElements.Game.gameBox = gameBox;
            Game.DOMElements.Game.world = world;
        },
        buildMenuBox: function(){
            var menuBox = document.createElement("div");
            menuBox.id = "menuBox";
            menuBox.style.display = Game.Settings.Display.Menu.display;
            menuBox.style.textAlign = Game.Settings.Display.Menu.textAlign;
            menuBox.style.position = Game.Settings.Display.Menu.position;
            menuBox.style.margin = Game.Settings.Display.Menu.margin;
            menuBox.style.top = Game.Settings.Display.Menu.top;
            menuBox.style.right = Game.Settings.Display.Menu.right;
            menuBox.style.bottom = Game.Settings.Display.Menu.bottom;
            menuBox.style.left = Game.Settings.Display.Menu.left;
            menuBox.style.width = Game.Settings.Display.Menu.width + "px";
            menuBox.style.height = Game.Settings.Display.Menu.height + "px";
            menuBox.style.backgroundColor = Game.Settings.Display.Colors.menuBackground;
            menuBox.style.color = Game.Settings.Display.Colors.menuColor;
            Game.DOMElements.Game.gameBox.appendChild(menuBox);
            Game.DOMElements.Menu.menuBox = menuBox;
        },
        playMenu: function(){
            var startPause = document.createElement("div");
            startPause.id = "startPause";
            startPause.style.padding = Game.Settings.Display.Buttons.padding;
            startPause.style.backgroundColor = Game.Settings.Display.Colors.buttonsBackground;
            startPause.style.border = "2px solid " + Game.Settings.Display.Colors.buttonsBorder;
            startPause.style.margin = Game.Settings.Display.Buttons.margin;
            startPause.style.width = Game.Settings.Display.Buttons.width + "px";
            startPause.style.color = Game.Settings.Display.Colors.buttonsColor;
            startPause.innerHTML = Game.Settings.Descriptions.startButton;
            Game.DOMElements.Menu.menuBox.appendChild(startPause);
            Game.DOMElements.Menu.Buttons.startPause = startPause;
        },
        NewWorldMenu: function(){
            var newWorld =  document.createElement("div");
            var inHeight = document.createElement("input");
            var labelHeight = document.createElement("label");
            var inWidth = document.createElement("input");
            var labelWidth = document.createElement("label");
            var inCell = document.createElement("input");
            var labelCell = document.createElement("label");
            var drawButton = document.createElement("div");
            var cleanButton = document.createElement("div");

            inHeight.id = "inHeight";
            inHeight.setAttribute("type", "number");
            inHeight.setAttribute("value", Game.Settings.Default.worldHeight);
            Game.DOMElements.Menu.NewWorldMenu.inHeight = inHeight;

            labelHeight.setAttribute("for", "inHeight");
            labelHeight.style.display = "block";
            labelHeight.innerHTML = Game.Settings.Descriptions.worldHeight;
            Game.DOMElements.Menu.NewWorldMenu.labelHeight = labelHeight;

            inWidth.id = "inWidth";
            inWidth.setAttribute("type", "number");
            inWidth.setAttribute("value", Game.Settings.Default.worldWidth);
            Game.DOMElements.Menu.NewWorldMenu.inWidth = inWidth;

            labelWidth.setAttribute("for", "inWidth");
            labelWidth.style.display = "block";
            labelWidth.innerHTML = Game.Settings.Descriptions.worldWidth;
            Game.DOMElements.Menu.NewWorldMenu.labelWidth = labelWidth;

            inCell.id = "cellSize";
            inCell.setAttribute("type", "number");
            inCell.setAttribute("value", Game.Settings.Default.cellSize)
            Game.DOMElements.Menu.NewWorldMenu.inCell = inCell;

            labelCell.setAttribute("for", "cellSize");
            labelCell.style.display = "block";
            labelCell.innerHTML = Game.Settings.Descriptions.cellSize;
            Game.DOMElements.Menu.NewWorldMenu.labelCell = labelCell;

            drawButton.id = "drawButton";
            drawButton.style.padding = Game.Settings.Display.Buttons.padding;
            drawButton.style.backgroundColor = Game.Settings.Display.Colors.buttonsBackground;
            drawButton.style.border = "2px solid " + Game.Settings.Display.Colors.buttonsBorder;
            drawButton.style.margin = Game.Settings.Display.Buttons.margin;
            drawButton.style.width = Game.Settings.Display.Buttons.width + "px";
            drawButton.style.color = Game.Settings.Display.Colors.buttonsColor;
            drawButton.innerHTML = Game.Settings.Descriptions.drawButton;
            Game.DOMElements.Menu.NewWorldMenu.drawButton = drawButton;

            cleanButton.id = "cleanButton";
            cleanButton.style.padding = Game.Settings.Display.Buttons.padding;
            cleanButton.style.backgroundColor = Game.Settings.Display.Colors.buttonsBackground;
            cleanButton.style.border = "2px solid " + Game.Settings.Display.Colors.buttonsBorder;
            cleanButton.style.margin = Game.Settings.Display.Buttons.margin;
            cleanButton.style.width = Game.Settings.Display.Buttons.width + "px";
            cleanButton.style.color = Game.Settings.Display.Colors.buttonsColor;
            cleanButton.innerHTML = Game.Settings.Descriptions.cleanButton;
            Game.DOMElements.Menu.NewWorldMenu.cleanButton = cleanButton;

            newWorld.appendChild(labelHeight);
            newWorld.appendChild(inHeight);
            newWorld.appendChild(labelWidth);
            newWorld.appendChild(inWidth);
            newWorld.appendChild(labelCell);
            newWorld.appendChild(inCell);
            newWorld.appendChild(drawButton);
            newWorld.appendChild(cleanButton);

            Game.DOMElements.Menu.NewWorldMenu.newWorld = newWorld;
            Game.DOMElements.Menu.menuBox.appendChild(newWorld);
        },
    },
}

Game.Start.buildGameBox();
Game.Start.buildMenuBox();
Game.Start.playMenu();
Game.Start.NewWorldMenu();
Game.Interface.setStartPause();
Game.Interface.setNewWorldMenu();
Game.Draw.newWorld(Game.Settings.Default.worldHeight, Game.Settings.Default.worldWidth, Game.Settings.Default.cellSize);
