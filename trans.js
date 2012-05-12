/* 'UR' (for 'Underwater Roof') appended to variable and
 * function names to prevent namespace collisions */


var elemMap = new Array();
var elemSignMap = new Array();
var usedElems = new Array();
var NUM_ACTIVE_ELEMS = 20;

// animate all the things!
function swayUR() {
    // get all children of body
    var elements = $('body *');

    // give IDs to all elements
    for (var i = 0; i < elements.length; i++) {
        $(elements[i]).addClass('animUR' + i);
		elemMap[i] = [0, 0, 0, 0, 0, 10];
		elemSignMap[i] = signUR();
    }

	// usage: 
	// instead of setInterval(render, 16) ....
}

// randomly transform one property of a desired element
function transUR(n) {

	var boolArrUR = elemMap[n];

    $('.animUR' + n).css({
        translateX: elemSignMap[n] + '=' + (1 * Math.min(1,boolArrUR[0])),
        translateY: elemSignMap[n] + '=' + (1 * Math.min(1,boolArrUR[1])),
        scale: elemSignMap[n] + '=' + (0.003 * Math.min(1,boolArrUR[2])),
        rotateY: elemSignMap[n] + '=' + (0.003 * Math.min(1,boolArrUR[3])),
        rotateX: elemSignMap[n] + '=' + (0.003 * Math.min(1,boolArrUR[4])),
        rotateZ: elemSignMap[n] + '='+ (0.003 * Math.random() * Math.min(1,boolArrUR[5]))
    });

	for (var i = 0; i < 6; ++i) {
		if(boolArrUR[i] > 0) {
			boolArrUR[i]--;
			if (boolArrUR[i] == 0) {
				boolArrUR[Math.floor(Math.random()*6)] = 10;
				elemSignMap[n] = signUR();
				return false;
			}
			break;
		}
	}

	return true;
}

// return a random sign
function signUR() {
    return Math.random() > 0.5 ? '-' : '+';
}

function updateTrans() {
	for (var i = 0; i < usedElems.length; ++i) {
		if (!transUR(usedElems[i])) {
			usedElems.splice(i, 1);
			--i;
		}
	}

	while (usedElems.length < NUM_ACTIVE_ELEMS) {
		usedElems.push(Math.floor(Math.random()*elemMap.length));
	}
}

