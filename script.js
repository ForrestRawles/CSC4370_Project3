(function (){
	var totalBoxes = 15;
	var boxSize = 100;
	var dimension = 4;
	var EmptyBoxX = 0;
	var EmptyBoxY = 0;
	var solvable = true;
	window.onload = buildGame;

	function buildGame(){
	    buildBoxes();
        shuffleButton(); 
		backgroundSelector();
		returnBackground();
	}

	function buildBoxes(){
		var x = 0;
		var y = 0;
		var count = 0;
		var puzzle = document.getElementById("puzzleGrid"); 
		for (var i = 0; i < totalBoxes; i++){
			var value = i + 1;
			if (count == dimension){
				x = 0;
				y += boxSize;
				count = 0;
			}
			var box = document.createElement("div");
			box.className = "box"; 
			box.innerHTML = value;
			box.value = false;
			box.style.left = x + "px";
			box.style.top = y + "px";
			box.style.backgroundPosition = -x + "px " + -y +"px";
			box.onmouseover = movablePiece;
			box.onmouseup = makeMovable;
			box.onmouseout = boxBorder;
			puzzle.appendChild(box);
			count++;
			x += boxSize;
		}
		EmptyBoxX = x;
		EmptyBoxY = y;
	}
	var num_guess = 0;
	function movePiece(ThisBox){
		if (ThisBox.value === true){ 
			num_guess += 1
			var tempX = parseInt(ThisBox.style.left);
			var tempY = parseInt(ThisBox.style.top);
			ThisBox.style.left = EmptyBoxX + "px";
			ThisBox.style.top = EmptyBoxY + "px";
			ThisBox.value = false;
			EmptyBoxX = tempX;
			EmptyBoxY = tempY;
			if (solvable === true){
				checkSolved();
			}
			document.getElementById("guesses").innerHTML=`Moves: ${num_guess-1000}`;
		}
	}
	function movablePiece(){
		if (testX(this) || testY(this)){
			boxHighlight(this);
		}
	}
	function makeMovable(){
		movePiece(this);
	}
	function boxBorder(){
        this.value = false;
        this.style.cursor = "default";
		this.style.color = "cyan";
        this.style.border = "2px solid black";	
	}
	function boxHighlight(ThisBox){
        ThisBox.value = true;
        ThisBox.style.cursor = "pointer";
        ThisBox.style.border = "2px solid cyan";
	}
	function checkSolved(){
		var a = 0;
		var b = 0;
		var count = 0;
		var correctSlots = 0;
		var boxes = document.getElementsByClassName("box");
		for (var i = 0; i < boxes.length; i++){
			if (count == dimension){
				a = 0;
				b += boxSize;
				count = 0;
			}
			if (parseInt(boxes[i].style.left) == a && parseInt(boxes[i].style.top) == b){
				correctSlots++;
			} else {
				correctSlots = 0;
			}
			count++;
			a += boxSize;
		}
		if (correctSlots == totalBoxes){
			document.getElementById("solved").innerHTML = "Congratulations! You Solved the Puzzle!<br>Press the Shuffle Button to Play Again.";
		} else{
			document.getElementById("solved").innerHTML = "";
		}
	}
	function testX(ThisBox){
		if( parseInt(ThisBox.style.left) == EmptyBoxX){
			if(parseInt(ThisBox.style.top) == (EmptyBoxY - boxSize) || parseInt(ThisBox.style.top) == (EmptyBoxY + boxSize)){
				return true;
			}
		}
	}
	function testY(ThisBox){
		if ( parseInt(ThisBox.style.top) == EmptyBoxY){
			if (parseInt(ThisBox.style.left) == (EmptyBoxX - boxSize) || parseInt(ThisBox.style.left) == (EmptyBoxX + boxSize)){
				return true;
			}
		}
	}
	function boardShuffle(){
		document.getElementById("solved").innerHTML = "";
		solvable = false;
		var boxes = document.getElementsByClassName("box");
		for(var i = 0; i < 1000; i++){
			var neighbors = [];
			for (var j = 0; j < boxes.length; j++){
				if ( testX(boxes[j]) || testY(boxes[j])){
					neighbors.push(boxes[j]);
				}
			}
			var sP = Math.floor(Math.random() * neighbors.length);
			neighbors[sP].value = true;
			movePiece(neighbors[sP]);
			neighbors[sP].value = false;
		}
		solvable = true;
	}
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
				} else {
					document.getElementById('time_limit').innerHTML = `Remaining Time: ${timeLeft} seconds`;
					timeLeft -= 1;
				}
			}, 1000);
		};
		
	}
	function backgroundSelector(){
		var select = document.getElementById("background");
		select.onchange = puzzleBackground;
	}
	function puzzleBackground(){
		var bg = document.getElementById("background").value;
		var boxes = document.querySelectorAll(".box");
		for (var i = 0; i < boxes.length; i++){
			boxes[i].style.backgroundImage = 'url(' + bg + ')';
		}
		localStorage["background"] = bg;
	}

	function returnBackground(){
		if(localStorage["background"]){
			var bg = document.getElementById("background");
			bg.value = localStorage["background"];
			var boxes = document.querySelectorAll(".box");
			for (var i = 0; i < boxes.length; i++){
				boxes[i].style.backgroundImage = 'url(' + bg.value + ')';
			}
		}
	}

})();
