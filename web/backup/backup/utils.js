function clone_elem(elem) {
	var cpy = elem.cloneNode();
	Array.from(elem.childNodes).forEach(child => {
		cpy.appendChild(clone_elem(child));
	});
	return cpy;
}

function readable_time(time) {
	var now = Date.now();
	var total_seconds = Math.abs(Math.floor((now - time) / 1000));
	var total_minutes = Math.abs(Math.floor(total_seconds / 60));
	var total_hours   = Math.abs(Math.floor(total_minutes / 60));
	var total_days    = Math.abs(Math.floor(total_hours / 24));

	var seconds = total_seconds % 60;
	var minutes = total_minutes % 60;
	var hours   = total_hours % 24;
	var days    = total_days % 365;
	var years   = Math.floor(total_days / 365);

	if (total_seconds < 1) return "Now";
	return `${years > 0 ? `${years}y ` : ``}${total_days > 0 ? `${days}d ` : ``}${total_hours > 0 ? `${hours}h ` : ``}${total_minutes > 0 ? `${minutes}m` : `${seconds}s`}`;
}


