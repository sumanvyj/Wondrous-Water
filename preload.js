(function() {
    var sources = [];

    var callback = function() {
        //swayUR();
    };

    var loadNextScript = function() {
        if (sources.length > 0) {
            var script = document.createElement('script');
            script.src = sources.shift();
            document.body.appendChild(script);

            var done = false;
            script.onload = script.onreadystatechange = function() {
                if (!done
                        && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                    done = true;

                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;

                    loadNextScript();
                }
            }
        } else {
            callback();
        }
    }
    
    if (typeof (jQuery) == 'undefined') {
        sources.push('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
    }

    if (typeof (swayUR) == 'undefined') {
        sources.push('http://rileya.com/hacku/transform.min.js');
        sources.push('http://rileya.com/hacku/trans.js');
        sources.push('http://rileya.com/hacku/Three.js');
        sources.push('http://rileya.com/hacku/fish.js');
        sources.push('http://rileya.com/hacku/water.js');
    }

    loadNextScript();
})();
