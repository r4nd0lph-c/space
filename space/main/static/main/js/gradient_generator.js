(function () {
    "use strict"
	


    //Generates random hex-color
    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');


    function startup() {
        /* Main part */
		
        const firstColor = select(".color-input-first-color");
        const secondColor = select(".color-input-second-color");
        const firstColorText = select(".color-input-first-color-text");
        const secondColorText = select(".color-input-second-color-text");
        let gradientType = select("input[name='gradient-type']:checked").value;
        const gradientTypeRadioButtons = select("#gradient-gen-card input[type='radio']", true);
        const gradientDirection = select("#gradient-direction");
		const gradientPosition = select("#gradient-position");
        const result = select("#gradient-gen-card-result");
        const randomButton = select("#gradient-gen-random-button");
        // const exportButton = select("#gradient-gen-export-button");
        const swapColorsButton = select(".color-input-swap-button");
        
        
        
        //Update the background of the result div
        function update() {
			//If input is not valid - no update
            if(!(isValid(firstColorText) & isValid(secondColorText)))
                return;
            let sentence = "";
            switch(gradientType) {
                case 'linear':
                    sentence = "linear-gradient(" + gradientDirection.getElementsByTagName("select")[0].value + "deg, ";
                break;
                
                case 'radial':
                    sentence += "radial-gradient(" + gradientPosition.getElementsByTagName("select")[0].value + ", ";
                break;
            }
            
            sentence += firstColorText.value + "," + secondColorText.value + ")";
            result.style.background = sentence;
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
		
		
        gradientDirection.addEventListener("change", (event) => {
            update();
        }, false);
		
		gradientPosition.addEventListener("change", (event) => {
            update();
        }, false);
        
        for(let i = 0; i < gradientTypeRadioButtons.length; i++) {
            gradientTypeRadioButtons[i].addEventListener("click", (event) => {
                gradientType = gradientTypeRadioButtons[i].value;
                switch(gradientType) {
                    case "linear":
                        gradientDirection.hidden = false;
                        gradientPosition.hidden = true;
                    break;
                    
                    case "radial":
                        gradientDirection.hidden = true;
                        gradientPosition.hidden = false;
                    break;
                }
                update();
            }, false);
        }
        
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
		
		randomButton.addEventListener("click", (event) => {
			hideTooltipForColorInput(0);
			hideTooltipForColorInput(1);
			colorInputs[0].style.border = "1px solid var(--secondary)";
			colorInputs[1].style.border = "1px solid var(--secondary)";
            generateRandomColors();
            update();
        }, false);
        
        
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
		
		
		/* Handling export modals */
		
		/* Creating tooltip for copy-to-clipboard button */
		const tooltip = new bootstrap.Tooltip("button[data-bs-title='Copy to clipboard']", {
			animation: false,
			trigger: "hover",
			title: "Copy to clipboard"
		});
		
		//Copy text to clipboard library
		const clipboard = new ClipboardJS('button');
		clipboard.on("success", function(e) {
			const btn = select("button[data-bs-title='Copy to clipboard']");
			tooltip.hide();
			tooltip._config.title = "Copied!";
			tooltip.show();
			tooltip._config.title = "Copy to clipboard";
		});
		
		/* Auto select on click */
		select("#export-css-input").addEventListener("click", (event) => {
			select("#export-css-input").select();
		}, false);
		
		
		//CSS
		document.querySelector('#gradient-export-css-modal').addEventListener('show.bs.modal', (event) => {
			document.querySelector("#gradient-export-css-modal input[type=text]").value = "background: " + document.querySelector("#gradient-gen-card-result").style.background + ";";
		});
		
		
		//Image
		document.querySelector('#gradient-export-image-modal').addEventListener('show.bs.modal', (event) => {
			const imgWidth = select("#gradient-export-image-modal-width");
			const imgHeight = select("#gradient-export-image-modal-height");
			const imgDownloadButton = select("#gradient-export-image-modal-download-button");
			const imgFileFormat = select("#gradient-export-image-modal-file-format");
			
			
			// Validates user's input (keeps values within min-max range)
			function validateInput() {
				// Check if user's input stays within min-max values
				if(parseInt(this.value) < parseInt(this.min))
					this.value = this.min;
				if(parseInt(this.value) > parseInt(this.max))
					this.value = this.max;
			}
			
			imgWidth.validateInput = validateInput;
			imgHeight.validateInput = validateInput;
			
			// Adding validation to the inputs
			[imgWidth, imgHeight].forEach(e => {
				e.addEventListener("focusout", (evt) => {
					e.validateInput();
				}, false);
				
				e.addEventListener("change", (evt) => {
					e.validateInput();
				}, false);
			});
			
			// Creating and downloading canvas as image
			imgDownloadButton.addEventListener("click", (e) => {
				//Create canvas
				const imgCanvas = document.createElement("canvas");
				imgCanvas.width = imgWidth.value;
				imgCanvas.height = imgHeight.value;
				const imgCanvasCtx = imgCanvas.getContext("2d");
				
				// Create gradient
				let imgGradient;
				switch(gradientType) {
					case "linear":
						switch(gradientDirection.getElementsByTagName("select")[0].value) {
							case "180":
								imgGradient = imgCanvasCtx.createLinearGradient(imgCanvas.width/2, 0, imgCanvas.width/2, imgCanvas.height);
							break;
							case "225":
								imgGradient = imgCanvasCtx.createLinearGradient(imgCanvas.width, 0, 0, imgCanvas.height);
							break;
							case "270":
								imgGradient = imgCanvasCtx.createLinearGradient(imgCanvas.width, imgCanvas.height/2, 0, imgCanvas.height/2);
							break;
							case "315":
								imgGradient = imgCanvasCtx.createLinearGradient(imgCanvas.width, imgCanvas.height, 0, 0);
							break;
							case "0":
								imgGradient = imgCanvasCtx.createLinearGradient(imgCanvas.width/2, imgCanvas.height, imgCanvas.width/2, 0);
							break;
							case "45":
								imgGradient = imgCanvasCtx.createLinearGradient(0, imgCanvas.height, imgCanvas.width, 0);
							break;
							case "90":
								imgGradient = imgCanvasCtx.createLinearGradient(0, imgCanvas.height/2, imgCanvas.width, imgCanvas.height/2);
							break;
							case "135":
								imgGradient = imgCanvasCtx.createLinearGradient(0, 0, imgCanvas.width, imgCanvas.height);
							break;
						}
					break;
					case "radial":
						switch(gradientPosition.getElementsByTagName("select")[0].value) {
							case "circle at center":
								imgGradient = imgCanvasCtx.createRadialGradient(imgCanvas.width/2, imgCanvas.height/2, 0, imgCanvas.width/2, imgCanvas.height/2, Math.sqrt(Math.pow(imgCanvas.width/2, 2) + Math.pow(imgCanvas.height/2, 2)));
							break;
							case "circle at top":
								imgGradient = imgCanvasCtx.createRadialGradient(imgCanvas.width/2, 0, 0, imgCanvas.width/2, 0, Math.sqrt(Math.pow(imgCanvas.width/2, 2) + Math.pow(imgCanvas.height, 2)));
							break;
							case "circle at right top":
								imgGradient = imgCanvasCtx.createRadialGradient(imgCanvas.width, 0, 0, imgCanvas.width, 0, Math.sqrt(Math.pow(imgCanvas.width, 2) + Math.pow(imgCanvas.height, 2)));
							break;
							case "circle at right":
								imgGradient = imgCanvasCtx.createRadialGradient(imgCanvas.width, imgCanvas.height/2, 0, imgCanvas.width, imgCanvas.height/2, Math.sqrt(Math.pow(imgCanvas.width, 2) + Math.pow(imgCanvas.height/2, 2)));
							break;
							case "circle at right bottom":
								imgGradient = imgCanvasCtx.createRadialGradient(imgCanvas.width, imgCanvas.height, 0, imgCanvas.width, imgCanvas.height, Math.sqrt(Math.pow(imgCanvas.width, 2) + Math.pow(imgCanvas.height, 2)));
							break;
							case "circle at bottom":
								imgGradient = imgCanvasCtx.createRadialGradient(imgCanvas.width/2, imgCanvas.height, 0, imgCanvas.width/2, imgCanvas.height, Math.sqrt(Math.pow(imgCanvas.width/2, 2) + Math.pow(imgCanvas.height, 2)));
							break;
							case "circle at left bottom":
								imgGradient = imgCanvasCtx.createRadialGradient(0, imgCanvas.height, 0, 0, imgCanvas.height, Math.sqrt(Math.pow(imgCanvas.width, 2) + Math.pow(imgCanvas.height, 2)));
							break;
							case "circle at left":
								imgGradient = imgCanvasCtx.createRadialGradient(0, imgCanvas.height/2, 0, 0, imgCanvas.height/2, Math.sqrt(Math.pow(imgCanvas.width, 2) + Math.pow(imgCanvas.height/2, 2)));
							break;
							case "circle at left top":
								imgGradient = imgCanvasCtx.createRadialGradient(0, 0, 0, 0, 0, Math.sqrt(Math.pow(imgCanvas.width, 2) + Math.pow(imgCanvas.height, 2)));
							break;
						}
					break;
				}
				
				imgGradient.addColorStop(0, firstColor.value);
				imgGradient.addColorStop(1, secondColor.value);


				// Fill with gradient
				imgCanvasCtx.fillStyle = imgGradient;
				imgCanvasCtx.fillRect(0, 0, imgCanvas.width, imgCanvas.height);
				
				// Choosing file format
				let resultImage;
				switch(imgFileFormat.value) {
					case "png":
						imgDownloadButton.setAttribute("download", "gradient.png");
						resultImage = imgCanvas.toDataURL('image/png');
					break;
					case "jpeg":
						imgDownloadButton.setAttribute("download", "gradient.jpeg");
						resultImage = imgCanvas.toDataURL('image/jpeg');
					break;
				}
				
				imgDownloadButton.href = resultImage;
			}, false);
		});
        
		
		
        //After all preparations, executing next code:
        
        generateRandomColors();
        update();
    }


    window.addEventListener("load", startup, false);

})();