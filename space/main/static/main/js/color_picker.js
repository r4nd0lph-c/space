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
					console.log(img_params);
					for(let i = 0; i < img_params.length; i++) {
						//Updating the table
						colorList[i].style.backgroundColor = img_params[i].hex;
						colorList[i].getElementsByTagName("h3")[0].innerHTML = img_params[i].hex;
						colorList[i].getElementsByTagName("p")[0].innerHTML = img_params[i].name;
						colorList[i].getElementsByTagName("p")[1].innerHTML = img_params[i].contribution;
						checkBrightness();
						
						//Updating color circles on the image
						colorCircles[i].style.backgroundColor = img_params[i].hex;
						colorCircles[i].style.left = img_params[i].coords[0] * 100 +  "%";
						colorCircles[i].style.top = img_params[i].coords[1] * 100 + "%";
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


        //After all preparations, executing next code:

        checkBrightness();
    }


    window.addEventListener("load", startup, false);

})();