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
	
	//Converts from RGB to HSV
	function rgbToHsv(r, g, b) {
		r /= 255, g /= 255, b /= 255;
		
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, v = max;

		var d = max - min;
		s = max == 0 ? 0 : d / max;
		
		if (max == min) {
			h = 0; // achromatic
		} else {
			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
		
		return { 
			h: parseFloat(h),
			s: parseFloat(s),
			v: parseFloat(v)
		};
	}
	
	//Converts from RGB to HSL
	function rgbToHsl(r, g, b) {
		r /= 255, g /= 255, b /= 255;

		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if (max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			
			h /= 6;
		}
		
		return { 
			h: parseFloat(h),
			s: parseFloat(s),
			l: parseFloat(l)
		};
	}
	
	
	function startup() {
		
		//Array containing HEX-codes of all palette colors
		//This array will be interacting with back-end
		let hexPaletteColors;
		
		//TODO: Doubly linked list containing history of colors
		let hexPaletteColorsHistory;
		
		//Palette - div containing all colors
		const palette = select("#palette-generator-card-result");
		const paletteColors = select("#palette-generator-card-result").children;
		
		
		//Checks the contrast between text and background color and changes colors if necessary
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
		//Returns new color div
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
			newColorSpanInfo.setAttribute("data-bs-toggle", "modal");
			newColorSpanInfo.setAttribute("data-bs-target", "#palette-generator-color-info-modal");
			
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
			
			//Adding listeners to enable functionality of the new color div
			addAllListeners(newColor);
			
			return newColor;
		}
		
		
		//Goes through all palette colors and toggles add icon for each color but last, removes add icon from last color
		function hideLastPaletteColorAdd() {
			let i = 0;
			for(i = 0; i < paletteColors.length-1; i++) {
				paletteColors[i].getElementsByClassName("palette-generator-card-result-color-add")[0].style.removeProperty("display");
			}
			paletteColors[i].getElementsByClassName("palette-generator-card-result-color-add")[0].style.display = "none";
		}
		
		
		//Adds all functionality to palette color div
		function addAllListeners(paletteColor) {
			const colorH3 = paletteColor.querySelector("h3");
			const colorH3Input = paletteColor.querySelector("input");
			//Add new color icon
			const colorAdd = paletteColor.querySelector(".palette-generator-card-result-color-add i");
			//Drag colors icon
			const colorDrag = paletteColor.querySelector(".palette-generator-card-result-color-tools .bi-arrow-left-right");
			//Remove color icon
			const colorRemove = paletteColor.querySelector(".palette-generator-card-result-color-tools .bi-x-lg");
			//Lock color icon
			const colorUnlock = paletteColor.querySelector(".palette-generator-card-result-color-tools .bi-unlock-fill");
			//Color info icon
			const colorInfo = paletteColor.querySelector(".palette-generator-card-result-color-tools .bi-info-square");
			
			
			/* Adding all necessary listeners */
			
			//When mouse clicked on h3 - show up color input
			colorH3.addEventListener("click", function() {
				colorH3Input.click();
			});
			
			//When color input value changed - change color of text and background
			colorH3Input.addEventListener("input", function() {
				paletteColor.style.backgroundColor = colorH3Input.value;
				colorH3.textContent = colorH3Input.value;
				checkBrightness();
			});
			
			
			//Checks how many palette colors there are left, and hides or shows remove color icons
			function CheckAndToggleRemoveIcons() {
				const removeIcons = palette.getElementsByClassName("bi-x-lg");
				//First color is the reference - depending on this value we decide whether to hide or show the icons
				const showIcons = removeIcons[0].style.visibility;
				//If less than 3 - hide or show remove color icons
				if(paletteColors.length <= 3)
					for(let removeIcon of removeIcons) {
						if(showIcons)
							removeIcon.style.removeProperty("visibility");
						else
							removeIcon.style.visibility = "hidden";
					}
			}
			
			
			//When clicked on add color icon - create new color div with constructor, set the color to the mean of two adjacent colors
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
				//Smooth animtaion of appearing
				newColor.style.flex = "0";
				newColor.style.padding = "0";
				paletteColor.after(newColor);
				setTimeout(function() {
					newColor.style.removeProperty("flex");
					newColor.style.removeProperty("padding");
				}, 100);
				
				//Checking brightness and remove icons
				CheckAndToggleRemoveIcons();
				checkBrightness();
			});
			
			
			//When clicked on remove color icon - remove color div from palette
			colorRemove.addEventListener("click", function () {
				//Smooth animation of disappearing
				paletteColor.style.flex = "0";
				paletteColor.style.padding = "0";
				
				CheckAndToggleRemoveIcons();
				
				setTimeout(function() {
					paletteColor.remove();
					hideLastPaletteColorAdd();
				}, 300);
			});
			
			
			//When clicked on unlock color icon - toggle lock-unlock state of color
			colorUnlock.addEventListener("click", function () {
				if(colorUnlock.classList.contains("bi-unlock-fill")) {
					colorUnlock.classList.remove("bi-unlock-fill");
					colorUnlock.classList.add("bi-lock-fill");
				}else {
					colorUnlock.classList.remove("bi-lock-fill");
					colorUnlock.classList.add("bi-unlock-fill");
				}
			});
			
			//When clicked on color info icon - change the modal components according to the color
			colorInfo.addEventListener("click", function () {
				const hexColor = colorH3.textContent;
				const hexLine = "HEX: " + hexColor;
				document.querySelector("#palette-generator-color-info-modal-color").style.backgroundColor = hexColor;
				const rgbColor = hexToRgb(hexColor);
				const rgbLine = "RGB: rgb(" + rgbColor.r + ", " + rgbColor.g + ", " + rgbColor.b + ");";
				const hsvColor = rgbToHsv(rgbColor.r, rgbColor.g, rgbColor.b);
				const hsvLine = "HSV: hsv(" + (hsvColor.h*100).toFixed(0) + "%, " + (hsvColor.s*100).toFixed(0) + "%, " + (hsvColor.v*100).toFixed(0) + "%);";
				const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);
				const hslLine = "HSL: hsl(" + (hslColor.h*100).toFixed(0) + "%, " + (hslColor.s*100).toFixed(0) + "%, " + (hslColor.l*100).toFixed(0) + "%);";
				
				const result = [hexLine, rgbLine, hsvLine, hslLine].join("\r\n");
				
				const preCode = document.querySelector("#palette-generator-color-info-modal pre code");
				preCode.innerHTML = result;
				hljs.highlightElement(preCode);
			});
			
			
			//Palette colors div drag logic
			
			//Reseting default behaviour on mouse drag
			palette.ondragstart = function() {
				return false;
			};
			
			
			//Our own logic on mouse drag
			//Mousedown - mouse click
			colorDrag.onmousedown = function(evt) {
				
				//Changing cursor style
				palette.style.cursor = 'grabbing';
				colorDrag.style.cursor = 'grabbing';
				
				//Initial left-offset of colorDrag icon (starting from left-side of user's screen)
				const colorDragInitialLeft = colorDrag.getBoundingClientRect().left;
				//Initial left-offset of the palette containing all the colors
				const paletteColorInitialLeft = paletteColor.getBoundingClientRect().left;
				//Computed width of the being dragged color div
				const paletteColorWidth = parseFloat(getComputedStyle(paletteColor).width);
				//Left and right boundary - to keep the being dragged color div withing boundaries
				const leftBoundary = palette.getBoundingClientRect().left;
				const rightBoundary = leftBoundary + parseFloat(getComputedStyle(palette).width);
				//If direction = 1 - moving color div to the right
				//If direction = -1 - moving color div to the left
				let direction = 1;
				//How many positions we need to shift our color div
				let count;
				//X-coordinate of the movement (in px)
				let diff;
				
				paletteColor.style.position = "relative";
				//Settings z-index so that the being dragged color is above the others
				paletteColor.style.zIndex = "10";
				
				//Action on mouse move while mouse clicked
				function paletteColorMove(evt) {
					
					diff = evt.clientX - colorDragInitialLeft;
					//Not allowing to drag the color further left
					if((paletteColorInitialLeft + diff) < leftBoundary) {
						diff = (leftBoundary - paletteColorInitialLeft + 1);
					//Not allowing to drag the color further right
					}else if ((paletteColorInitialLeft + diff + paletteColorWidth) > rightBoundary) {
						diff = (rightBoundary - paletteColorInitialLeft - paletteColorWidth - 1);
					}
					
					//Moving the color div
					paletteColor.style.left = diff + "px";
					
					//Moving siblings
					//Siblings to the right hand
					if(diff > 0) {
						direction = 1;
						count = diff / paletteColorWidth;
						count = Math.floor(count + 0.5);
						let current = paletteColor.nextElementSibling;
						for(let i = 0; i < count; i++) {
							current.style.transform = "translate(" + -paletteColorWidth +"px , 0)";
							current = current.nextElementSibling;
						}
						
						while(current) {
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
					// console.log(diff);
				}
			
			
				palette.addEventListener('mousemove', paletteColorMove);

				
				//When mouse unclicked - remove mousemove listener
				function removePaletteColorMove() {
					//Reseting cursor style
					palette.style.removeProperty("cursor");
					colorDrag.style.removeProperty("cursor");
					
					palette.removeEventListener('mousemove', paletteColorMove);
					
					
					//Moves palette color in HTML DOM to 'count' positions
					function movePaletteColorTo(elem, direction, count) {
						for(let i = 0; i < count; i++) {
							if (direction === -1 && elem.previousElementSibling) {
								palette.insertBefore(elem, elem.previousElementSibling);
							} else if (direction === 1 && elem.nextElementSibling) {
								palette.insertBefore(elem, elem.nextElementSibling.nextElementSibling)
							}	
						}						
					}
					
					
					//Smooth animation for moving color divs
					paletteColor.style.transition = "left 0.3s ease-out 0s";
					paletteColor.style.left = direction*paletteColorWidth*count + "px";

					//Moving color divs in HTML DOV after animation is done (300ms that is)
					setTimeout(function() {
						movePaletteColorTo(paletteColor, direction, count);
						//If the color was dragged to the last position, we will hide its add color icon
						hideLastPaletteColorAdd();
						
						
						//Removing all properties that were set while dragging
						paletteColor.style.removeProperty("transition");
						paletteColor.style.removeProperty("left");
						paletteColor.style.removeProperty("z-index");
						paletteColor.style.removeProperty("position");
						
						for(let i = 0; i < paletteColors.length; i++) {
							paletteColors[i].style.transition = "none";
							paletteColors[i].style.transform = "translate(0, 0)";
						}
						
						setTimeout(function() {
							for(let i = 0; i < paletteColors.length; i++) {
								paletteColors[i].style.removeProperty("transition");
								paletteColors[i].style.removeProperty("transform");
							}
						}, 10);
					}, 300);
					
					
					palette.onmouseup = null;
					palette.onmouseleave = null;
				}

				//If user releases mouse button or moves cursor outside palette - stop dragging
				palette.onmouseup = removePaletteColorMove;
				palette.onmouseleave = removePaletteColorMove;
			}
			
			
			//Custom hover state change
			//Needed custom hover bc hovering with ":hover" is "shaky" when dragging color is finished
			paletteColor.onmouseenter = function() {
				paletteColor.classList.add("hovered");
			}
			
			paletteColor.onmouseleave = function() {
				paletteColor.classList.remove("hovered");
			}
		}
		
		
		for(let i = 0; i < paletteColors.length; i++) {
			addAllListeners(paletteColors[i]);
		}
			
		
		hideLastPaletteColorAdd();
		checkBrightness();
	}

	window.addEventListener("load", startup, false);
	
})();