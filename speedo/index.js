var body,
	readBar,
	searchTb,
	readBtn,
	toggleReadBarBtn,
	wordLbl,
	readCountLbl,
	readingInProgress = false;
var upIcon = 'https://image.flaticon.com/icons/svg/25/25223.svg',
	downIcon = 'https://image.flaticon.com/icons/svg/32/32195.svg';
var readBarIsHidden = false,
	readWordInterval,
	text = '',
	wordsToRead = [],
	currentWordIndex = 0,
	fileReader,
	pdf;
var readingCompleteSound = new Audio(
	'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'
);
var supportedFileTypes = ['text/plain'];

$(document).ready(function() {
	readBar = $('#readBar');
	searchTb = $('#searchTb');
	readBtn = $('#readBtn');
	toggleReadBarBtn = $('#toggleReadBarBtn');
	body = $('body');
	wordLbl = $('#wordLbl');
	readCountLbl = $('#readCountLbl');

	addListeners();
	restoreState();

	toastr.options = {
		positionClass: 'toast-bottom-center',
		hideDuration: '1000'
	};
});

function restoreState() {
	var bgColor = localStorage.getItem('readbgcolor');
	if (bgColor) body.css('background-color', bgColor);

	var speed = localStorage.getItem('speedwpm');
	if (speed) $('#speedTb').val(speed);
}

function addListeners() {
	$('#speedTb').on('keyup', function() {
		if (readingInProgress) {
			clearInterval(readWordInterval);
			var interval = getReadInterval($(this).val());

			readWordInterval = setInterval(readWord, interval);
			localStorage.setItem('speedwpm', $(this).val());
		}
	});

	readBtn.on('click', function() {
		text = searchTb.val();
		if (text.length > 0) {
			startReading();

			toggleReadBar();
			toggleReadBarBtn.attr('src', downIcon);
		}

		toastr.error('Uh oh! I have nothing to read from.');
	});

	toggleReadBarBtn.on('click', function() {
		if (readBarIsHidden) {
			toggleReadBarBtn.attr('src', upIcon);
		} else {
			toggleReadBarBtn.attr('src', downIcon);
		}

		toggleReadBar();
	});

	$('.colorBox').on('click', function() {
		var bgColor = $(this).css('background-color');
		body.css('background-color', bgColor);
		localStorage.setItem('readbgcolor', bgColor);
	});

	$('#pickerBtn').on('click', function() {
		$('#picker').click();
	});

	$('#picker').on('change', function() {
		readSelectedFile($(this)[0].files);
	});

	$('#cancelBtn').on('click', function() {
		clearInterval(readWordInterval);
		readCountLbl.text('0/0 words');
		wordLbl.text('speedread');
		toggleReadBar();
	});
}

function readSelectedFile(files) {
	var file = files[0];
	if (supportedFileTypes.indexOf(file.type) > -1) {
		toastr.info('Parsing file. Please wait..');

		readText(file);
	} else {
		toastr.error('Unsupported file type. Please select a text file.');
	}
}

function readText(file) {
	fileReader = new FileReader();
	fileReader.readAsText(file);

	fileReader.onload = function() {
		text = this.result;
		toggleReadBar();
		startReading();
	};
}
function toggleReadBar() {
	searchTb.toggle();
	readBtn.toggle();
	readBarIsHidden = !readBarIsHidden;
}

function startReading() {
	var speed = $('#speedTb').val();
	var invalidSpeed = isNaN(speed);

	if (!invalidSpeed) {
		readingInProgress = true;
		currentWordIndex = 0;
		clearInterval(readWordInterval);

		var interval = getReadInterval(speed);
		wordsToRead = text.split(' ');
		readWordInterval = setInterval(readWord, interval);
	} else {
		toastr.error("You've provided an invalid reading speed.");
	}
}

function getReadInterval(speed) {
	speed = speed < 50 ? 50 : speed;

	speed = parseInt(speed);
	return 60 / speed * 1000;
}

function readWord() {
	if (currentWordIndex < wordsToRead.length) {
		var wordToRead = wordsToRead[currentWordIndex];

		wordLbl.text(wordToRead);
		readCountLbl.text(
			currentWordIndex + 1 + '/' + wordsToRead.length + ' words'
		);

		currentWordIndex++;
	} else {
		toggleReadBar();
		currentWordIndex = 0;
		readingCompleteSound.play();
		clearInterval(readWordInterval);
		readingInProgress = false;
	}
}
