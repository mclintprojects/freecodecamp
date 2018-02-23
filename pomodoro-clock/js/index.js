var sessionLength = 25 * 60 * 60;
var breakLength = 5 * 60 * 60;
var breakLiteral = "5",
  sessionLiteral = "25";
var sessionStarted = false, sessionPaused = false, breakStarted = false, breakPaused = false, sessionEnded = false;

var sessionTimer = undefined, breakTimer = undefined;

$(document).ready(function() {
  $("#motivation").toggle();
  addListeners();
});

function addListeners() {
  $("#addSession").on("click", function() {
    changeSession("increase");
  });

  $("#removeSession").on("click", function() {
    changeSession("decrease");
  });

  $("#addBreak").on("click", function() {
    changeBreak("increase");
  });

  $("#removeBreak").on("click", function() {
    changeBreak("decrease");
  });

  $("#startBtn").on("click", function() {
    if(breakStarted){
      breakStarted = false;
      $(this).text("START");
    }
    else{
      breakStarted = true;
      $(this).text("STOP");
    }
    
    if(!sessionEnded){
      if (!sessionStarted) {
        sessionStarted = true;
        $('#motivation').text('Get shit done!');
        sessionTimer = setInterval(startSession, 1000);

        $("#pauseBtn").toggle();
        $("#motivation").toggle();
        $("#settings").toggle("slow");
        $(this).text("STOP");
      } else {
        sessionStarted = false;
        clearInterval(sessionTimer);

        sessionLength = parseInt(sessionLiteral) * 3600;
        displayTime(getTimeLeft(sessionLength));

        $("#pauseBtn").toggle();
        $("#motivation").toggle();
        $("#settings").toggle("slow");
        $(this).text("START");
      }
    }
  });

  $("#pauseBtn").on("click", function() {
    if(breakPaused){
      breakPaused = false;
      breakStarted = true;
      $(this).text("PAUSE");
    }
    else{
      breakPaused = true;
      breakStarted = false;
      $(this).text("RESUME");
    }
    
    if(!sessionEnded){
      if (!sessionPaused) {
        sessionPaused = true;
        sessionStarted = false;
        $(this).text("RESUME");
      } else {
        sessionPaused = false;
        sessionStarted = true;
        $(this).text("PAUSE");
      }
    }
  });

  $("#resetBtn").on("click", function() {
    sessionStarted = false;
    sessionEnded = false;
    clearInterval(sessionTimer);

    sessionLength = 25 * 3600;
    breakLength = 5 * 3600;
    displayTime(getTimeLeft(sessionLength));

    $("#pauseBtn").hide();
    $('#startBtn').text('START');
    $("#motivation").hide();
    $("#settings").toggle("slow");
  });
}

function startSession(){
  if (sessionStarted) {
    sessionLength -= 60;
    var time = getTimeLeft(sessionLength);
    displayTime(time);
    
    if(sessionLength == 0){
      sessionEnded = true;
      clearInterval(sessionTimer);
      breakStarted = true;
      $('#motivation').text('Take a fucking break');
      breakTimer = setInterval(startBreak, 1000);
    }
  }
}

function startBreak(){
  if (breakStarted) {
    breakLength -= 60;
    var time = getTimeLeft(breakLength);
    displayTime(time);
    
    if(breakLength == 0){
      $('#resetBtn').click();
      clearInterval(breakTimer);
    }
  }
}

function changeSession(action) {
  if (action == "increase")
    sessionLiteral = (parseInt(sessionLiteral) + 1).toString();
  else if (action == "decrease" && parseInt(sessionLiteral) > 1)
    sessionLiteral = (parseInt(sessionLiteral) - 1).toString();

  sessionLength = parseInt(sessionLiteral) * 3600;
  var time = getTimeLeft(sessionLength);

  $("#sessionLbl").text(time.mins + (time.mins == 1 ? " minute" : " minutes"));
  displayTime(time);
}

function changeBreak(action) {
  if (action == "increase")
    breakLiteral = (parseInt(breakLiteral) + 1).toString();
  else if (action == "decrease" && parseInt(breakLiteral) > 1)
    breakLiteral = (parseInt(breakLiteral) - 1).toString();

  breakLength = parseInt(breakLiteral) * 3600;
  var time = getTimeLeft(breakLength);

  $("#breakLbl").text(time.mins + (time.mins == 1 ? " minute" : " minutes"));
}

function displayTime(time) {
  $("#timer").text(time.mins + ":" + (time.secs == 0 ? "00" : time.secs));
}

function getTimeLeft(time) {
  var mins = Math.floor(time / 3600);
  var secs = Math.floor((time % 3600) / 60);

  return {
    mins: mins,
    secs: secs
  };
}