const BLACK_COLOR = '#000000'
const LINE_WIDTH = 10;

var currentX = 0;
var currentY = 0;
var prevX = 0;
var prevY = 0;

var mousePressed = 0;
var canvas;
var context;

function prepareCanvas() {
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext('2d');

	context.fillStyle = BLACK_COLOR;
	context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	context.strokeStyle = "white";
	context.lineWidth = LINE_WIDTH;
	context.lineJoin = 'round';

	document.addEventListener('mousedown', function(event){
		mousePressed = true;
	});
	document.addEventListener('mouseup', function(event){
		mousePressed = false;
	});
	document.addEventListener('mousemove', function(event){
		prevX = currentX;
		prevY = currentY;
		currentX = event.clientX - canvas.offsetLeft;
		currentY = event.clientY - canvas.offsetTop;
		if (mousePressed) {
			draw();
		}
	});
	canvas.addEventListener('mouseleave', function(event){
		mousePressed = false;
	});

	// Touch Events
	canvas.addEventListener('touchstart', function(event){
		currentX = event.touches[0].clientX - canvas.offsetLeft;
		currentY = event.touches[0].clientY - canvas.offsetTop;
		mousePressed = true;
	});
	canvas.addEventListener('touchcancel', function(event){
		mousePressed = false;
	});
	canvas.addEventListener('touchmove', function(event){
		prevX = currentX;
		prevY = currentY;
		currentX = event.touches[0].clientX - canvas.offsetLeft;
		currentY = event.touches[0].clientY - canvas.offsetTop;
		if (mousePressed) {
			draw();
		}
	});
}
		
function clearCanvas() {
	currentX = 0;
	currentY = 0;
	prevX = 0;
	prevY = 0;
	const canvas = document.getElementById('myCanvas');
	const context = canvas.getContext('2d');
	context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}	
	
function draw() {
	context.beginPath();
	context.moveTo(prevX, prevY);
	context.lineTo(currentX, currentY);
	context.closePath();
	context.stroke();
}