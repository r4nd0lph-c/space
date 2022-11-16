(function () {
    "use strict"


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
        const colorRange = select("#color-picker-range");
        const colorList = select("#color-picker-card-colors-list").children;
        var colorCircles = select("#color-picker-card-result-image").getElementsByTagName("div");
        const colorPickerCard = select("#color-picker-card");
        const colorRangeTitle = select("#color-picker-range-title");
        const uploadImageButton = select("#color-picker-upload-button");
        let colorRangeTimeOut;


        /* Adding animation when color circle is clicked */
        for (let i = 0; i < colorCircles.length; i++) {
            colorCircles[i].addEventListener("click", (event) => {
                if (colorList[i].classList.contains("glow-animation"))
                    return;
                colorList[i].classList.add("glow-animation");
                colorList[i].scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
                setTimeout(function () {
                    colorList[i].classList.remove("glow-animation")
                }, 1000 * parseInt(getComputedStyle(select(".glow-animation")).animationDuration));
            }, false);
        }

        /* Adding event listeners for color range*/
        ['change', 'input', 'mousedown'].forEach(function (e) {
            colorRange.addEventListener(e, (event) => {
                clearTimeout(colorRangeTimeOut);
                let i = 0;
                for (i = 0; i < colorRange.value; i++) {
                    colorList[i].hidden = false;
                    colorCircles[i].classList.remove("hidden");
                }

                for (; i < colorRange.max; i++) {
                    colorList[i].hidden = true;
                    colorCircles[i].classList.add("hidden");
                }

                if (!window.matchMedia("(max-width: 768px)").matches)
                    colorPickerCard.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});

                /* Showing color range title */
                colorRangeTitle.innerHTML = colorRange.value;

                function convertRemToPixels(rem) {
                    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
                }

                let thumbWidth = convertRemToPixels(1);
                let rangeMax = colorRange.max;
                let rangeMin = colorRange.min;
                let rangeWidth = colorRange.offsetWidth;
                let pos = (colorRange.value - rangeMin) / (rangeMax - rangeMin);
                let thumbCorrect = thumbWidth * (pos - 0.5) * -1;
                let titlePos = Math.round((pos * rangeWidth) - thumbWidth / 4 + thumbCorrect) - 10;
                colorRangeTitle.style.left = titlePos + "px";
                colorRangeTitle.hidden = false;
                colorRangeTitle.style.backgroundColor = "rgba(13, 15, 16, 0.75)";
                colorRangeTimeOut = setTimeout(function () {
                    let evt = document.createEvent("Event");
                    evt.initEvent("focusout", true, true);
                    colorRange.dispatchEvent(evt);
                }, 500);
            }, false);
        });

        colorRange.addEventListener("focusout", (event) => {
            clearTimeout(colorRangeTimeOut);
            colorRangeTitle.style.backgroundColor = "white";
            colorRangeTimeOut = setTimeout(function () {
                colorRangeTitle.hidden = true
            }, 300);
        }, false);


        /* Changes text color to white if the background is not bright enough */
        function checkBrightness() {
            const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
            for (let colorItem of colorList) {
                const backgroundColor = hexToRgb(rgba2hex(colorItem.style.backgroundColor));

                //Default
                let textColor = "#000000";

                //Checking if background color is bright enough
                if (backgroundColor.r * 0.299 + backgroundColor.g * 0.587 + backgroundColor.b * 0.114 < 128)
                    textColor = "#FFFFFF";

                //Changing color of the text
                for (let child of colorItem.children)
                    child.style.color = textColor;
            }
        }





        // image input button element
        const image_input = document.querySelector("#color-picker-upload-button");

        // checking if new image loaded
        image_input.addEventListener("change", function () {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                const uploaded_image = reader.result;
                // show img
                document.querySelector("#display-image").src = uploaded_image;
                // make blob from dataURI
                let blob_img = dataURItoBlob(uploaded_image);
                // send blob
                send_img(blob_img);
            });
            reader.readAsDataURL(this.files[0]);
        });

        // function to send blob img (ajax -> no reloading)
        function send_img(blob) {
            var fd = new FormData();
            fd.append('img', blob);
            var tet = $.ajax({
                url: 'get_params',
                type: 'POST',
                data: fd,
                async: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    // got params for rendering are saved in data
                    let img_params = data.img_params;
					
					//Pre-calculations for changing the size of color circles depending on the color contribution
					//The change is distributed linearly, starting from the greatest contribution => max size (48px) to smallest contribution => min size (24px)
					//Difference between the greatest and the smallest contribution
					const greatestContr = img_params[0].contribution.slice(0, -1);
					const smallestContr = img_params[img_params.length-1].contribution.slice(0, -1);
					const diffContr = greatestContr - smallestContr;
					//Difference between the max size and min size of a color circle
					const maxSize = getComputedStyle(colorCircles[0]).maxWidth.slice(0, -2);
					const minSize = getComputedStyle(colorCircles[0]).minWidth.slice(0, -2);
					const diffSize = maxSize - minSize;
					//Quotient - amount of pixels per percent
					const quotient = diffSize / diffContr;
					//Figuring out the offset
					const offset = minSize - smallestContr * quotient;
					
					for(let i = 0; i < img_params.length; i++) {
						//Updating the table
						colorList[i].style.backgroundColor = img_params[i].hex;
						colorList[i].getElementsByTagName("h3")[0].innerHTML = img_params[i].hex;
						colorList[i].getElementsByTagName("p")[0].innerHTML = img_params[i].name;
						colorList[i].getElementsByTagName("p")[1].innerHTML = img_params[i].contribution;
						checkBrightness();
						
						//Updating color circles on the image
						
						//Changing color
						colorCircles[i].style.backgroundColor = img_params[i].hex;
						
						//Changing size
						const newColorCircleSize = img_params[i].contribution.slice(0, -1) * quotient + offset;
						colorCircles[i].style.width = newColorCircleSize + "px";
						colorCircles[i].style.height = newColorCircleSize + "px";
						
						//Changing position
						//Subtracting color circle's width divided by 2 in order to shift the pivot point to the center of the circle
						colorCircles[i].style.left = "calc(" + img_params[i].coords[0] * 100 + "% - " + colorCircles[i].style.width + " / 2)";
						colorCircles[i].style.top = "calc(" + img_params[i].coords[1] * 100 + "% - " + colorCircles[i].style.height + " / 2)";
					}
                },
                error: function (error) {
                    console.log(error);
                }
            }).responseText;
        }

        // make blob from image dataURI ('data:image/jpeg;base64,/9j/4AAQS...gD//Z')
        function dataURItoBlob(dataURI) {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            var byteString = atob(dataURI.split(',')[1]);
            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            // create a view into the buffer
            var ia = new Uint8Array(ab);
            // set the bytes of the buffer to the correct values
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            // write the ArrayBuffer to a blob, and you're done
            return new Blob([ab], {type: mimeString});
        }
		
		
		/* Handling export modals */
		
		// Creating tooltips for all copy-to-clipboard buttons
		select("button[data-bs-title='Copied!']", true).forEach(btn => {
			// Creating tooltip for copy-to-clipboard button
			const tooltip = new bootstrap.Tooltip(btn, {
				animation: false,
				trigger: "manual",
				title: "Copied!"
			});
			
			// Copy text to clipboard library
			const clipboard = new ClipboardJS(btn);
			clipboard.on("success", function(e) {
				tooltip.show();
				setTimeout(function() {
					tooltip.hide();
				}, 1000);
			});
		});

		
		//Converts text to css-style
		//Removes all text in parentheses, removes punctuation from a string and replaces accented characters to normal characters (e.g. è to e), sets lowercase and replaces all spaces to '-'
		function stringToCssStyle(str) {
			return str.replace(/\s*\(.*?\)\s*/g, '').replace(/['.,\/#!$%\^&\*;:{}=\_`~()]/g,"").replace(/\s{2,}/g," ").normalize("NFKD").replace(/\p{Diacritic}/gu, "").replace(/ /g, '-').toLowerCase();
		}
		
		//Converts HEX to HSL
		function hexToHSL(H) {
			// Convert hex to RGB first
			let r = 0, g = 0, b = 0;
			if (H.length == 4) {
				r = "0x" + H[1] + H[1];
				g = "0x" + H[2] + H[2];
				b = "0x" + H[3] + H[3];
			} else if (H.length == 7) {
				r = "0x" + H[1] + H[2];
				g = "0x" + H[3] + H[4];
				b = "0x" + H[5] + H[6];
			}
			// Then to HSL
			r /= 255;
			g /= 255;
			b /= 255;
			let cmin = Math.min(r,g,b),
				cmax = Math.max(r,g,b),
				delta = cmax - cmin,
				h = 0,
				s = 0,
				l = 0;

			if (delta == 0)
				h = 0;
			else if (cmax == r)
				h = ((g - b) / delta) % 6;
			else if (cmax == g)
				h = (b - r) / delta + 2;
			else
				h = (r - g) / delta + 4;

			h = Math.round(h * 60);

			if (h < 0)
				h += 360;

			l = (cmax + cmin) / 2;
			s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
			s = +(s * 100).toFixed(1);
			l = +(l * 100).toFixed(1);

			return "hsl(" + h + "," + s + "%," + l + "%)";
		}
		
		//CSS
		document.querySelector('#color-picker-export-css-modal').addEventListener('show.bs.modal', (event) => {
			let cssResult = "";
			
			let cssHexResult = "/* CSS HEX */\r\n";
			let cssHSLResult = "/* CSS HSL */\r\n";
			let scssHEXResult = "/* SCSS HEX */\r\n";
			let scssHSLResult = "/* SCSS HSL */\r\n";
			for(let i = 0; i < colorList.length; i++) {
				let colorName = stringToCssStyle(colorList[i].getElementsByTagName("p")[0].innerHTML);
				let colorHex = colorList[i].getElementsByTagName("h3")[0].innerHTML;
				cssHexResult += "--" + colorName + ": " + colorHex + ";\r\n";
				cssHSLResult += "--" + colorName + ": " + hexToHSL(colorHex) + ";\r\n";
				scssHEXResult += "$" + colorName + ": " + colorHex + ";\r\n";
				scssHSLResult += "$" + colorName + ": " + hexToHSL(colorHex) + ";\r\n";
			}
			
			//Joining everything in one result
			cssResult = [cssHexResult, cssHSLResult, scssHEXResult, scssHSLResult].join("\r\n");
			
			const preCode = select("#color-picker-export-css-modal pre code");
			preCode.innerHTML = cssResult;
			hljs.highlightElement(preCode);
		});
		
		//Setting event listener on the download button
		const exportCssDownloadButton = select("#color-picker-export-css-modal-download-button");
		exportCssDownloadButton.addEventListener("click", e => {
			exportCssDownloadButton.href = "data:text/plain;charset=utf-8, " + encodeURIComponent(select("#color-picker-export-css-modal pre code").innerText);
		});
		
		
		//CSV
		document.querySelector('#color-picker-export-csv-modal').addEventListener('show.bs.modal', (event) => {
			//Headers
			let csvResult = "Hex,Name,Contribution\r\n";
			
			for(let i = 0; i < colorList.length; i++) {
				let colorHex = colorList[i].getElementsByTagName("h3")[0].innerHTML;
				let colorName = '\"' + colorList[i].getElementsByTagName("p")[0].innerHTML + '\"';
				let colorContribution = colorList[i].getElementsByTagName("p")[1].innerHTML;
				
				csvResult += [colorHex, colorName, colorContribution].join(',') + "\r\n";
			}
			
			const preCode = select("#color-picker-export-csv-modal pre code");
			preCode.innerHTML = csvResult;
			hljs.highlightElement(preCode);
		});
		
		//Setting event listener on the download button
		const exportCsvDownloadButton = select("#color-picker-export-csv-modal-download-button");
		exportCsvDownloadButton.addEventListener("click", e => {
			exportCsvDownloadButton.href = "data:text/plain;charset=utf-8, " + encodeURIComponent(select("#color-picker-export-csv-modal pre code").innerText);
		});
		
		//JSON
		document.querySelector('#color-picker-export-json-modal').addEventListener('show.bs.modal', (event) => {
			//Headers
			let jsonResult = "[\r\n";
			
			for(let i = 0; i < colorList.length; i++) {
				let colorHex = "    {\"hex\": \"" + colorList[i].getElementsByTagName("h3")[0].innerHTML + "\", ";
				let colorName = "\"name\": \"" + colorList[i].getElementsByTagName("p")[0].innerHTML + "\", ";
				let colorContribution = "\"contribution\": \"" + colorList[i].getElementsByTagName("p")[1].innerHTML + "\"}";
				
				jsonResult += [colorHex, colorName, colorContribution].join("");
				//If element is the last - don't add comma to the end
				if(i != colorList.length-1)
					jsonResult += ',';
				
				jsonResult += "\r\n";
			}
			
			jsonResult += "]";
			
			const preCode = select("#color-picker-export-json-modal pre code");
			preCode.innerHTML = jsonResult;
			hljs.highlightElement(preCode);
		});
		
		//Setting event listener on the download button
		const exportjsonDownloadButton = select("#color-picker-export-json-modal-download-button");
		exportjsonDownloadButton.addEventListener("click", e => {
			exportjsonDownloadButton.href = "data:text/plain;charset=utf-8, " + encodeURIComponent(select("#color-picker-export-json-modal pre code").innerText);
		});
		
		
		//Auxiliary functions used in both PNG and PDF export
		//Copy colors from colorList
		function copyColorsToCollage() {
			//Copying color list from color picker card to the collage
			const collageColorList = select("#color-picker-export-collage-color-list");
			collageColorList.innerHTML = "";
			for(let i = 0; i < colorList.length; i++) {
				const newNode = colorList[i].cloneNode(true);
				newNode.removeAttribute("hidden");
				collageColorList.appendChild(newNode);
			}
		}
		
		//Scaling image inside to fit its container
		function rescaleCollageImage() {
			const collageResultImage = select("#color-picker-export-collage-result-image");
			const collageDisplayImage = select("#color-picker-export-collage-display-image");
			collageDisplayImage.src = select("#display-image").src;
			// const collageResultImageWidth = getComputedStyle(collageResultImage).width.slice(0,-2);
			// const collageResultImageHeight = getComputedStyle(collageResultImage).height.slice(0,-2);
			//Calculated persistent sizes of image container, assuming the whole collage is 1920x1080
			const collageResultImageWidth = 912;
			const collageResultImageHeight = 1016;
			const collageDisplayImageWidth = collageDisplayImage.naturalWidth;
			const collageDisplayImageHeight = collageDisplayImage.naturalHeight;
			const widthQuotient = collageResultImageWidth/collageDisplayImageWidth;
			const heightQuotient = collageResultImageHeight/collageDisplayImageHeight;
			//Increasing the sizes of the image by the smallest of the quotients
			const smallestQuotient = widthQuotient < heightQuotient ? widthQuotient : heightQuotient;
			collageDisplayImage.width = collageDisplayImageWidth * smallestQuotient;
			collageDisplayImage.height =  collageDisplayImageHeight * smallestQuotient;
		}
		
		
		//PNG
		//Downloading collage on click
		select("#color-picker-export-collage-png-button").onclick = function() {
			copyColorsToCollage();
			rescaleCollageImage();
			//Making screenshot of the collage
			html2canvas(select("#color-picker-export-collage"), {
				width: "1920",
				height: "1080",
				timeout: 0,
				onclone: function (clonedDoc) {
					clonedDoc.getElementById('color-picker-export-collage').style.display = 'block';
				}
			}).then((canvas)=>{
				let a = document.createElement("a");
				a.download = "color_picker.png";
				a.href = canvas.toDataURL('image/png');
				a.click();
			});
		};
		
		//PDF
		//Downloading collage on click
		select("#color-picker-export-collage-pdf-button").onclick = function() {
			copyColorsToCollage();
			rescaleCollageImage();
			//Making screenshot of the collage
			html2canvas(select("#color-picker-export-collage"), {
				width: "1920",
				height: "1080",
				timeout: 0,
				onclone: function (clonedDoc) {
					clonedDoc.getElementById('color-picker-export-collage').style.display = 'block';
				}
			}).then((canvas)=>{
				//Using jsPDF to save collage
				const imgData = canvas.toDataURL("image/jpeg", 1.0);
				//Without this line we get an error - jsPDF not found
				window.jsPDF = window.jspdf.jsPDF;
				let pdf = new jsPDF({
					orientation: "landscape",
					format: [1280, 720]
				});
				//Calculating width and height of a PDF page to fit the image
				const width = pdf.internal.pageSize.getWidth();
				const height = pdf.internal.pageSize.getHeight();
				pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
				pdf.save("color_picker.pdf");
			});
		};



        //After all preparations, executing next code:
		
		//Sending the default image to the server
		fetch(select("#display-image").src)
		.then(function (response) {
			return response.blob();
		})
		.then(function (blob) {
			send_img(blob);
		});
    }


    window.addEventListener("load", startup, false);

})();