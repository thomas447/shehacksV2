$(document).ready(function() {

	getProjects();

});



function onProjectClick(projectPath, project) {

	var data = {
		project : project,
		project_path: projectPath
	}

	$.ajax({
		type: "POST",
		url: '/index',
		data: data
	})

}

function getProjects() {
	$.ajax({
		type: 'POST',
		url: '/projects',
		success: function (result) {
			var html = getUserHTML(result.users);
			console.log(result.users);

			$("#projects").html(html);
		}
	})
}

function getUserHTML(users) {

	var html = "";

	for(var i = 0; i < users.length; i++) {

		var user = users[i];

		html += "<div class='dir-header bg-dark text-light'><h5>"+user[0]+"</h5></div>";

		projects = user[1];

		for (var j = 0; j < projects.length; j++) {

			project = projects[j];

			html += "<div onclick='onProjectClick("+'"'+project[1]+'"'+ ',"'+project[0]+'"' +")'class='dir-header gray text-light' style='margin-left:50px;'><h5>"+project[0]+"</h5></div>";

		}

	}


	return html;	
}