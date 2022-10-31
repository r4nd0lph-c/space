/* Info Circle Popover */
/* Will cause troubles if there are other popovers besides infoCirclePopover on page */
/* Reason: 'select(".popover")' selects all popovers on page*/
function setUpInfoCirclePopover() {	
	const infoCircle = select("a[data-bs-custom-class='info-circle-popover']");
	const infoCirclePopover = new bootstrap.Popover(infoCircle, {
		trigger: "manual",
		html: true
	});
	let infoCirclePopoverTimeout;
	
	
	infoCircle.addEventListener("mouseenter", function() {
		clearTimeout(infoCirclePopoverTimeout);
		if(select(".popover") != null)
			return;
		infoCirclePopover.show();
		select(".popover").addEventListener("mouseleave", function() {
			if(infoCircle.matches(":hover"))
				return;
			infoCirclePopover.hide();
		});
	});
	
	infoCircle.addEventListener("mouseleave", function() {
		clearTimeout(infoCirclePopoverTimeout);
		infoCirclePopoverTimeout = setTimeout(function(){
			if (select(".popover:hover") == null) {
				infoCirclePopover.hide();
			}
		}, 300);
	});
}