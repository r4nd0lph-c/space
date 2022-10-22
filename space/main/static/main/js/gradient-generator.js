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


function startup() {
    
    //Main part
    const firstColor = select(".color-input-first-color");
    const secondColor = select(".color-input-second-color");
    const firstColorText = select(".color-input-first-color-text");
    const secondColorText = select(".color-input-second-color-text");
    let gradientType = select("input[name='gradient-type']:checked").value;
    const gradientTypeRadioButtons = select("#gradient-gen-card input[type='radio']", true);
    const gradientDirection = select("#gradient-direction");
    const result = select("#gradient-gen-card-result");
    const randomButton = select("#gradient-gen-random-button");
    const exportButton = select("#gradient-gen-export-button");
    const swapColorsButton = select(".color-input-swap-button");
    
    //Update the background of the result div
    function update() {
        let sentence = "";
        switch(gradientType) {
            case 'linear':
                sentence = "linear-gradient(";
                switch(gradientDirection.value) {
                    case '1':
                    sentence += "to bottom, ";
                    break;
                    
                    case '2':
                    sentence += "to top, ";
                    break;
                    
                    case '3':
                    sentence += "to right, ";
                    break;
                    
                    case '4':
                    sentence += "to left, ";
                    break;
                }
            break;
            
            case 'radial':
                sentence += "radial-gradient(";
            break;
        }
        
        sentence += firstColorText.value + "," + secondColorText.value;
        result.style.background = sentence;
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
    
    gradientDirection.addEventListener("change", (event) => {
        update();
    }, false);
    
    randomButton.addEventListener("click", (event) => {
        generateRandomColors();
        update();
    }, false);
    
    for(let i = 0; i < gradientTypeRadioButtons.length; i++) {
        gradientTypeRadioButtons[i].addEventListener("click", (event) => {
            gradientType = gradientTypeRadioButtons[i].value;
            switch(gradientType) {
                case "linear":
                    gradientDirection.disabled = false;
                    gradientDirection.previousElementSibling.style.color = "black";
                break;
                
                case "radial":
                    gradientDirection.disabled = true;
                    gradientDirection.previousElementSibling.style.color = "#CED4DA";
                break;
            }
            update();
        }, false);
    }
    
    
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
