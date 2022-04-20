(function (){
	var totalBoxes = 15;
	var boxSize = 100;
	var dimension = 4;
	var emptyX = 0;
	var emptyY = 0;
	var solvable = true;
	window.onload = buildGame;

	//function called on load to create the puzzle board and add functionality to the pieces and shuffle button
	function buildGame(){
	    buildBoxes();
        shuffleButton(); 
		backgroundSelector();
		returnBackground();
	}
	//function used to create the pieces of the puzzle,add CSS elements to each piece, and add functionality to them 
	function buildBoxes(){
		var x = 0;
		var y = 0;
		var count = 0;
		var puzzle = document.getElementById("puzzleGrid"); 
		for (var i = 0; i < totalBoxes; i++){
			var value = i + 1;
			//limits 4 pieces per row, and drops down a row once 4 pieces have been created
			if (count == dimension){
				x = 0;
				y += boxSize;
				count = 0;
			}
			var piece = document.createElement("div");
			piece.className = "box"; 
			piece.innerHTML = value;
			//value used to determine if piece can be moved, changes to true during mouse over if it meets the criteria to move
			piece.value = false;
			piece.style.left = x + "px";
			piece.style.top = y + "px";
			piece.style.backgroundPosition = -x + "px " + -y +"px";
			//determines if a piece is neighboring the empty space when moused over, changes color if it can be moved
			piece.onmouseover = movablePiece;
			//allows the piece to be moved to the empty neighboring space
			piece.onmouseup = makeMovable;
			//reverts piece to original border and coloration
			piece.onmouseout = boxBorder;
			puzzle.appendChild(piece);
			count++;
			x += boxSize;
		}
		//assign the "16th" piece values to emptyX and emptyY
		emptyX = x;
		emptyY = y;
	}
	//function used during shuffle and normal game play to move a piece of the puzzle
	var num_guess = 0;
	function movePiece(thisPiece){
		if (thisPiece.value === true){ 
			num_guess += 1
			//place current X & Y values in temporary variables
			var tempX = parseInt(thisPiece.style.left);
			var tempY = parseInt(thisPiece.style.top);
			//assigns X & Y values of the empty space to the current piece
			thisPiece.style.left = emptyX + "px";
			thisPiece.style.top = emptyY + "px";
			//make the piece non movable to prevent from being moved when it is unacceptable
			thisPiece.value = false;
			//assigns X & Y values of moved piece to empty X & Y values
			emptyX = tempX;
			emptyY = tempY;
			//checks to see if the puzzzle is solved as long as it is not being shuffled
			if (solvable === true){
				checkSolved();
			}
			document.getElementById("guesses").innerHTML=`Moves: ${num_guess-1000}`;
		}
	}
	//tests to see if the current piece can be moved by calling functions to determine if it neighbors the empty space
	function movablePiece(){
		if (testX(this) || testY(this)){
			//call to change the color of the movable piece and change the value to allow movement
			boxHighlight(this);
		}
	}
	//function assigned to each piece's mouse up listener to call the move piece function
	function makeMovable(){
		movePiece(this);
	}
	//function to restore the black border and cursor when the mouse leaves the piece, also makes the piece non movable to prevent illegal moves
	function boxBorder(){
        this.value = false;
        this.style.cursor = "default";
		this.style.color = "cyan";
        this.style.border = "2px solid black";	
	}
    	//changes the border and text coloration of a movable piece, and changes its value to allow movement
	function boxHighlight(thisPiece){
        thisPiece.value = true;
        thisPiece.style.cursor = "pointer";
        thisPiece.style.border = "2px solid cyan";
	}
    //function that is called when a piece of the puzzle is moved to determine if the puzzle is complete
	function checkSolved(){
		var solveX = 0;
		var solveY = 0;
		var count = 0;
		var complete = 0;
		var pieces = document.getElementsByClassName("box");
		//cycles through "spaces" to compare the X and Y cooridnates to the current postions of the puzzle pieces
		for (var i = 0; i < pieces.length; i++){
			if (count == dimension){
				solveX = 0;
				solveY += boxSize;
				count = 0;
			}
			//if the X and Y coordinates match, the complete counter is increased by one, else it is reset
			if (parseInt(pieces[i].style.left) == solveX && parseInt(pieces[i].style.top) == solveY){
				complete++;
			} else {
				complete = 0;
			}
			count++;
			solveX += boxSize;
		}
		//if the puzzle is complete, the win message is displayed, and the number of wins is increased by one and added to local storage
		if (complete == totalBoxes){
			document.getElementById("solved").innerHTML = "Congratulations! You Solved the Puzzle!<br>Press the Shuffle Button to Play Again.";
		} else{
			//win message is cleared if displayed, or nothing is added if not won
			document.getElementById("solved").innerHTML = "";
		}
	}
	//function to determine if the X coordinate of the passed piece is in the same column of the empty square, and if it is above or below it 
	function testX(thisPiece){
		if( parseInt(thisPiece.style.left) == emptyX){
			if(parseInt(thisPiece.style.top) == (emptyY - boxSize) || parseInt(thisPiece.style.top) == (emptyY + boxSize)){
				return true;
			}
		}
	}
	//function to determine if the Y coordinate of the passed piece is in the row of the empty square, and if it is to the left or right of it.
	function testY(thisPiece){
		if ( parseInt(thisPiece.style.top) == emptyY){
			if (parseInt(thisPiece.style.left) == (emptyX - boxSize) || parseInt(thisPiece.style.left) == (emptyX + boxSize)){
				return true;
			}
		}
	}
    //function used to shuffle the puzzle pieces
	function boardShuffle(){
		//clears win text if displayed
		document.getElementById("solved").innerHTML = "";
		//disables solved message in the event the puzzle is solved while shuffling
		solvable = false;
		var pieces = document.getElementsByClassName("box");
		//searches for movable pieces and randomly chooses one movable piece to put into the empty space
		for(var i = 0; i < 1000; i++){
			var neighbors = [];
			for (var j = 0; j < pieces.length; j++){
				if ( testX(pieces[j]) || testY(pieces[j])){
					neighbors.push(pieces[j]);
				}
			}
			var sP = Math.floor(Math.random() * neighbors.length);
			neighbors[sP].value = true;
			movePiece(neighbors[sP]);
			neighbors[sP].value = false;
		}
		//enables win conditions again once shuffle is complete
		solvable = true;
	}
    //adds functionality to the shuffle button, calls the boardShuffle function when clicked
	var currentTimer;
	function shuffleButton(){
		var button = document.getElementById("shuffle");
		button.onclick = () => {
			if (currentTimer) {
				clearInterval(currentTimer)
				document.getElementById('time_limit').innerHTML = `Remaining Time: 120 seconds`;
			};
			if (num_guess) {
				num_guess = 0;
				document.getElementById("guesses").innerHTML=`Moves: ${num_guess}`;
			}
			boardShuffle();
			var timeLeft = 119;
			currentTimer = setInterval(() => {
				document.getElementById('music_sound').muted = false;
				document.getElementById('music_sound').play();
				if (timeLeft <= 0) {
					document.getElementById('music_sound').muted = true;
					clearInterval(currentTimer);
					timeLeft = 120;
					document.getElementById('time_limit').innerHTML = "You have run out of time!";
					// Do something here
				} else {
					// Update timer
					document.getElementById('time_limit').innerHTML = `Remaining Time: ${timeLeft} seconds`;
					timeLeft -= 1;
				}
			}, 1000);
		};
		
	}
	//assigns functionality to the drop down list of background choices, and calls function to change background when a new item is chosen
	function backgroundSelector(){
		var select = document.getElementById("background");
		select.onchange = puzzleBackground;
	}
	//add the background to each piece of the puzzle, also stores current choice in localStorage so the same background will be available when revisited
	function puzzleBackground(){
		var bg = document.getElementById("background").value;
		var pieces = document.querySelectorAll(".box");
		for (var i = 0; i < pieces.length; i++){
			pieces[i].style.backgroundImage = 'url(' + bg + ')';
		}
		localStorage["background"] = bg;
	}
    	//function to display user's last chosen background upon return to the page
	function returnBackground(){
		if(localStorage["background"]){
			var bg = document.getElementById("background");
			bg.value = localStorage["background"];
			var pieces = document.querySelectorAll(".box");
			for (var i = 0; i < pieces.length; i++){
				pieces[i].style.backgroundImage = 'url(' + bg.value + ')';
			}
		}
	}

})();
