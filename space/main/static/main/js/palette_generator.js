(function() {
	"use strict"
	
	
	//Converts from HEX to RGB
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
	
	//Converts from RGB to HEX
	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}
	
	function getRgbFromCssStyle(string) {
		const colors = string.replace('rgb(','').replace(')','').split(',');
		colors[0] = parseInt(colors[0]);
		colors[1] = parseInt(colors[1]);
		colors[2] = parseInt(colors[2]);
		return colors;
	}
	
	function startup() {
		
		const palette = select("#palette-generator-card-result");
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
				paletteColor.querySelector(".palette-generator-card-result-color-tools").style.color = textColor;
				paletteColor.querySelector("h3").style.color = textColor;
				paletteColor.querySelector("p").style.color = textColor;
			}
		}
		
		//New palette color constructor
		function createNewPaletteColor() {
			const newColor = document.createElement("div");
			newColor.className = "palette-generator-card-result-color";
			const newColorSpan = document.createElement("span");
			newColorSpan.className = "palette-generator-card-result-color-tools";
			const newColorSpanX = document.createElement("i");
			newColorSpanX.className = "bi bi-x-lg";
			const newColorSpanUnlock = document.createElement("i");
			newColorSpanUnlock.className = "bi bi-unlock-fill";
			const newColorSpanArrows = document.createElement("i");
			newColorSpanArrows.className = "bi bi-arrow-left-right";
			const newColorSpanInfo = document.createElement("i");
			newColorSpanInfo.className = "bi bi-info-square";
			
			newColorSpan.append(newColorSpanX);
			newColorSpan.append(newColorSpanUnlock);
			newColorSpan.append(newColorSpanArrows);
			newColorSpan.append(newColorSpanInfo);
			
			newColor.append(newColorSpan);
			
			const newColorH3 = document.createElement("h3");
			newColor.append(newColorH3);
			
			const newColorInput = document.createElement("input");
			newColorInput.setAttribute("type", "color");
			newColor.append(newColorInput);
			
			const newColorP = document.createElement("p");
			newColor.append(newColorP);
			
			const newColorDiv = document.createElement("div");
			newColorDiv.className = "palette-generator-card-result-color-add";
			const newColorDivI = document.createElement("i");
			newColorDivI.className = "bi bi-plus-lg";
			newColorDiv.append(newColorDivI);
			newColor.append(newColorDiv);
			
			addAllListeners(newColor);
			
			return newColor;
		}
		
		
		//Adds all functionality to palette color div
		function addAllListeners(paletteColor) {
			const colorH3 = paletteColor.querySelector("h3");
			const colorH3Input = paletteColor.querySelector("input");
			const colorAdd = paletteColor.querySelector(".palette-generator-card-result-color-add i");
			const colorDrag = paletteColor.querySelector(".palette-generator-card-result-color-tools .bi-arrow-left-right");
			const colorRemove = paletteColor.querySelector(".palette-generator-card-result-color-tools .bi-x-lg");
			const colorUnlock = paletteColor.querySelector(".palette-generator-card-result-color-tools .bi-unlock-fill");
			
			colorH3.addEventListener("click", function() {
				colorH3Input.click();
			});
			
			colorH3Input.addEventListener("input", function() {
				paletteColor.style.backgroundColor = colorH3Input.value;
				colorH3.textContent = colorH3Input.value;
				checkBrightness();
			});
			
			colorAdd.addEventListener("click", function() {
				const newColor = createNewPaletteColor();
				const firstColor = getRgbFromCssStyle(paletteColor.style.backgroundColor);
				const secondColor = getRgbFromCssStyle(paletteColor.nextElementSibling.style.backgroundColor);
				const r = Math.round((firstColor[0] + secondColor[0])/2);
				const g = Math.round((firstColor[1] + secondColor[1])/2);
				const b = Math.round((firstColor[2] + secondColor[2])/2);
				const middleColor = rgbToHex(r, g, b);
				newColor.style.backgroundColor = middleColor;
				newColor.querySelector("h3").textContent = middleColor;
				newColor.querySelector("input").value = middleColor;
				paletteColor.after(newColor);
				checkBrightness();
			});
			
			colorRemove.addEventListener("click", function () {
				paletteColor.remove();
			});
			
			colorUnlock.addEventListener("click", function () {
				if(colorUnlock.classList.contains("bi-unlock-fill")) {
					colorUnlock.classList.remove("bi-unlock-fill");
					colorUnlock.classList.add("bi-lock-fill");
				}else {
					colorUnlock.classList.remove("bi-lock-fill");
					colorUnlock.classList.add("bi-unlock-fill");
				}
			});
			
			colorDrag.ondragstart = function() {
				return false;
			};
			
			colorDrag.onmousedown = function(evt) {
				
				for(let i = 0; i < paletteColors.length; i++) {
					paletteColors[i].style.removeProperty("transition");
				}
				
				const colorDragInitialLeft = colorDrag.getBoundingClientRect().left;
				const paletteColorInitialLeft = paletteColor.getBoundingClientRect().left;
				const paletteColorWidth = parseInt(getComputedStyle(paletteColor).width);
				const leftBoundary = palette.getBoundingClientRect().left;
				const rightBoundary = leftBoundary + parseInt(getComputedStyle(palette).width.slice(0, -2));
				// console.log("initial-left: " + paletteColorInitialLeft);
				// console.log("left-boundary: " + leftBoundary);
				// console.log("right-boundary: " + rightBoundary);
				let direction = 1;
				let count;
				
				paletteColor.style.position = "relative";
				paletteColor.style.zIndex = "3";
				
				function paletteColorMove(evt) {
					const colorDragWidth = getComputedStyle(colorDrag).width.slice(0, -2);
					let diff = evt.clientX - colorDragInitialLeft - colorDragWidth/2;
					if((paletteColorInitialLeft + diff) < leftBoundary) {
						paletteColor.style.left = (leftBoundary - paletteColorInitialLeft + 1) + "px";
					}else if ((paletteColorInitialLeft + diff + paletteColorWidth) > rightBoundary) {
						paletteColor.style.left = (rightBoundary - paletteColorInitialLeft - paletteColorWidth - 1) + "px";
					}else {
						paletteColor.style.left = diff + "px";
					}
					

					//Moving siblings
					//Siblings to the right hand
					if(diff > 0) {
						direction = 1;
						count = diff / paletteColorWidth;
						count = Math.floor(count + 0.5);
						let current = paletteColor.nextElementSibling;
						for(let i = 0; i < count; i++) {
							current.style.position = "relative";
							current.style.transform = "translate(" + -paletteColorWidth +"px , 0)";
							current = current.nextElementSibling;
						}
						
						while(current) {
							current.style.removeProperty("position");
							current.style.removeProperty("transform");
							current = current.nextElementSibling;
						}
						
					//Siblings to the left hand
					}else {
						direction = -1;
						count = Math.abs(diff) / paletteColorWidth;
						count = Math.floor(count + 0.5);
						let current = paletteColor.previousElementSibling;
						for(let i = 0; i < count; i++) {
							current.style.transform = "translate(" + paletteColorWidth +"px , 0)";
							current = current.previousElementSibling;
						}
						
						while(current) {
							current.style.removeProperty("transform");
							current = current.previousElementSibling;
						}
					}
					console.log(diff);
				}
			
				palette.addEventListener('mousemove', paletteColorMove);

				function removePaletteColorMove() {
					palette.removeEventListener('mousemove', paletteColorMove);
					//Removing palette colors in HTML DOM
					function movePaletteColorTo(elem, direction, count) {
						for(let i = 0; i < count; i++) {
							if (direction === -1 && elem.previousElementSibling) {
								palette.insertBefore(elem, elem.previousElementSibling);
							} else if (direction === 1 && elem.nextElementSibling) {
								palette.insertBefore(elem, elem.nextElementSibling.nextElementSibling)
							}	
						}						
					}
					
					
					for(let i = 0; i < paletteColors.length; i++) {
						paletteColors[i].style.removeProperty("z-index");
						if(paletteColors[i] == paletteColor) {
							paletteColor.style.transition = "left 0.3s ease-out 0s";
							paletteColor.style.left = "0px";
						}else {
							paletteColors[i].style.transition = "none";
							paletteColors[i].style.removeProperty("z-index");
							paletteColors[i].style.removeProperty("position");
							paletteColors[i].style.removeProperty("transform");
						}
					}
					
				
					movePaletteColorTo(paletteColor, direction, count);
					
					

					
					palette.onmouseup = null;
					palette.onmouseleave = null;
				}

				palette.onmouseup = removePaletteColorMove;
				palette.onmouseleave = removePaletteColorMove;
			}
		}
		
		
		for(let i = 0; i < paletteColors.length; i++) {
			addAllListeners(paletteColors[i]);
		}
			
		
		
		checkBrightness();
	}

	
	
	window.addEventListener("load", startup, false);
	
})();