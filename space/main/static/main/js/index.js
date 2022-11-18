(function() {
	// Lining up images in recent posts by the upper line
	var x = window.matchMedia("(max-width: 768px)");
	x.addListener(function() {
		const recentPostsTextContents = select(".recent-post-card-content > a > div", true);
		//Reset height of divs on mobile devices
		if(x.matches) {
			recentPostsTextContents[0].style.height = null;
			recentPostsTextContents[1].style.height = null;
		} else {
			// Figuring out the highest div in recent post
			const firstDivHeight = getComputedStyle(recentPostsTextContents[0]).height;
			const secondDivHeight = getComputedStyle(recentPostsTextContents[1]).height;
			const highestDivHeight = parseInt(firstDivHeight) > parseInt(secondDivHeight) ? firstDivHeight : secondDivHeight;
			// Settings the height to each div
			recentPostsTextContents[0].style.height = highestDivHeight;
			recentPostsTextContents[1].style.height = highestDivHeight;
		}
	});
})()