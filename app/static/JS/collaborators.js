var size = 0;

$(document).ready(function () {
		
	getCollaborators();

	window.setInterval(function(){
	
		getCollaborators();
	
	}, 1000);



});

function getCollaborators() {
	$.ajax({
		type: "POST",
		url: "/collab",
		success: function (result) {

			// If the users list has changed in size
			if (result.users.length != size) {
				size = result.users.length;
				// Append HTML stuff
				html = "";

				for (var i = 0; i < size; i++) {
					html += "<div class = 'bg-primary text-light text-center collaborator-block'>";
					html += "<span>" + result.users[i] + "</span>";
					html += "</div>";
				}

				$("#collab").html(html);
			}
		}
	})
}