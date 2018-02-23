var operationLiteral = '';
var operationsStack = [];
var operands = ['*', '/', '+', '-'];

$(document).ready(function(){
  addKeyPadListeners();
});

function addKeyPadListeners(){
  $('.keypad').on('click', function(event){
    var senderId = $(this).attr('id');
    
    console.log(senderId);
    performAction(senderId);
  });
}

function performAction(senderId){
  switch(senderId)
    {
      case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': case '0': case '.': case '00':
        addNumericalEntry(senderId);
        break;

      case 'del':
        deleteLastOperation();
        break;

      case 'AC':
        clearCalculator();
        break;

      case '+': case '-': case '/': case '*':
        addOperationalEntry(senderId);

      case '=':
        evaluateEntry();
        break;

      default:
        console.log('Invalid operation.');
    }
}

function evaluateEntry(){
  var result = eval(operationLiteral);
  clearOperations();

  operationsStack.push(result);
  operationLiteral += result;

  displayResult();
}

function addOperationalEntry(senderId){
  if(operationLiteral[operationLiteral.length - 1].match(/[/+\-*]/g) == null && operationLiteral[operationLiteral.length - 1] != '.'){
    operationsStack.push(senderId);
    operationLiteral += senderId;
    displayResult();
  }
}

function clearCalculator(){
  clearOperations();

  $('#resultLbl').text('0');
}

function clearOperations(){
  this.operationsStack.length = 0;
  operationLiteral = '';
}

function deleteLastOperation(){
  if(operationLiteral.length > 0){
    var operationLiteralArray = operationLiteral.split('');
    var indexOfLastEntry = operationLiteralArray.lastIndexOf(operationsStack.pop());

    operationLiteralArray.splice(indexOfLastEntry, 1);
    operationLiteral = operationLiteralArray.join('');
    $('#resultLbl').text(operationLiteral);

    if(operationLiteral.length == 0)
      $('#resultLbl').text('0');
  }
}

function addNumericalEntry(senderId)
{
  if(senderId == '.' && !canInsertDot())
    return;
  else{
    operationsStack.push(senderId);
    operationLiteral += senderId;
    displayResult();
  }
}

function canInsertDot(){
  var lastEntry = operationLiteral[operationLiteral.length - 1];

  // (if last entry is an operand or (the last entry is a number and everything before the last entry does not contain a dot)
  // or (everything before the last entry has atleast one operand and the last entry is a number)) and the last entry isn't a dot

  if((lastEntry.match(/[/+\-*]/g) != null || (lastEntry.match(/[0-9]/g) != null && operationLiteral.substr(0, operationLiteral.length - 1).match(/[\.]/g) == null)
    || (operationLiteral.substr(0, operationLiteral.length - 1).match(/[/+\-*]/g) != null
    && lastEntry.match(/[0-9]/g) != null)) && operationLiteral[operationLiteral.length - 1] != '.')
  {
      return true;
  }
  return false;
}

function displayResult(){
  $('#resultLbl').text(operationLiteral);
}