

function get_current_element(event){
	var x = event.clientX, y = event.clientY,
	element = document.elementFromPoint(x, y);
	return element
}
var last_element = null
function track_mouse(event){
	var elementMouseIsOver = get_current_element(event)
	if (elementMouseIsOver === last_element) {
		return
	}
	last_element = elementMouseIsOver
	var l=$(elementMouseIsOver).ellocate().css
	console.log(l)
}
window.onmousemove = track_mouse




css=`
<style>

	html{
		background-color: red;
	}

</style>
`
$("body").append(css)
