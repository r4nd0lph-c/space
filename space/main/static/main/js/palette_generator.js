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
		var computedH = 0;
		var computedS = 0;
		var computedV = 0;

		//remove spaces from input RGB values, convert to int
		var r = parseInt( (''+r).replace(/\s/g,''),10 );
		var g = parseInt( (''+g).replace(/\s/g,''),10 );
		var b = parseInt( (''+b).replace(/\s/g,''),10 );
		
		
		r=r/255; g=g/255; b=b/255;
		var minRGB = Math.min(r,Math.min(g,b));
		var maxRGB = Math.max(r,Math.max(g,b));


		// Black-gray-white
		if (minRGB==maxRGB) {
			computedV = minRGB;
			return { 
				h: 0,
				s: 0,
				v: parseFloat(computedV)
			};
		}

		// Colors other than black-gray-white:
		var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
		var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
		computedH = 60*(h - d/(maxRGB - minRGB))/100;
		computedS = (maxRGB - minRGB)/maxRGB;
		computedV = maxRGB;
		
		return { 
			h: parseFloat(computedH),
			s: parseFloat(computedS),
			v: parseFloat(computedV)
		};
	}
	
	//Converts from RGB to HSL
	function rgbToHsl(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;
		const l = Math.max(r, g, b);
		const s = l - Math.min(r, g, b);
		const h = s 
			? l === r
			? (g - b) / s
			: l === g
			? 2 + (b - r) / s
			: 4 + (r - g) / s
			: 0;
		const computedH = 60 * h < 0 ? 60 * h + 360 : 60 * h;
		const computedS = 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0);
		const computedL = (100 * (2 * l - s)) / 2;
		
		return { 
			h: parseFloat(computedH/100),
			s: parseFloat(computedS/100),
			l: parseFloat(computedL/100)
		};
	}
	
	
	/* Script filter for colorblind people */
	class ColorBlindnessFilter {
		static #color_coefficients = {
			"normal": {
				"r": [100, 0, 0],
				"g": [0, 100, 0],
				"b": [0, 0, 100]
			},
			"protanopia": {
				"r": [56.667, 43.333, 0],
				"g": [55.833, 44.167, 0],
				"b": [0, 24.167, 75.833]
			},
			"protanomaly": {
				"r": [81.667, 18.333, 0],
				"g": [33.333, 66.667, 0],
				"b": [0, 12.5, 87.5]
			},
			"deuteranopia": {
				"r": [62.5, 37.5, 0],
				"g": [70, 30, 0],
				"b": [0, 30, 70]
			},
			"deuteranomaly": {
				"r": [80, 20, 0],
				"g": [25.833, 74.167, 0],
				"b": [0, 14.167, 85.833]
			},
			"tritanopia": {
				"r": [95, 5, 0],
				"g": [0, 43.333, 56.667],
				"b": [0, 47.5, 52.5]
			},
			"tritanomaly": {
				"r": [96.667, 3.333, 0],
				"g": [0, 73.333, 26.667],
				"b": [0, 18.333, 81.667]
			},
			"achromatopsia": {
				"r": [29.9, 58.7, 11.4],
				"g": [29.9, 58.7, 11.4],
				"b": [29.9, 58.7, 11.4]
			},
			"achromatomaly": {
				"r": [61.8, 32, 6.2],
				"g": [16.3, 77.5, 6.2],
				"b": [16.3, 32.0, 51.6]
			}
		}

		static #hex2rgb(hex) {
			let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		}

		static #rgb2hex(r, g, b) {
			return ("#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)).toUpperCase();
		}

		filter(type, hex) {
			if (Object.keys(ColorBlindnessFilter.#color_coefficients).includes(type)) {
				let rgb = ColorBlindnessFilter.#hex2rgb(hex);
				let filter_m = ColorBlindnessFilter.#color_coefficients[type];
				return ColorBlindnessFilter.#rgb2hex(
					Math.round(filter_m["r"][0] * rgb["r"] / 100) + Math.round(filter_m["r"][1] * rgb["g"] / 100) + Math.round(filter_m["r"][2] * rgb["b"] / 100),
					Math.round(filter_m["g"][0] * rgb["r"] / 100) + Math.round(filter_m["g"][1] * rgb["g"] / 100) + Math.round(filter_m["g"][2] * rgb["b"] / 100),
					Math.round(filter_m["b"][0] * rgb["r"] / 100) + Math.round(filter_m["b"][1] * rgb["g"] / 100) + Math.round(filter_m["b"][2] * rgb["b"] / 100)
				)
			}
			return hex
		}
	}
	
	
	/* Returns a value from 0 (black) to 100 (white) where 50 is the perceptual "middle grey". */
	function getBrightness(hex) {
		const rgb = hexToRgb(hex);
		rgb.r /= 255;
		rgb.g /= 255;
		rgb.b /= 255;
		
		function sRGBtoLin(colorChannel) {
			// Send this function a decimal sRGB gamma encoded color value
			// between 0.0 and 1.0, and it returns a linearized value.

			if ( colorChannel <= 0.04045 ) {
				return colorChannel / 12.92;
			} else {
				return Math.pow(((colorChannel + 0.055)/1.055), 2.4);
			}
		}
		
		
		const luminance = (0.2126 * sRGBtoLin(rgb.r) + 0.7152 * sRGBtoLin(rgb.g) + 0.0722 * sRGBtoLin(rgb.b));
			if (luminance <= (216/24389)) {       // The CIE standard states 0.008856 but 216/24389 is the intent for 0.008856451679036
				return luminance * (24389/27);  // The CIE standard states 903.3, but 24389/27 is the intent, making 903.296296296296296
        } else {
            return Math.pow(luminance,(1/3)) * 116 - 16;
        }
	}
	
	
	
	function startup() {
		
		//Array containing HEX-codes of all palette colors
		//This array will be interacting with back-end
		let paletteColorsArray;
		
		//TODO: Doubly linked list containing history of colors
		let paletteColorsHistory;
		
		//Palette - div containing all colors
		const palette = select("#palette-generator-card-result");
		const paletteColors = select("#palette-generator-card-result").children;
		
		const colorBlindnessFilter = new ColorBlindnessFilter();
		const colorBlindnessType = select("#color-blindness-type");
		
		const brightnessButton = select("#palette-generator-brightness-button");
		const contrastButton = select("#palette-generator-contrast-button");
		const generateButton = select("#palette-generator-generate-button");
		const exportButton = select("#palette-generator-export-button");
		
		// let setColorNameTimeout;
		
		
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
		
		// Script for getting color names by hex
		function setColorName(hex, colorP) {
			// clearTimeout(setColorNameTimeout);
			// setColorNameTimeout = setTimeout( function() {
				// $.ajax({
					// url: "get_color_name/",
					// type: "POST",
					// dataType: "json",
					// data: {"hex": hex},
					// success: function (data) {
						// colorP.textContent = data.color_name;
					// }
				// });
			// }, 100);
			$.ajax({
				url: "get_color_name/",
				type: "POST",
				dataType: "json",
				data: {"hex": hex},
				success: function (data) {
					colorP.textContent = data.color_name;
				}
			});
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
			const colorP = paletteColor.querySelector("p");
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
				if(colorBlindnessType.value == "normal") {
					paletteColor.style.backgroundColor = colorH3Input.value;
					colorH3.textContent = colorH3Input.value;
					setColorName(colorH3Input.value, colorP);
				} else {
					colorP.textContent = colorH3Input.value;
				}
				
				
				applyColorBlindness();
				applyBrightness();
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
				let middleColor;
				if(colorBlindnessType.value == "normal") {
					const firstColor = hexToRgb(colorH3.textContent);
					const secondColor = hexToRgb(paletteColor.nextElementSibling.querySelector("h3").textContent);
					const r = Math.round((firstColor.r + secondColor.r)/2);
					const g = Math.round((firstColor.g + secondColor.g)/2);
					const b = Math.round((firstColor.b + secondColor.b)/2);
					middleColor = rgbToHex(r, g, b);
					setColorName(middleColor, newColor.querySelector("p"));
				}else {
					let firstColor = colorP.textContent;
					let secondColor = paletteColor.nextElementSibling.querySelector("p").textContent;
					firstColor = hexToRgb(firstColor);
					secondColor = hexToRgb(secondColor);
					const r = Math.round((firstColor.r + secondColor.r)/2);
					const g = Math.round((firstColor.g + secondColor.g)/2);
					const b = Math.round((firstColor.b + secondColor.b)/2);
					middleColor = rgbToHex(r, g, b);
				}
				
				newColor.querySelector("h3").textContent = middleColor;
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
				applyColorBlindness();
				applyBrightness();
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
				const hexLine = hexColor;
				document.querySelector("#palette-generator-color-info-modal-color").style.backgroundColor = hexColor;
				document.querySelector("#palette-generator-color-info-modal-color p").style.color = getComputedStyle(colorH3).color;
				document.querySelector("#palette-generator-color-info-modal-color p").textContent = paletteColor.querySelector("p").textContent;
				const rgbColor = hexToRgb(hexColor);
				const rgbLine = "rgb(" + rgbColor.r + ", " + rgbColor.g + ", " + rgbColor.b + ");";
				const hsvColor = rgbToHsv(rgbColor.r, rgbColor.g, rgbColor.b);
				const hsvLine = "hsv(" + (hsvColor.h*100).toFixed(0) + "%, " + (hsvColor.s*100).toFixed(0) + "%, " + (hsvColor.v*100).toFixed(0) + "%);";
				const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);
				const hslLine = "hsl(" + (hslColor.h*100).toFixed(0) + "%, " + (hslColor.s*100).toFixed(0) + "%, " + (hslColor.l*100).toFixed(0) + "%);";
				
				
				const preCodeHex = document.querySelector("#palette-generator-color-info-modal-list-hex code");
				preCodeHex.innerHTML = hexLine;
				hljs.highlightElement(preCodeHex);
				
				const preCodeRgb = document.querySelector("#palette-generator-color-info-modal-list-rgb code");
				preCodeRgb.innerHTML = rgbLine;
				hljs.highlightElement(preCodeRgb);
				
				const preCodeHsv = document.querySelector("#palette-generator-color-info-modal-list-hsv code");
				preCodeHsv.innerHTML = hsvLine;
				hljs.highlightElement(preCodeHsv);
				
				const preCodeHsl = document.querySelector("#palette-generator-color-info-modal-list-hsl code");
				preCodeHsl.innerHTML = hslLine;
				hljs.highlightElement(preCodeHsl);
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
		
		//Prevents scrolling when spacebar is pressed
		document.addEventListener("keydown", (e) => {
			if(e.code == "Space" || e.keyCode == 32) {
				e.preventDefault();
			}
		});
		
		document.addEventListener("keyup", (e) => {
			if(e.code == "Space" || e.keyCode == 32) {
				e.preventDefault();
				//TODO
				document.getElementById("palette-generator-generate-button").click();
			}
		});
		
		
		function applyColorBlindness() {
			for(let i = 0; i < paletteColors.length; i++) {
				if(colorBlindnessType.value == "normal" && paletteColors[i].querySelector("p").textContent.startsWith("#")) {
					//Restoring old color
					const newColor = paletteColors[i].querySelector("p").textContent;
					paletteColors[i].style.backgroundColor = newColor;
					paletteColors[i].querySelector("h3").textContent = newColor;
					setColorName(newColor, paletteColors[i].querySelector("p"));
				}else if (colorBlindnessType.value != "normal") {
					if(paletteColors[i].querySelector("p").textContent.startsWith("#")) {
						const oldColor = paletteColors[i].querySelector("p").textContent;
						const newColor = colorBlindnessFilter.filter(colorBlindnessType.value, oldColor);
						paletteColors[i].style.backgroundColor = newColor;
						paletteColors[i].querySelector("h3").textContent = newColor;
					}else {
						const oldColor = paletteColors[i].querySelector("h3").textContent;
						const newColor = colorBlindnessFilter.filter(colorBlindnessType.value, oldColor);
						paletteColors[i].querySelector("p").textContent = oldColor;
						paletteColors[i].style.backgroundColor = newColor;
						paletteColors[i].querySelector("h3").textContent = newColor;
					}
				}
			}
			
			if(brightnessButton.style.backgroundColor)
				applyBrightness();
		}
		
		colorBlindnessType.addEventListener("change", applyColorBlindness);
		
		
		function applyBrightness() {
			if(!brightnessButton.style.backgroundColor) {
				for(let i = 0; i < paletteColors.length; i++) {
					paletteColors[i].style.backgroundColor = paletteColors[i].querySelector("h3").textContent;
				}
			}else {
				for(let i = 0; i < paletteColors.length; i++) {
					const brightness = parseInt(getBrightness(paletteColors[i].querySelector("h3").textContent));
					paletteColors[i].style.backgroundColor = rgbToHex(brightness, brightness, brightness);
				}
			}
		}	
		
		
		
		// Creating tooltips for all copy-to-clipboard buttons
		select("button[data-bs-title='Copy to clipboard']", true).forEach(btn => {
			// Creating tooltip for copy-to-clipboard button
			const tooltip = new bootstrap.Tooltip(btn, {
				animation: false,
				trigger: "hover",
				title: "Copy to clipboard"
			});
			
			// Copy text to clipboard library
			const clipboard = new ClipboardJS(btn);
			clipboard.on("success", function(e) {
				const btn = select("button[data-bs-title='Copy to clipboard']");
				tooltip.hide();
				tooltip._config.title = "Copied!";
				tooltip.show();
				tooltip._config.title = "Copy to clipboard";
			});
		});
		
		brightnessButton.addEventListener("click", e => {
			if(!brightnessButton.style.backgroundColor) {
				brightnessButton.style.backgroundColor = "var(--primary)";
			}
			else {
				brightnessButton.style.removeProperty("background-color");
			}
			applyBrightness();
			checkBrightness();
		});
		
		
		
		contrastButton.addEventListener("click", function () {
			const modal = document.getElementById("palette-generator-contrast-modal").getElementsByClassName("modal-body")[0];
			modal.innerHTML = "";
			for(let i = 0; i < paletteColors.length; i++) {
				const divContainer = document.createElement("div");
				divContainer.classList.add("palette-generator-contrast-modal-row");
				for(let j = 0; j < paletteColors.length; j++) {
					const div = document.createElement("div");
					div.innerHTML = "Text";
					div.style.backgroundColor = paletteColors[i].style.backgroundColor;
					div.style.color = paletteColors[j].style.backgroundColor;
					divContainer.appendChild(div);
				}
				modal.appendChild(divContainer);
			}
		});
		
		document.getElementById("palette-generator-contrast-modal").addEventListener("shown.bs.modal", e => {
			const divContainers = document.querySelectorAll("#palette-generator-contrast-modal .palette-generator-contrast-modal-row");
			const width = getComputedStyle(divContainers[0].children[0]).width;
			for(let i = 0; i < divContainers.length; i++)
				divContainers[i].style.height = width;
		});
		
		
		for(let i = 0; i < paletteColors.length; i++) {
			addAllListeners(paletteColors[i]);
		}
			
		
		hideLastPaletteColorAdd();
		checkBrightness();
	}

	window.addEventListener("load", startup, false);
	
})();