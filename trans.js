/* 'UR' (for 'Underwater Roof') appended to variable and
 * function names to prevent namespace collisions */

var boolArrUR = [0, 0, 0, 0, 0, 1];

// animate all the things!
function swayUR() {
    // get all children of body
    var elements = $('body *');

    // give IDs to all elements
    for (var i = 0; i < elements.length; i++) {
        elements[i].id = 'animUR' + i;
    }

    for (var i = 0; i < elements.length; i++) {
        // do some initial animation
        $("#animUR" + i).animate({
            translateX: signUR() + '=' + (5 * boolArrUR[0]),
            translateY: signUR() + '=' + (5 * boolArrUR[1]),
            scale: signUR() + '=' + (0.01 * boolArrUR[2]),
            rotateY: signUR() + '=' + (0.005),
            rotateX: signUR() + '=' + (0.005),
            rotateZ: signUR() + '='+ (0.005)
        },1500);

        // loop animation
        setInterval('transUR('+i+')', 1500);
    }
}

// randomly transform one property of a desired element
function transUR(n) {
    $('#animUR' + n).animate({
        translateX: signUR() + '=' + (5 * boolArrUR[0]),
        translateY: signUR() + '=' + (5 * boolArrUR[1]),
        scale: signUR() + '=' + (0.01 * boolArrUR[2]),
        rotateY: signUR() + '=' + (0.01 * boolArrUR[3]),
        rotateX: signUR() + '=' + (0.01 * boolArrUR[4]),
        rotateZ: signUR() + '='+ (0.01 * boolArrUR[5])
    },1500);

    boolArrUR = shuffleUR(boolArrUR);
}

// return a random sign
function signUR() {
    return Math.random() > 0.5 ? '-' : '+';
}

// shuffle an array
function shuffleUR(arr) { 
    for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
};
