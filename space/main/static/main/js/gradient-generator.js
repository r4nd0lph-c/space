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
    
const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');


function startup() {
    const firstColor = select("#gradient-gen-first-color");
    const secondColor = select("#gradient-gen-second-color");
    const firstColorText = select("#gradient-gen-first-color-text");
    const secondColorText = select("#gradient-gen-second-color-text");
    let gradientType = select("input[name='gradient-type']:checked").value;
    const gradientTypeRadioButtons = select("#gradient-gen-card input[type='radio']", true);
    const gradientDirection = select("#gradient-direction");
    const result = select("#gradient-gen-card-result");
    const randomButton = select("#gradient-gen-random-button");
    const exportButton = select("#gradient-gen-export-button");
    
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
                break;
                
                case "radial":
                    gradientDirection.disabled = true;
                break;
            }
            update();
        }, false);
    }
    
    
    //Generating random colors
    function generateRandomColors() {
        let randomColor = "#" + genRanHex(6);
        firstColor.value = randomColor;
        firstColorText.value = randomColor;
        randomColor = "#" + genRanHex(6);
        secondColor.value = randomColor;
        secondColorText.value = randomColor;
    }
    
    generateRandomColors();
    update();
}




window.addEventListener("load", startup, false);
