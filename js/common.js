/* Состояния по умолчанию */
var evCache = new Array();
var prevDiff = -1;

var prevXcoords = -1;

var prevRotate = {
	ax: -1,
	ay: -1,
	bx: -1,
	by: -1
};

var positionImg = 0;
var scaleImg = 1;
var brightnessImg = 100;

function pointerdown_handler(ev) {
	evCache.push(ev);
}

function pointermove_handler(ev) {
	var mobileImg = document.getElementById('gallery-mobile-img');

	for (var i = 0; i < evCache.length; i++) {
		if (ev.pointerId == evCache[i].pointerId) {
			evCache[i] = ev;
			break;
		}
	}

	/* Движение 1 пальца влево/вправо */
	if (evCache.length == 1) {
		if( prevXcoords > 0 ) {
			/* Движение в право */
			if( prevXcoords > evCache[0].clientX ) {
				positionImg += evCache[0].clientX - prevXcoords;
				mobileImg.style.backgroundPositionX = positionImg + 'px';
			}
			/* Движение в лево */
			if( prevXcoords < evCache[0].clientX ) {
				positionImg += evCache[0].clientX - prevXcoords;
				mobileImg.style.backgroundPositionX = positionImg + 'px';
			}
		}
		prevXcoords = evCache[0].clientX;
	}

	/* Движение 2х пальцев от/к друг другу */
	if (evCache.length == 2) {
		var glr = document.querySelector('.gallery__zoom');
		/* Расстояние между точками */
		var curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);
		if (prevDiff > 0) {
			var newParam = (prevDiff - curDiff) * -0.04;
			scaleImg = scaleImg + newParam < 0.5 ? 0.5 : scaleImg + newParam > 5 ? 5 : scaleImg + newParam;
			mobileImg.style.transform = 'scale(' + scaleImg + ')';
			glr.textContent = '1 : ' + parseFloat(scaleImg).toFixed(2);
		}
		prevDiff = curDiff;
	}

	/* Движение 2х пальце по кругу */
	if (evCache.length == 2) {
		var glr = document.querySelector('.gallery__brightness');
		if(
			prevRotate.ax > 0 && prevRotate.ay > 0 &&
			prevRotate.bx > 0 && prevRotate.by > 0
		) {
			/* Движение по часовой стрелке в лево */
			if(
				prevRotate.ax <= evCache[0].clientX &&
				prevRotate.ay >= evCache[0].clientY &&
				prevRotate.bx >= evCache[1].clientX &&
				prevRotate.by <= evCache[1].clientY
			) {
				brightnessImg -= brightnessImg - 1 != 0 ? 1 : 0;
				mobileImg.style.filter = 'brightness(' + brightnessImg + '%)';
				glr.textContent = brightnessImg + '%';
			}
			/* Движение по часовой стрелке в право */
			if(
				prevRotate.ax >= evCache[0].clientX &&
				prevRotate.ay <= evCache[0].clientY &&
				prevRotate.bx <= evCache[1].clientX &&
				prevRotate.by >= evCache[1].clientY
			) {
				brightnessImg += brightnessImg + 1 <= 200 ? 1 : 0;
				mobileImg.style.filter = 'brightness(' + brightnessImg + '%)';
				glr.textContent = brightnessImg + '%';
			}
		}
		if ( evCache[0].clientY < evCache[1].clientY ) {
			prevRotate = {
				ax: evCache[0].clientX,
				ay: evCache[0].clientY,
				bx: evCache[1].clientX,
				by: evCache[1].clientY
			};
		} else {
			prevRotate = {
				ax: evCache[1].clientX,
				ay: evCache[1].clientY,
				bx: evCache[0].clientX,
				by: evCache[0].clientY
			};
		}
	}
}

function pointerup_handler(ev) {
	remove_event(ev);
	if (evCache.length < 1) prevXcoords = -1;
	if (evCache.length < 2) {
		prevDiff = -1;
		prevRotate = {
			ax: -1,
			ay: -1,
			bx: -1,
			by: -1
		};
	}
}

function remove_event(ev) {
	for (var i = 0; i < evCache.length; i++) {
		if (evCache[i].pointerId == ev.pointerId) {
			evCache.splice(i, 1);
			break;
		}
	}
}

function init(targetId) {
	var el = document.getElementById(targetId);

	el.addEventListener("pointerdown", function(e) {
		pointerdown_handler(e);
	});

	el.addEventListener("pointermove", function(e) {
		pointermove_handler(e);
	});

	el.addEventListener("pointerup", function(e) {
		pointerup_handler(e);
	});

	el.addEventListener("pointercancel", function(e) {
		pointerup_handler(e);
	});

	el.addEventListener("pointerout", function(e) {
		pointerup_handler(e);
	});

	el.addEventListener("pointerleave", function(e) {
		pointerup_handler(e);
	});

	// el.onpointerdown = pointerdown_handler;
	// el.onpointermove = pointermove_handler;

	// el.onpointerup = pointerup_handler;
	// el.onpointercancel = pointerup_handler;
	// el.onpointerout = pointerup_handler;
	// el.onpointerleave = pointerup_handler;
}

document.addEventListener('DOMContentLoaded', function() {
	init('gallery');
});