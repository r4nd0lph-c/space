(function() {
	"use strict"
	
	//this is temporary
	
	
	//Convertes from HEX to RGB
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
	
	
	const paletteColors = select("#palette-generator-card-result").children;
	
	function checkBrightness() {
		const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
		for(let paletteColor of paletteColors) {
			const backgroundColor = hexToRgb(rgba2hex(paletteColor.style.backgroundColor));
			
			//Default
			let textColor = "#000000";
			
			//Checking if background color is bright enough
			if(backgroundColor.r * 0.299 + backgroundColor.g * 0.587 + backgroundColor.b * 0.114 < 128)
				textColor = "#FFFFFF";
			
			//Changing color of the text
			for(let child of paletteColor.children)
				child.style.color = textColor;
		}
	}

	checkBrightness();
	
	
})();