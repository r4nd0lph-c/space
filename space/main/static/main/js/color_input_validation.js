
//String validation that user actually inputted valid HEX color
const hexReg = /^#([0-9A-F]{3}){1,2}$/i;


const colorInputs = select(".color-input", true);
let colorTooltips = {};
for(let i = 0; i < colorInputs.length; i++) {
	colorTooltips[i] = new bootstrap.Tooltip(colorInputs[i], {
		trigger: "manual"
	});
}

//Validate user's input
//Valid input is a string that has 3 or 6 characters in HEX-code (from 0 to F), with optional "#" symbol at the beginning
function isValid(colorText) {
	let string = colorText.value;
	//Check on optional "#" symbol
	if(string.charAt(0) != "#")
		string = "#" + string;
	
	if(hexReg.test(string)) {
		//If HEX-code is 3-characters value - convert into 6-characters
		if(string.length == 4) {
			string = "#" + string.charAt(1) + string.charAt(1) + string.charAt(2) + string.charAt(2) + string.charAt(3) + string.charAt(3);
		}
		colorText.value = string;
	}
	
	return hexReg.test(string);
}

//Bordering text field and showing tooltip
function showTooltipForColorInput(index) {
	if(!colorTooltips[index]._isShown()) {
		colorTooltips[index].show();
	}
}


function hideTooltipForColorInput(index) {
	if(colorTooltips[index]._isShown()) {
			colorTooltips[index].hide();
	}
}