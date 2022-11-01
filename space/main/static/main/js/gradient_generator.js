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
		
		/* Activates tooltips on the page, particularly on export modal */
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
		let myInterval;
		document.querySelector('#gradient-export-image-modal').addEventListener('show.bs.modal', (event) => {
			const array = ["aback","abaft","abandoned","abashed","aberrant","abhorrent","abiding","abject","ablaze","able","abnormal","aboard","aboriginal","abortive","abounding","abrasive","abrupt","absent","absorbed","absorbing","abstracted","absurd","abundant","abusive","acceptable","accessible","accidental", "what am I doing with my life??","accurate","acid","acidic","acoustic","acrid","actually","ad","hoc","adamant","adaptable","addicted","adhesive","adjoining","adorable","adventurous","afraid","aggressive","agonizing","agreeable","ahead","ajar","alcoholic","alert","alike","alive","alleged","alluring","aloof","amazing","ambiguous","ambitious","amuck","amused","amusing","ancient","angry","animated","annoyed","annoying","anxious","apathetic","aquatic","aromatic","arrogant","ashamed","aspiring","assorted","astonishing","attractive","auspicious","automatic","available","average","awake","aware","awesome","awful","axiomatic","bad","barbarous","bashful","bawdy","beautiful","befitting","belligerent","beneficial","bent","berserk","best","better","bewildered","big","billowy","bite-sized","bitter","bizarre","black","black-and-white","bloody","blue","blue-eyed","blushing","boiling","boorish","bored","boring","bouncy","boundless","brainy","brash","brave","brawny","breakable","breezy","brief","bright","bright","broad","broken","brown","bumpy","burly","bustling","busy","cagey","calculating","callous","calm","capable","capricious","careful","careless","caring","cautious","ceaseless","certain","changeable","charming","cheap","cheerful","chemical","chief","childlike","chilly","chivalrous","chubby","chunky","clammy","classy","clean","clear","clever","cloistered","cloudy","closed","clumsy","cluttered","coherent","cold","colorful","colossal","combative","comfortable","common","complete","complex","concerned","condemned","confused","conscious","cooing","cool","cooperative","coordinated","courageous","cowardly","crabby","craven","crazy","creepy","crooked","crowded","cruel","cuddly","cultured","cumbersome","curious","curly","curved","curvy","cut","cute","cute","cynical","daffy","daily","damaged","damaging","damp","dangerous","dapper","dark","dashing","dazzling","dead","deadpan","deafening","dear","debonair","decisive","decorous","deep","deeply","defeated","defective","defiant","delicate","delicious","delightful","demonic","delirious","dependent","depressed","deranged","descriptive","deserted","detailed","determined","devilish","didactic","different","difficult","diligent","direful","dirty","disagreeable","disastrous","discreet","disgusted","disgusting","disillusioned","dispensable","distinct","disturbed","divergent","dizzy","domineering","doubtful","drab","draconian","dramatic","dreary","drunk","dry","dull","dusty","dynamic","dysfunctional","eager","early","earsplitting","earthy","easy","eatable","economic","educated","efficacious","efficient","eight","elastic","elated","elderly","electric","elegant","elfin","elite","embarrassed","eminent","empty","enchanted","enchanting","encouraging","endurable","energetic","enormous","entertaining","enthusiastic","envious","equable","equal","erect","erratic","ethereal","evanescent","evasive","even excellent excited","exciting exclusive","exotic","expensive","extra-large extra-small exuberant","exultant","fabulous","faded","faint fair","faithful","fallacious","false familiar famous","fanatical","fancy","fantastic","far"," far-flung"," fascinated","fast","fat faulty","fearful fearless","feeble feigned","female fertile","festive","few fierce","filthy","fine","finicky","first"," five"," fixed"," flagrant","flaky","flashy","flat","flawless","flimsy"," flippant","flowery","fluffy","fluttering"," foamy","foolish","foregoing","forgetful","fortunate","four frail","fragile","frantic","free"," freezing"," frequent"," fresh"," fretful","friendly","frightened frightening full fumbling functional","funny","furry furtive","future futuristic","fuzzy ","gabby","gainful","gamy","gaping","garrulous","gaudy","general gentle","giant","giddy","gifted","gigantic","glamorous","gleaming","glib","glistening glorious","glossy","godly","good","goofy","gorgeous","graceful","grandiose","grateful gratis","gray greasy great","greedy","green grey grieving","groovy","grotesque","grouchy","grubby gruesome","grumpy","guarded","guiltless","gullible gusty","guttural H habitual","half","hallowed","halting","handsome","handsomely","handy","hanging","hapless","happy","hard","hard-to-find","harmonious","harsh","hateful","heady","healthy","heartbreaking","heavenly heavy hellish","helpful","helpless","hesitant","hideous high","highfalutin","high-pitched","hilarious","hissing","historical","holistic","hollow","homeless","homely","honorable","horrible","hospitable","hot huge","hulking","humdrum","humorous","hungry","hurried","hurt","hushed","husky","hypnotic","hysterical","icky","icy","idiotic","ignorant","ill","illegal","ill-fated","ill-informed","illustrious","imaginary","immense","imminent","impartial","imperfect","impolite","important","imported","impossible","incandescent","incompetent","inconclusive","industrious","incredible","inexpensive","infamous","innate","innocent","inquisitive","insidious","instinctive","intelligent","interesting","internal","invincible","irate","irritating","itchy","jaded","jagged","jazzy","jealous","jittery","jobless","jolly","joyous","judicious","juicy","jumbled","jumpy","juvenile","kaput","keen","kind","kindhearted","kindly","knotty","knowing","knowledgeable","known","labored","lackadaisical","lacking","lame","lamentable","languid","large","last","late","laughable","lavish","lazy","lean","learned","left","legal","lethal","level","lewd","light","like","likeable","limping","literate","little","lively","lively","living","lonely","long","longing","long-term","loose","lopsided","loud","loutish","lovely","loving","low","lowly","lucky","ludicrous","lumpy","lush","luxuriant","lying","lyrical","macabre","macho","maddening","madly","magenta","magical","magnificent","majestic","makeshift","male","malicious","mammoth","maniacal","many","marked","massive","married","marvelous","material","materialistic","mature","mean","measly","meaty","medical","meek","mellow","melodic","melted","merciful","mere","messy","mighty","military","milky","mindless","miniature","minor","miscreant","misty","mixed","moaning","modern","moldy","momentous","motionless","mountainous","muddled","mundane","murky","mushy","mute","mysterious","naive","nappy","narrow","nasty","natural","naughty","nauseating","near","neat","nebulous","necessary","needless","needy","neighborly","nervous","new","next","nice","nifty","nimble","nine","nippy","noiseless","noisy","nonchalant","nondescript","nonstop","normal","nostalgic","nosy","noxious","null","numberless","numerous","nutritious","nutty","oafish","obedient","obeisant","obese","obnoxious","obscene","obsequious","observant","obsolete","obtainable","oceanic","odd","offbeat","old","old-fashioned","omniscient","one","onerous","open","opposite","optimal","orange","ordinary","organic","ossified","outgoing","outrageous","outstanding","oval","overconfident","overjoyed","overrated","overt","overwrought","painful","painstaking","pale","paltry","panicky","panoramic","parallel","parched","parsimonious","past","pastoral","pathetic","peaceful","penitent","perfect","periodic","permissible","perpetual","petite","petite","phobic","physical","picayune","pink","piquant","placid","plain","plant","plastic","plausible","pleasant","plucky","pointless","poised","polite","political","poor","possessive","possible","powerful","precious","premium","present","pretty","previous","pricey","prickly","private","probable","productive","profuse","protective","proud","psychedelic","psychotic","public","puffy","pumped","puny","purple","purring","pushy","puzzled","puzzling","quack","quaint","quarrelsome","questionable","quick","quickest","quiet","quirky","quixotic","quizzical","rabid","racial","ragged","rainy","rambunctious","rampant","rapid","rare","raspy","ratty","ready","real","rebel","receptive","recondite","red","redundant","reflective","regular","relieved","remarkable","reminiscent","repulsive","resolute","resonant","responsible","rhetorical","rich","right","righteous","rightful","rigid","ripe","ritzy","roasted","robust","romantic","roomy","rotten","rough","round","royal","ruddy","rude","rural","rustic","ruthless","sable","sad","safe","salty","same","sassy","satisfying","savory","scandalous","scarce","scared","scary","scattered","scientific","scintillating","scrawny","screeching","second","second-hand","secret","secretive","sedate","seemly","selective","selfish","separate","serious","shaggy","shaky","shallow","sharp","shiny","shivering","shocking","short","shrill","shut","shy","sick","silent","silent","silky","silly","simple","simplistic","sincere","six","skillful","skinny","sleepy","slim","slimy","slippery","sloppy","slow","small","smart","smelly","smiling","smoggy","smooth","sneaky","snobbish","snotty","soft","soggy","solid","somber","sophisticated","sordid","sore","sore","sour","sparkling","special","spectacular","spicy","spiffy","spiky","spiritual","spiteful","splendid","spooky","spotless","spotted","spotty","spurious","squalid","square","squealing","squeamish","staking","stale","standing","statuesque","steadfast","steady","steep","stereotyped","sticky","stiff","stimulating","stingy","stormy","straight","strange","striped","strong","stupendous","stupid","sturdy","subdued","subsequent","substantial","successful","succinct","sudden","sulky","super","superb","superficial","supreme","swanky","sweet","sweltering","swift","symptomatic","synonymous","taboo","tacit","tacky","talented","tall","tame","tan","tangible","tangy","tart","tasteful","tasteless","tasty","tawdry","tearful","tedious","teeny","teeny-tiny","telling","temporary","ten","tender tense","tense","tenuous","terrible","terrific","tested","testy","thankful","therapeutic","thick","thin","thinkable","third","thirsty","thoughtful","thoughtless","threatening","three","thundering","tidy","tight","tightfisted","tiny","tired","tiresome","toothsome","torpid","tough","towering","tranquil","trashy","tremendous","tricky","trite","troubled","truculent","true","truthful","two","typical","ubiquitous","ugliest","ugly","ultra","unable","unaccountable","unadvised","unarmed","unbecoming","unbiased","uncovered","understood","undesirable","unequal","unequaled","uneven","unhealthy","uninterested","unique","unkempt","unknown","unnatural","unruly","unsightly","unsuitable","untidy","unused","unusual","unwieldy","unwritten","upbeat","uppity","upset","uptight","used","useful","useless","utopian","utter","uttermost","vacuous","vagabond","vague","valuable","various","vast","vengeful","venomous","verdant","versed","victorious","vigorous","violent","violet","vivacious","voiceless","volatile","voracious","vulgar","wacky","waggish","waiting","","wakeful","wandering","wanting","warlike","warm","wary","wasteful","watery","weak","wealthy","weary","well-groomed","well-made","well-off","well-to-do","wet","whimsical","whispering","white","whole","wholesale","wicked","wide","wide-eyed","wiggly","wild","willing","windy","wiry","wise","wistful","witty","woebegone","womanly","wonderful","wooden","woozy","workable","worried","worthless","wrathful","wretched","wrong","wry","xenophobic","yellow","yielding","young","youthful","yummy","zany","zealous","zesty","zippy","zonked"];
			const myText = document.querySelector('#gradient-export-image-modal .modal-body p');
			myInterval = setInterval(function() {
				let randomNum = Math.ceil(Math.random() * array.length - 1);
				myText.innerHTML = "What are you today: <b>" + array[randomNum] + "</b>";
			}, 300);
		});
		
		document.querySelector('#gradient-export-image-modal').addEventListener('hide.bs.modal', (event) => {
			clearInterval(myInterval);
		});	
        
		
		
        //After all preparations, executing next code:
        
        generateRandomColors();
        update();
    }


    window.addEventListener("load", startup, false);

})();