(function () {
    "use strict"

    //String validation that user actually inputted valid HEX color
    const hexReg = /^#[0-9A-F]{6}$/i;
	
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
		setUpInfoCirclePopover();
        
        //Main part
        const firstColor = select(".color-input-first-color");
        const secondColor = select(".color-input-second-color");
        const firstColorText = select(".color-input-first-color-text");
        const secondColorText = select(".color-input-second-color-text");
        const result = select("#contrast-checker-card-result");
        const contrastCheckerRatio = select("#contrast-checker-ratio");
        const contrastCheckerRules = select("#contrast-checker-rules").children;
        const swapColorsButton = select(".color-input-swap-button");
        

        //Update the background of the result div
        function update() {
			//If input is not valid - no update
            if(!(isValid(firstColorText) & isValid(secondColorText)))
                return;
            result.getElementsByTagName("svg")[0].style.fill = firstColor.value;
            result.style.color = firstColor.value;
            result.style.backgroundColor = secondColor.value;
            const contrastRatio = calculateContrastRatio(firstColor.value, secondColor.value);
			contrastCheckerRatio.innerHTML = contrastRatio.toFixed(2);
            updateRules(contrastRatio);
        }
        
        
        //Calculates contrast ratio
        function calculateContrastRatio(firstColorHex, secondColorHex){
            let rgb1 = hexToRgb(firstColorHex);
            let rgb1_rs = rgb1.r/255.0;
            let rgb1_gs = rgb1.g/255.0;
            let rgb1_bs = rgb1.b/255.0;
            let rgb1_r, rgb1_g, rgb1_b;
            if(rgb1_rs <= 0.03928)
                rgb1_r = rgb1_rs/12.92;
            else
                rgb1_r = Math.pow((rgb1_rs+0.055)/1.055, 2.4);
            if(rgb1_gs <= 0.03928)
                rgb1_g = rgb1_gs/12.92;
            else
                rgb1_g = Math.pow((rgb1_gs+0.055)/1.055, 2.4);
            if(rgb1_bs <= 0.03928)
                rgb1_b = rgb1_bs/12.92;
            else
                rgb1_b = Math.pow((rgb1_bs+0.055)/1.055, 2.4);
            
            let textLuminance = 0.2126 * rgb1_r + 0.7152 * rgb1_g + 0.0722 * rgb1_b;
            
            
            let rgb2 = hexToRgb(secondColorHex);
            let rgb2_rs = rgb2.r/255.0;
            let rgb2_gs = rgb2.g/255.0;
            let rgb2_bs = rgb2.b/255.0;
            let rgb2_r, rgb2_g, rgb2_b;
            if(rgb2_rs <= 0.03928)
                rgb2_r = rgb2_rs/12.92;
            else
                rgb2_r = Math.pow((rgb2_rs+0.055)/1.055, 2.4);
            if(rgb2_gs <= 0.03928)
                rgb2_g = rgb2_gs/12.92;
            else
                rgb2_g = Math.pow((rgb2_gs+0.055)/1.055, 2.4);
            if(rgb2_bs <= 0.03928)
                rgb2_b = rgb2_bs/12.92;
            else
                rgb2_b = Math.pow((rgb2_bs+0.055)/1.055, 2.4);
            
            let backgroundLuminance = 0.2126 * rgb2_r + 0.7152 * rgb2_g + 0.0722 * rgb2_b;
            
            
            let contrastRatio = ((textLuminance + 0.05) / (backgroundLuminance + 0.05));
            if(contrastRatio < 1)
                contrastRatio = 1/contrastRatio;
			
			return contrastRatio;
        }
        

        //Updates rules in the html page
        function updateRules(contrastRatio) {
            let icon1 = contrastCheckerRules[0].getElementsByTagName("i")[0];
            let icon2 = contrastCheckerRules[1].getElementsByTagName("i")[0];
            let icon3 = contrastCheckerRules[2].getElementsByTagName("i")[0];
            
            //for 17pt and below
            if(contrastRatio >= 4.5) {
                icon1.classList.remove("bi-x-circle");
				icon1.classList.add("bi-check-circle");
				icon1.style.color = ("var(--success)");
			}
            else {
				icon1.classList.add("bi-x-circle");
                icon1.classList.remove("bi-check-circle");
				icon1.style.color = ("var(--danger)");
			}
            
            //for 18pt and above / 14pt bold and above
            if(contrastRatio >= 3.0) {
				icon2.classList.remove("bi-x-circle");
				icon2.classList.add("bi-check-circle");
				icon2.style.color = ("var(--success)");
			}
            else {
				icon2.classList.add("bi-x-circle");
                icon2.classList.remove("bi-check-circle");
				icon2.style.color = ("var(--danger)");
			}
            
            //for icons and actionable graphics
            if(contrastRatio >= 3.0) {
				icon3.classList.remove("bi-x-circle");
				icon3.classList.add("bi-check-circle");
				icon3.style.color = ("var(--success)");
			}
            else {
				icon3.classList.add("bi-x-circle");
                icon3.classList.remove("bi-check-circle");
				icon3.style.color = ("var(--danger)");
			}
        }
		
		
		/* Setting up listeners */
		
        firstColor.addEventListener("input", (event) => {
            hideTooltipForColorInput(0);
            firstColorText.value = firstColor.value;
            update();
        }, false);
        
        firstColorText.addEventListener("change", (event) => {
            //Validate user's input
            if(isValid(firstColorText)){
                hideTooltipForColorInput(0);
                firstColor.value = firstColorText.value;
                update();
            }else{
                showTooltipForColorInput(0);
            }
        }, false);
		
		secondColor.addEventListener("input", (event) => {
            hideTooltipForColorInput(1);
            secondColorText.value = secondColor.value;
            update();
        }, false);
        
        secondColorText.addEventListener("change", (event) => {
            //Validate user's input
            if(isValid(secondColorText)){
                hideTooltipForColorInput(1);
                secondColor.value = secondColorText.value;
                update();
            }else{
                showTooltipForColorInput(1);
            }
        }, false);
		
		
		swapColorsButton.addEventListener("click", (event) => {
			//Validate user's input
            if(!(isValid(firstColorText) && isValid(secondColorText)))
                return;
            const temp = firstColor.value;
            firstColor.value = secondColor.value;
            firstColorText.value = secondColor.value;
            secondColor.value = temp;
            secondColorText.value = temp;
            update();
        }, false);
		
		
        //Generates random colors
        function generateRandomColors() {
            let randomColor = "#" + genRanHex(6);
            firstColor.value = randomColor;
            firstColorText.value = randomColor;
            randomColor = "#" + genRanHex(6);
            secondColor.value = randomColor;
            secondColorText.value = randomColor;
        }
		
        
		/* Animation when user focuses on color-input text fields or when invalid value is input*/
        const showAnimationForColorInput = function () {
			const index = this === firstColorText || this === firstColor ? 0 : 1;
			const colorText = index == 0 ? firstColorText : secondColorText;
			//If input valid - show focus input animation
			if(isValid(colorText)) {
				colorInputs[index].style.border = "1px solid var(--primary)";
			}
			//If input is NOT valid - show invalid input animation
			else{
				colorInputs[index].style.border = "1px solid #f00";
			}
        };
        
        const hideAnimationForColorInput = function () {
			const index = this === firstColorText || this === firstColor ? 0 : 1;
			const colorText = index == 0 ? firstColorText : secondColorText;
			//If input valid - hide focus input animation
			if(isValid(colorText)) {
				colorInputs[index].style.border = "1px solid var(--secondary)";
			}
			//If input is NOT valid - keep showing invalid input animation
			else{
				colorInputs[index].style.border = "1px solid #f00";
			}
		};
        
        firstColorText.addEventListener("focus", showAnimationForColorInput, false);
		firstColorText.addEventListener("change", showAnimationForColorInput, false);
        firstColorText.addEventListener("focusout", hideAnimationForColorInput, false);
		firstColor.addEventListener("focus", showAnimationForColorInput, false);
		firstColor.addEventListener("input", showAnimationForColorInput, false);
        firstColor.addEventListener("focusout", hideAnimationForColorInput, false);
		
		secondColorText.addEventListener("focus", showAnimationForColorInput, false);
		secondColorText.addEventListener("change", showAnimationForColorInput, false);
        secondColorText.addEventListener("focusout", hideAnimationForColorInput, false);
		secondColor.addEventListener("focus", showAnimationForColorInput, false);
		secondColor.addEventListener("input", showAnimationForColorInput, false);
        secondColor.addEventListener("focusout", hideAnimationForColorInput, false);
		
        
        //After all preparations, executing next code:
        
        generateRandomColors();
        update();
    }


    window.addEventListener("load", startup, false);
})();