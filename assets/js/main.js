window.addEventListener("load", setHeaderStyle);
window.addEventListener("resize", setHeaderStyle);
document.getElementById("site-wrapper").addEventListener('scroll', setHeaderStyle);

function setHeaderStyle() {
	let header = document.getElementsByClassName("site-header")[0];
	const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	header.classList.remove("solid-header");

	if (vw < 1200 && document.getElementById("site-wrapper").scrollTop > 0) {
		header.classList.add("solid-header");
	}
}
