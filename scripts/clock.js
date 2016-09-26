var stageWidth = 420;
var stageHeight = 320;

var stage;
var layer = new Kinetic.Layer();
var mainImage = new Image();
var hourImage = new Image();

var minuteImage = new Image();
var secondImage = new Image();

var timeText;
var minuteRadial;
var isToggle = true;

var hourGroup = new Kinetic.Group({
    x: (stageWidth / 2),
    y: (stageHeight / 2)
});

var minuteGroup = new Kinetic.Group({
    x: 0,
    y: -50
});
var secondGroup = new Kinetic.Group({
    x: 0,
    y: -67
});

var hourShadow;
var minuteShadow;
var secondShadow;

var clockAnimation = new Kinetic.Animation(function (frame) {
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var milliseconds = date.getMilliseconds();

	var hourFull = hours * 30.00;
	var hourFraction = minutes * 0.50;
	var hourAngle = hourFull + hourFraction;
	var hourAdjust = (isToggle)? angleAdjust(hourAngle, hourGroup.getRotationDeg()):0.5;

	hourGroup.rotateDeg(hourAdjust);
	hourShadow.rotateDeg(hourAdjust);

	var minuteFull = (minutes * 6.00);
	var minuteFraction = (seconds * 0.10);
	var minuteAngle = minuteFull + minuteFraction - hourAngle;
	var minuteAdjust = (isToggle)? angleAdjust(minuteAngle, minuteGroup.getRotationDeg()):3;

	minuteGroup.rotateDeg(minuteAdjust);
	minuteShadow.rotateDeg(hourAdjust + minuteAdjust);

	var secondFull = seconds * 6.00;
	var secondFraction = (milliseconds / 1000.00) * 6.00;
	var secondAngle = (secondFull + secondFraction) - minuteAngle - hourAngle;
	var secondAdjust = (isToggle)? angleAdjust(secondAngle, secondGroup.getRotationDeg()):6;

	secondGroup.rotateDeg(secondAdjust);
	secondShadow.rotateDeg(hourAdjust + minuteAdjust + secondAdjust);

	timeText.setText("Current time: " + ((hours < 10) ? "0" + hours : hours) +
		":" + ((minutes < 10) ? "0" + minutes : minutes) +
		":" + ((seconds < 10) ? "0" + seconds : seconds) +
		":" + milliseconds);

}, layer);

function toggle() {
	isToggle = !isToggle;
}

function angleAdjust(desired, current) {
	return (current < desired) ? desired - current : 360 - (current - desired);
}

function init() {
	stage = new Kinetic.Stage({
	    container: 'experimentcontainer',
		width: stageWidth,
		height: stageHeight
	});

	timeText = new Kinetic.Text({
		x: 15,
		y: 15,
		text: "0",
		fontSize: 12,
		fill: 'black'
	});

	layer.add(timeText);

	mainImage.onload = function () {
	    var hourRadial = renderRadial(
            this,
            (stageWidth / 2) - (this.width / 2),
            (stageHeight / 2) - (this.height / 2),
            [0, 0]);

	    layer.add(hourRadial);

		// Hour arm ---------------------------- //
	    var hourArm = renderClockArm(
            [
                (stageWidth / 2),
                (stageHeight / 2),
                (stageWidth / 2),
                (stageHeight / 2) - (this.height / 4)
            ],
            'red',
            8,
		    0, 0,
            [(stageWidth / 2), (stageHeight / 2)], 1);

	    hourGroup.add(hourArm);

	    layer.add(hourGroup);

		// Hour shadow -------------------------- //
	    hourShadow = renderClockArm(
            [0, -8, 0, 0], 'red', 5, (stageWidth / 2), (stageHeight / 2), [0, 95], 0.4);

	    layer.add(hourShadow);

		// Minutes arm ------------------------- //
	    var minuteRadial = new Kinetic.Circle({
	    	x: 0,
	    	y: -50,
	    	radius: 75,
	    	stroke: 'black',
	    	strokeWidth: 1,
	    	opacity: 0.2
	    });

	    hourGroup.add(minuteRadial);

	    var minuteArm = renderClockArm(
			[0, 0, 0, 0 - this.height / 3], 'blue', 6, 0, 0, [0, 0], 1);

	    minuteGroup.add(minuteArm);
	    hourGroup.add(minuteGroup);

		// Minute shadow -------------------------- //
	    minuteShadow = renderClockArm(
            [0, -8, 0, 0], 'blue', 5, (stageWidth / 2), (stageHeight / 2), [0, 95], 0.4);

	    layer.add(minuteShadow);

		// Seconds arm -------------------------- //
	    var secondRadial = new Kinetic.Circle({
	    	x: 0,
	    	y: -67.6,
	    	radius: 50,
	    	stroke: 'black',
	    	strokeWidth: 1,
	    	opacity: 0.2
	    });

	    minuteGroup.add(secondRadial);

	    var secondArm = renderClockArm(
			[0, 0, 0, 0 - this.height / 5], 'green',4 , 0, 0, [0, 0], 1);

	    secondGroup.add(secondArm);
	    minuteGroup.add(secondGroup);

		// Second shadow -------------------------- //
	    secondShadow = renderClockArm(
            [0, -8, 0, 0], 'green', 5, (stageWidth / 2), (stageHeight / 2), [0, 95], 0.4);

	    layer.add(secondShadow);

	    stage.add(layer);

	    clockAnimation.start();
	};

	mainImage.src = "images/Clock_Face_Main.png";
}

function renderRadial(img, x, y, offset) {
	return new Kinetic.Image({
		x: x,
		y: y,
		image: img,
		offset: offset
	});
}

function renderClockArm(points, stroke, strokeWidth, x, y, offset, opacity) {
    return new Kinetic.Line({
        points: points,
        stroke: stroke,
        strokeWidth: strokeWidth,
        lineCap: 'round',
        lineJoin: 'round',
        x: x,
        y: y,
        offset: offset,
        opacity: opacity
    });
}

jQuery(function ($) {
    init();
});