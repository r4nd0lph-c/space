(function () {
    "use strict"

    /* Bootstrap Popper library */
    /* Tooltips */
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })


    //Generates random hex-color
    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    //String validation that user actually inputted valid HEX color
    const hexReg = /^#[0-9A-F]{6}$/i;

    function startup() {
        
        //Main part
        const colorInputs = select(".color-input", true);
        const firstColorToolTip = new bootstrap.Tooltip(colorInputs[0], {
                    trigger: "manual"
        });
        const secondColorToolTip = new bootstrap.Tooltip(colorInputs[1], {
                    trigger: "manual"
        });
        const firstColor = select(".color-input-first-color");
        const secondColor = select(".color-input-second-color");
        const firstColorText = select(".color-input-first-color-text");
        const secondColorText = select(".color-input-second-color-text");
        let isFirstColorValid = true;
        let isSecondColorValid = true;
        let isFirstColorToolTipShown = false;
        let isSecondColorToolTipShown = false;
        let gradientType = select("input[name='gradient-type']:checked").value;
        const gradientTypeRadioButtons = select("#gradient-gen-card input[type='radio']", true);
        const gradientDirection = select("#gradient-direction");
        const result = select("#gradient-gen-card-result");
        const randomButton = select("#gradient-gen-random-button");
        const exportButton = select("#gradient-gen-export-button");
        const swapColorsButton = select(".color-input-swap-button");
        
        //Validate user's input
        //Valid input is a string that has 6 characters in HEX-code (from 0 to F), with optional "#" symbol at the beginning
        function isValid(colorText) {
            let string = colorText.value;
            //Check on optional "#" symbol
            if(string.charAt(0) != "#")
                string = "#" + string;
            
            if(hexReg.test(string))
                colorText.value = string;
            
            return hexReg.test(string);
        }
        
        //Text field highlight and tooltip
        function showErrorForFirstColor() {
            colorInputs[0].style.border = "1px solid #f00";
            if(!isFirstColorToolTipShown) {
                firstColorToolTip.show();
                isFirstColorToolTipShown = true;
            }
        }
        
        function hideErrorForFirstColor() {
            colorInputs[0].style.border = "1px solid var(--secondary)";
            if(isFirstColorToolTipShown) {
                firstColorToolTip.hide();
                isFirstColorToolTipShown = false;
            }
        }
        
        function showErrorForSecondColor() {
            colorInputs[1].style.border = "1px solid #f00";
            if(!isSecondColorToolTipShown) {
                secondColorToolTip.show();
                isSecondColorToolTipShown = true;
            }
        }
        
        function hideErrorForSecondColor() {
            colorInputs[1].style.border = "1px solid var(--secondary)";
            if(isSecondColorToolTipShown) {
                secondColorToolTip.hide();
                isSecondColorToolTipShown = false;
            }
        }
        
        
        //Update the background of the result div
        function update() {
            if(!(isFirstColorValid & isSecondColorValid))
                return;
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
            isFirstColorValid = true;
            hideErrorForFirstColor();
			colorInputs[0].style.border = "1px solid var(--primary)";
            firstColorText.value = firstColor.value;
            update();
        }, false);
        
        firstColorText.addEventListener("change", (event) => {
            //Validate user input
            isFirstColorValid = isValid(firstColorText);
            if(isFirstColorValid){
                hideErrorForFirstColor();
                colorInputs[0].style.border = "1px solid var(--primary)";
                firstColor.value = firstColorText.value;
                update();
            }else{
                showErrorForFirstColor();
            }
        }, false);
        
        secondColor.addEventListener("input", (event) => {
            isSecondColorValid = true;
            hideErrorForSecondColor();
			colorInputs[1].style.border = "1px solid var(--primary)";
            secondColorText.value = secondColor.value;
            update();
        }, false);
        
        secondColorText.addEventListener("change", (event) => {
            isSecondColorValid = isValid(secondColorText);
            if(isSecondColorValid){
                hideErrorForSecondColor();
                colorInputs[1].style.border = "1px solid var(--primary)";
                secondColor.value = secondColorText.value;
                update();
            }else{
                showErrorForSecondColor();
            }
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
            if(!(isFirstColorValid && isSecondColorValid))
                return;
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
            isFirstColorValid = true;
            isSecondColorValid = true;
            hideErrorForFirstColor();
            hideErrorForSecondColor();
        }
        
        
//Animation when user focuses on color-input text fields
        const showAnimation1 = function () {
            if(isFirstColorValid){
                hideErrorForFirstColor();
                colorInputs[0].style.border = "1px solid var(--primary)";
            }
            else {
                showErrorForFirstColor();
            }
        };
        
        const hideAnimation1 = function () {
            if(isFirstColorValid){
                hideErrorForFirstColor();
            }
            else {
                showErrorForFirstColor();
            }
        };
        
        firstColorText.addEventListener("focus", showAnimation1, false);
        firstColorText.addEventListener("focusout", hideAnimation1, false);
        firstColor.addEventListener("focus", showAnimation1, false);
        firstColor.addEventListener("focusout", hideAnimation1, false);
        
        const showAnimation2 = function () {
            if(isSecondColorValid){
                hideErrorForSecondColor();
                colorInputs[1].style.border = "1px solid var(--primary)";
            }
            else {
                showErrorForSecondColor();
            }
        };
        
        const hideAnimation2 = function () {
            if(isSecondColorValid){
                hideErrorForSecondColor();
            }
            else {
                showErrorForSecondColor();
            }
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

})();