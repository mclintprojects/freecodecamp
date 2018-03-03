// game variables
var gameStarted = false;
var gameIsStrict = false;
var aiOperations = [];
var playOperationsPauseTimer;
var currentAiDisplayOperationIndex = 0;
var currentUserOperationIndex = 0;
var gameScore = 0;
var listeningToUserOperations = false;
var maxRounds = 20;

// audio
var redSound = new Audio(
	'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'
);
var greenSound = new Audio(
	'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'
);
var blueSound = new Audio(
	'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'
);
var purpleSound = new Audio(
	'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'
);
var errorSound = new Audio(
	'http://www.freesound.org/data/previews/331/331912_3248244-lq.mp3'
);

// game ui objects
var startBtn;
var endBtn;
var userTurnLbl;
var scoreLbl;
var restartBtn;

$(document).ready(function() {
	startBtn = $('#startBtn');
	endBtn = $('#endBtn');
	userTurnLbl = $('#userTurnLbl');
	scoreLbl = $('#scoreLbl');
	restartBtn = $('#restartBtn');

	addListeners();
});

function addListeners() {
	startBtn.on('click', function() {
		gameStarted = true;
		$(this).css('background-color', 'lawngreen');
		endBtn.show();
		restartBtn.show();

		setTimeout(playAiTurn, 1000);
	});

	endBtn.on('click', function() {
		endGame();
	});

	$('#redBtn').on('click', function() {
		recordUserOperation(0);
	});

	$('#greenBtn').on('click', function() {
		recordUserOperation(1);
	});

	$('#blueBtn').on('click', function() {
		recordUserOperation(2);
	});

	$('#purpleBtn').on('click', function() {
		recordUserOperation(3);
	});

	$('#strictBtn').on('click', function() {
		gameIsStrict = true;
		$(this).css('background-color', 'lawngreen');
	});

	$('#restartBtn').on('click', function() {
		resetGame();
		setTimeout(playAiTurn, 1000);
	});
}

function endGame() {
	gameStarted = false;
	gameIsStrict = false;
	$('#startBtn').css('background-color', 'red');
	$('#strictBtn').css('background-color', 'red');
	endBtn.hide();
	restartBtn.hide();

	resetGame();
}

function recordUserOperation(operation) {
	if (listeningToUserOperations) {
		playOperationSound(operation);

		if (currentUserOperationIndex < aiOperations.length) {
			if (aiOperations[currentUserOperationIndex] == operation) {
				currentUserOperationIndex++;

				if (currentUserOperationIndex >= maxRounds) {
					alert('Congrats! You won!');
					endGame();
				} else if (currentUserOperationIndex >= aiOperations.length) {
					gameScore++;
					scoreLbl.text(gameScore);
					currentUserOperationIndex = 0;
					userTurnLbl.slideUp();
					setTimeout(playAiTurn, 1000);
				}
			} else {
				errorSound.play();

				if (gameIsStrict) {
					endGame();
				} else {
					userOperations = [];
					currentAiDisplayOperationIndex = 0;
					currentUserOperationIndex = 0;
					listeningToUserOperations = false;

					clearInterval(playOperationsPauseTimer);
					playAiOperations(aiOperations);
				}
			}
		}
	}
}

function resetGame() {
	clearInterval(playOperationsPauseTimer);

	gameScore = 0;
	scoreLbl.text(gameScore);
	userTurnLbl.slideUp();

	aiOperations = [];
	userOperations = [];
	currentAiDisplayOperationIndex = 0;
	currentUserOperationIndex = 0;
	listeningToUserOperations = false;
}

function playOperationSound(operation) {
	switch (operation) {
		case 0:
			redSound.play();
			break;

		case 1:
			greenSound.play();
			break;

		case 2:
			blueSound.play();
			break;

		case 3:
			purpleSound.play();
			break;
	}
}

function playAiTurn() {
	var aiOperation = Math.floor(Math.random() * 4);

	aiOperations.push(aiOperation);
	playAiOperations();
}

function playAiOperations() {
	playOperationsPauseTimer = setInterval(displayAiOperations, 600);
}

function displayAiOperations() {
	console.log('Displayed AI operation');
	if (currentAiDisplayOperationIndex < aiOperations.length) {
		var operationToDisplay = aiOperations[currentAiDisplayOperationIndex];
		playOperation(operationToDisplay);

		currentAiDisplayOperationIndex++;

		if (currentAiDisplayOperationIndex >= aiOperations.length)
			startListeningToUser();
	}
}

function startListeningToUser() {
	userTurnLbl.slideDown();
	currentAiDisplayOperationIndex = 0;
	clearInterval(playOperationsPauseTimer);
	listeningToUserOperations = true;
}

function playOperation(operation) {
	var btnToHighlight = getBtnToHighlight(operation);
	highlightBtn(btnToHighlight, operation);
}

function highlightBtn(btn, operation) {
	playOperationSound(operation);
	$(btn).addClass('hover');
	setTimeout(() => $(btn).removeClass('hover'), 300);
}

function getBtnToHighlight(operation) {
	switch (operation) {
		case 0:
			return '#redBtn';

		case 1:
			return '#greenBtn';

		case 2:
			return '#blueBtn';

		case 3:
			return '#purpleBtn';
	}
}
