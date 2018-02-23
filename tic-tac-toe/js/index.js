var oTurnColor = '#ffc107';
var xTurnColor = '#039be5';
var gameStarted = false;
var playerTag = '';
var cpuTag = '';
var currentTag = '';
var gameboard;
var messageLbl;
var gameplays = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var thinkingTimer;
var cpuPlaying = false;

$(document).ready(function(){
  messageLbl = $('#messageLbl');
  gameboard = $('#gameBoard');
  
  addListeners();
});

function addListeners(){
  $('#oChoice').on('click', function(){
    startGameWithTag('o');
  });
  
  $('#xChoice').on('click', function(){
    startGameWithTag('x');
  });

  $('.quad').on('click', function(){
    var quadId = $(this).attr('id');
    
    if(!quadrantOccupied(quadId) && !cpuPlaying){
      addPlayToBoard(quadId, currentTag);
      checkIfGameHasBeenWon();
    }
  });
  
  $('#playAgainBtn').on('click', function(){
    gameplays = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    for(var i = 0; i < 10; i++){
      $('#' + i + ' p').text('');
    }
    
    $(this).hide();
    startGameWithTag(playerTag);
  });
}

function quadrantOccupied(quadId){
  return gameplays[quadId - 1] != 0;
}

function checkIfGameHasBeenWon(){
  if(!gameEnded()){
    if(!gameWon()){
      showWhoseTurn(currentTag);
      if(currentTag == cpuTag)
        playCPUTurn();
    }
  }
  else{
    messageLbl.text('Draw!');
    $('#playAgainBtn').show();
  }
}

function gameEnded(){
  return gameplays.filter(val => val == 0).length == 0;
}

function playCPUTurn(){
  messageLbl.text('Thinking...');
  cpuPlaying = true;
  thinkingTimer = setInterval(doneThinking, 1300);
}

function doneThinking(){
  clearInterval(thinkingTimer);
  var playPos = getPlayPos();
  
  addPlayToBoard(playPos, currentTag);
  showWhoseTurn(currentTag);
  cpuPlaying = false;
}

function getPlayPos(){
  var index = 0;
  var emptySpots = [];
  gameplays.forEach(function(val){
    index++;
    if(val == 0){
      emptySpots.push(index);
    }
    emptySpots.sort((a, b) => a > b);
  });
  
  console.log('Empty spots: ', emptySpots);
  var randomEmptySpot = emptySpots[getRandom(0, emptySpots.length)];
  console.log('Random empty spot', randomEmptySpot);
  return (randomEmptySpot);
}

function getRandom(min, max){
  console.log('Min max', min, max);
  return Math.floor(Math.random() * (max - min) + min);
}

function gameWon(){
  return false;
}

function addPlayToBoard(quadId, tag){
  var quadLbl = $('#' + quadId + ' p');
  tag == 'x' ? quadLbl.css('color', xTurnColor) : quadLbl.css('color', oTurnColor);
  quadLbl.text(tag.toUpperCase());
  
  currentTag = tag == playerTag ? cpuTag : playerTag;
  tag == playerTag ? gameplays[quadId - 1] = 1 : gameplays[quadId - 1] = -1;
  
  console.log(tag, quadId, gameplays);
}

function startGameWithTag(tag){
  playerTag = tag;
  cpuTag = tag == 'x' ? 'o' : 'x';
  gameStarted = true;
  
  $('#choosePlayerTag').hide('slow');
  gameboard.show('slow');
  messageLbl.show();
  
  showWhoseTurn(tag);
}

function showWhoseTurn(tag){
  currentTag = tag;
  currentTag == 'x' ? $('body').css('background-color', xTurnColor) : $('body').css('background-color', oTurnColor);
  currentTag == playerTag ? messageLbl.text('Your turn!') : messageLbl.text('CPU\'s turn');
}