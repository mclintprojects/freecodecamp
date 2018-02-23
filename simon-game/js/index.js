var gameStarted = false;
var aiOperations = [];
var userOperations = [];
var gameStartDelay;
var playOperationsPauseTimer, var playOperationsPause = 700, var currentDisplayOperationIndex = 0;

$(document).ready(function(){
	addListeners();
});

function addListeners(){
	$('#startBtn').on('click', function(){
		gameStarted = true;
		
		$(this).fadeOut();
		$('#endBtn').fadeIn();
		$('#bucket').slideDown();
		
		gameStartDelay = setInterval(initializeGame, 3000);
	});
	
	$('#endBtn').on('click', function(){
		gameStarted = false;
		
		
		$(this).fadeOut();
		$('#startBtn').fadeIn();
		$('#bucket').slideUp();
	});
}

function initializeGame(){
	clearInterval(gameStartDelay);
	var aiOperation = (Math.random() * 5);
	
	aiOperations.push(aiOperation);
	playOperations(aiOperations());
}

function playOperations(operations){
	playOperationsPauseTimer = setInterval(displayOperations(operations), playOperationsPause);
}

function displayOperations(operations){
	var operationToDisplay = operations[display]
}