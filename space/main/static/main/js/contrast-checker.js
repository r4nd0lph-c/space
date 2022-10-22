"use strict"

    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }

    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all)
        if (selectEl) {
            if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener))
            } else {
                selectEl.addEventListener(type, listener)
            }
        }
    }

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
        result.style.color = firstColor.value;
        result.style.backgroundColor = secondColor.value;
        calculateContrastRatio();
    }
    
    
    //Calculates contrast ratio
    function calculateContrastRatio(){
        let rgb1 = hexToRgb(firstColor.value);
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
        
        
        
        let rgb2 = hexToRgb(secondColor.value);
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
        contrastCheckerRatio.innerHTML = contrastRatio.toFixed(2);
        updateRules(contrastRatio);
    }
    

    //Updates rules in the html page
    function updateRules(contrastRatio) {
        let img1 = contrastCheckerRules[0].getElementsByTagName("img")[0];
        let img2 = contrastCheckerRules[1].getElementsByTagName("img")[0];
        let img3 = contrastCheckerRules[2].getElementsByTagName("img")[0];
        
        //for 17pt and below
        if(contrastRatio >= 4.5)
            img1.src = "../static/main/graphics/contrast_checker/check-circle.png";
        else
            img1.src = "../static/main/graphics/contrast_checker/x-circle.png";
        
        //for 18pt and above / 14pt bold and above
        if(contrastRatio >= 3.0)
            img2.src = "../static/main/graphics/contrast_checker/check-circle.png";
        else
            img2.src = "../static/main/graphics/contrast_checker/x-circle.png";
        
        //for icons and actionable graphics
        if(contrastRatio >= 3.0)
            img3.src = "../static/main/graphics/contrast_checker/check-circle.png";
        else
            img3.src = "../static/main/graphics/contrast_checker/x-circle.png";
    }
    
    
    //Setting up listeners
    firstColor.addEventListener("input", (event) => {
        firstColorText.value = firstColor.value;
        update();
    }, false);
    
    firstColorText.addEventListener("change", (event) => {
        firstColor.value = firstColorText.value;
        update();
    }, false);
    
    secondColor.addEventListener("input", (event) => {
        secondColorText.value = secondColor.value;
        update();
    }, false);
    
    secondColorText.addEventListener("change", (event) => {
        secondColor.value = secondColorText.value;
        update();
    }, false);
    
    
    swapColorsButton.addEventListener("click", (event) => {
        const temp = firstColor.value;
        firstColor.value = secondColor.value;
        firstColorText.value = secondColor.value;
        secondColor.value = temp;
        secondColorText.value = temp;
        update();
    }, false);
    
    
    
    
    //Generating random colors
    function generateRandomColors() {
        let randomColor = "#" + genRanHex(6);
        firstColor.value = randomColor;
        firstColorText.value = randomColor;
        randomColor = "#" + genRanHex(6);
        secondColor.value = randomColor;
        secondColorText.value = randomColor;
    }
    
    
    //Animation when user focuses on color-input text fields
    const color_inputs = select(".color-input", true);
    const showAnimation1 = function () {
        color_inputs[0].style.border = "1px solid var(--primary)";
    };
    
    const hideAnimation1 = function () {
        color_inputs[0].style.border = "1px solid var(--secondary)";
    };
    
    firstColorText.addEventListener("focus", showAnimation1, false);
    firstColorText.addEventListener("focusout", hideAnimation1, false);
    firstColor.addEventListener("focus", showAnimation1, false);
    firstColor.addEventListener("focusout", hideAnimation1, false);
    
    const showAnimation2 = function () {
        color_inputs[1].style.border = "1px solid var(--primary)";
    };
    
    const hideAnimation2 = function () {
        color_inputs[1].style.border = "1px solid var(--secondary)";
    };
    
    secondColorText.addEventListener("focus", showAnimation2, false);
    secondColorText.addEventListener("focusout", hideAnimation2, false);
    secondColor.addEventListener("focus", showAnimation2, false);
    secondColor.addEventListener("focusout", hideAnimation2, false);
    
    
    //After all preparations, executing next code:
    
    generateRandomColors();
    update();
}


window.addEventListener("load", startup, false);
