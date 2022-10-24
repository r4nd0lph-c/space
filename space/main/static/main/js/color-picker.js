(function() {
    "use strict"

    /* Bootstrap Popper library */
    /* Popovers */
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })

    //Generates random hex-color
    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    //Convertes from HEX to RGB
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function startup() {
        const colorRange = select("#color-picker-range");
        const colorsList = select("#color-picker-card-colors-list").children;
        const colorPickerCard = select("#color-picker-card");
        
        
        
        colorRange.addEventListener("input", (event) => {
            let i = 0;
            for(i = 0; i < colorRange.value; i++)
                colorsList[i].hidden = false;
            for(; i < colorRange.max; i++)
                colorsList[i].hidden = true;
            
            if(!window.matchMedia("(max-width: 768px)").matches)
                colorPickerCard.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
            
        }, false);
    }

    window.addEventListener("load", startup, false);
})();