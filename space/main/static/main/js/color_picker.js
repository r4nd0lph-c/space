(function () {
    "use strict"
	

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
		setUpInfoCirclePopover();
		
		//Main part
        const colorRange = select("#color-picker-range");
        const colorList = select("#color-picker-card-colors-list").children;
		const colorCircles = select("#color-picker-card-result-image").getElementsByTagName("div");
        const colorPickerCard = select("#color-picker-card");
		const colorRangeTitle = select("#color-picker-range-title");
		const uploadImageButton = select("#color-picker-upload-button");
		let colorRangeTimeOut;
		
		
		/* Adding animation when color circle is clicked */
		for(let i = 0; i < colorCircles.length; i++) {
			colorCircles[i].addEventListener("click", (event) => {
				if(colorList[i].classList.contains("glow-animation"))
					return;
				colorList[i].classList.add("glow-animation");
				colorList[i].scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
				setTimeout(function(){colorList[i].classList.remove("glow-animation")}, 1000 * parseInt(getComputedStyle(select(".glow-animation")).animationDuration));
			}, false);
		}
        
		/* Adding event listeners for color range*/
		['change', 'input', 'mousedown'].forEach(function(e) {
			colorRange.addEventListener(e, (event) => {
				clearTimeout(colorRangeTimeOut);
				let i = 0;
				for(i = 0; i < colorRange.value; i++) {
					colorList[i].hidden = false;
					colorCircles[i].classList.remove("hidden");
				}
				
				for(; i < colorRange.max; i++) {	
					colorList[i].hidden = true;
					colorCircles[i].classList.add("hidden");
				}
				
				if(!window.matchMedia("(max-width: 768px)").matches)
					colorPickerCard.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
				
				/* Showing color range title */
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
				colorRangeTimeOut = setTimeout(function() {
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
		
		
		/* Changes text color to white if the background is not bright enough */
		function checkBrightness() {
			const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
			for(let colorItem of colorList) {
				const backgroundColor = hexToRgb(rgba2hex(colorItem.style.backgroundColor));
				
				//Default
				let textColor = "#000000";
				
				//Checking if background color is bright enough
				if(backgroundColor.r * 0.299 + backgroundColor.g * 0.587 + backgroundColor.b * 0.114 < 128)
					textColor = "#FFFFFF";
				
				//Changing color of the text
				for(let child of colorItem.children)
					child.style.color = textColor;
			}
		}
		
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
	
	
		//After all preparations, executing next code:
		
		checkBrightness();
    }
	

    window.addEventListener("load", startup, false);
	
})();