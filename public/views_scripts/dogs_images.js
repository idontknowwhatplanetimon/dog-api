
function addToFavourite(event) {
	const xhttp = new XMLHttpRequest();
	const image_id = event.target.getAttribute("image-id");
	xhttp.open("POST", "/dogs/images"); 
	xhttp.setRequestHeader("Content-type", "text/plain");
	xhttp.send(image_id);
}
