
    // Instantiate variables and create chessboard table
    const defaultStartLocation = [0,0];
    const coordArray = [];
    const chessTable = document.createElement("table");

    // Create the board cells and apply position values to each cell
    chessTable.setAttribute("class", "center");
    for (let i = 0; i < 8; i++) {
        const tableRow = document.createElement("tr");
        let cellRowCoord = Math.abs(i - 7);
        tableRow.textContent = cellRowCoord;  //TODO: REMOVE WHEN DONE
        for (let z = 0; z < 8; z++) {
            const tableCell = document.createElement("td");
            let cellColumnCoord = z;
            tableCell.textContent = cellColumnCoord;   //TODO: REMOVE WHEN DONE
            
            // Loop through to shade odd valued cells
            if ((i + z) % 2 == 0) {
                tableCell.setAttribute("class", "cell whitecell");
                tableRow.appendChild(tableCell);
                coordArray.push(cellRowCoord)
                coordArray.push(cellColumnCoord);
                tableCell.dataset.coordArray = coordArray;
                coordArray.splice(0, 2);
            } else {
                tableCell.setAttribute("class", "cell blackcell");
                tableRow.appendChild(tableCell);
                coordArray.push(cellRowCoord)
                coordArray.push(cellColumnCoord);
                tableCell.dataset.coordArray = coordArray;
                coordArray.splice(0, 2);
            }
        }

    chessTable.appendChild(tableRow);   
    }

    const cellNodes = chessTable.querySelectorAll("td");

	// Create Knight and place it at position (0,0)
	cellNodes.forEach((cellNode) => {
	    if (defaultStartLocation.toString() === cellNode.dataset.coordArray) {
	        let knightImg = document.createElement("img");
	        knightImg.src = "./assets/knight.svg";
	        cellNode.appendChild(knightImg);
	    }
	});

    //Control and keep track of the moves/clicks
    cellNodes.forEach((cellNode) => {
    	// loop through all cell to find and assign coords of K
    	// for initial start
    	if (cellNode.querySelector('img') !== null) {
    		let KnightLocation = JSON.parse("[" + cellNode.dataset.coordArray + "]");
    		console.log("Current K", KnightLocation);
    	}
    	// loop through all cells to attach click listenr and assign coords
    	cellNode.addEventListener("click", function() {
    		let clickedLocation = JSON.parse("[" +cellNode.dataset.coordArray+ "]");
    		console.log("clickedLocation", clickedLocation);

    		//loop again to locate new current location //img and assing coords //remove old K img //call K module
    		const cellNodes = document.querySelectorAll("td");
            cellNodes.forEach((cellNode) => {
                if (cellNode.querySelector("img") !== null) {
                    let knightLocation = JSON.parse("[" + cellNode.dataset.coordArray + "]");
                    console.log("Current knight location ", knightLocation);
                    const knightImg = document.querySelector("img");
                    knightImg.remove();
                    knightsTravails(knightLocation, clickedLocation); 
                }
            });
            // Create the new Knight img at clicked location
            const knightImg = document.createElement("img");
            knightImg.src = "./assets/knight.svg";
            cellNode.appendChild(knightImg);               
    	});
    });

    //employing a graph Breadth-first-search for the moves
    const squareRegistry = new Map();

    // Get/set current coords to the board
	const chessSquare = (x, y) => {
	    const xPosition = x;
	    const yPosition = y;
	    let predecessor;

	    // Define array for hardcoded possible moves of Knight
	    const KNIGHT_MOVES = [
	        [1, 2], [1, -2],
	        [2, 1], [2, -1],
	        [-1, 2], [-1, -2],
	        [-2, 1], [-2, -1]
	    ]

	    const getPredecessor = () => predecessor;
	    const setPredecessor = (newPredecessor) => {
	        predecessor = predecessor || newPredecessor;
	    }

	    const name = () => `${x}, ${y}`;

	    // Evaluate current possible knight moves against offsets
	    const possibleKnightMoves = () => {
	        return KNIGHT_MOVES
	            .map((offset) => newSquareFrom(offset[0], offset[1]))
	            .filter((square) => square !== undefined);
	    }

	    // Calculute new set of square coords against the offsets
	    const newSquareFrom = (xOffset, yOffset) => {
	        const [newX, newY] = [xPosition + xOffset, yPosition + yOffset];
	        if (0 <= newX && newX < 8 && 0 <= newY && y < 8) {
	          return chessSquare(newX, newY);
	        }
	    }

	    // Get/set map constructor object name(s)
	    if (squareRegistry.has(name())) {
	        return squareRegistry.get(name());
	    } else {
	        const newSquare = { name, getPredecessor, setPredecessor, possibleKnightMoves }
	        squareRegistry.set(name(), newSquare);
	        return newSquare;
	    }
	}

	// Intake the click coords from user and run the search algo
	const knightsTravails = (start, finish) => {
	    squareRegistry.clear();
	  
	    const origin = chessSquare(...start);
	    const target = chessSquare(...finish);
	  
	    const queue = [origin];
	    while (!queue.includes(target)) {
	      const currentSquare = queue.shift();
	  
	      const enqueueList = currentSquare.possibleKnightMoves();
	      enqueueList.forEach((square) => square.setPredecessor(currentSquare));
	      queue.push(...enqueueList);
	    }
	    const path = [target]
	    while (!path.includes(origin)) {
	      const prevSquare = path[0].getPredecessor();
	      path.unshift(prevSquare);
	    }
	    // console.log(`The shortest path was ${path.length - 1} moves!`);
	    // console.log("The moves were:");
	    let squareCoord = [];
	    path.forEach((square) => {
	        // console.log(square.name());
	        squareCoord.push(square.name());
	    });
	    // console.log(squareCoord);
	    displayMoves(path, squareCoord);
	};

	const displayMoves = (path, squareCoord) => {
	    // Remove any existing p tags from previous move, if any
	    if (document.querySelector("p") !== null) {
	        const displayDiv = document.querySelector("div");
	        const pNodes = displayDiv.querySelectorAll("p");
	        pNodes.forEach((pNode) => pNode.remove());
	    }
	    const displayDiv = document.querySelector("div");
	    const moveNumber = document.createElement("p");
	    const coordList = document.createElement("p");
	    moveNumber.textContent = `The shortest path was ${path.length - 1} moves!`;
	    coordList.innerHTML = squareCoord.join("<br>");
	    displayDiv.appendChild(moveNumber);
	    displayDiv.appendChild(coordList);  
	};

    document.body.appendChild(chessTable);

    const resetButton = document.querySelector(".reset-button");
    resetButton.addEventListener("click", function () {
    	location.reload();
    });


