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
        const colorList = select("#color-picker-card-colors-list").children;
		const colorCircles = select("#color-picker-card-result-image").getElementsByTagName("div");
        const colorPickerCard = select("#color-picker-card");
		const colorRangeTitle = select("#color-picker-range-title");
		let colorRangeTimeOut;
		
		for(let i = 0; i < colorCircles.length; i++) {
			colorCircles[i].addEventListener("click", (event) => {
				if(colorList[i].classList.contains("glow-animation"))
					return;
				colorList[i].classList.add("glow-animation");
				colorList[i].scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
				setTimeout(function(){colorList[i].classList.remove("glow-animation")}, 1000 * parseInt(getComputedStyle(select(".glow-animation")).animationDuration));
			}, false);
		}
        
		['change', 'input', 'mousedown'].forEach(function(e){
			colorRange.addEventListener(e, (event) => {
				clearTimeout(colorRangeTimeOut);
				let i = 0;
				for(i = 0; i < colorRange.value; i++) {
					colorList[i].hidden = false;
					colorCircles[i].classList.remove("hidden");
					/* colorCircles[i].hidden = false; */
				}
				for(; i < colorRange.max; i++) {	
					colorList[i].hidden = true;
					colorCircles[i].classList.add("hidden");
					/* colorCircles[i].hidden = true; */
				}
				
				if(!window.matchMedia("(max-width: 768px)").matches)
					colorPickerCard.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
				
				
				colorRangeTitle.innerHTML = colorRange.value;
				function convertRemToPixels(rem) {    
					return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
				}
				
				let thumbWidth = convertRemToPixels(1);
				let rangeMax = colorRange.max;
				let rangeMin = colorRange.min;
				let rangeWidth = colorRange.offsetWidth;
				let pos = (colorRange.value-rangeMin) / (rangeMax-rangeMin);
				let thumbCorrect = thumbWidth * (pos-0.5)* -1;
				let titlePos = Math.round((pos*rangeWidth)-thumbWidth/4 + thumbCorrect)-10;
				colorRangeTitle.style.left = titlePos + "px";
				colorRangeTitle.hidden = false;
				colorRangeTitle.style.backgroundColor = "rgba(13, 15, 16, 0.75)";
				colorRangeTimeOut = setTimeout(function(){
					let evt = document.createEvent("Event");
					evt.initEvent("focusout", true, true);
					colorRange.dispatchEvent(evt);
				}, 500);
			
        }, false);
		});
		
        
		
		colorRange.addEventListener("focusout", (event) => {
			clearTimeout(colorRangeTimeOut);
			colorRangeTitle.style.backgroundColor = "white";
			colorRangeTimeOut = setTimeout(function(){colorRangeTitle.hidden=true}, 300);
		}, false);
    }
	
	
	
	
	
	
	const colorCircles = select("#color-picker-card-result-image").getElementsByTagName("div");
	const uploadImageButton = select("#color-picker-upload-button");
	uploadImageButton.addEventListener("click", (event) => {
		function getRandomInt(max) {
			return Math.floor(Math.random() * max);
		}
		
		for(let circle of colorCircles) {
			let size = getRandomInt(24) + 24;
			circle.style.height = size + "px";
			circle.style.width = size + "px";
			circle.style.top = getRandomInt(85) + "%";
			circle.style.left = getRandomInt(85) + "%";
		}
		
	}, false);

	
	
	
	
	
	
	
	


    window.addEventListener("load", startup, false);
})();