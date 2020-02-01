var project_active = null;

$(document).ready(function() {

	getProjects();

});

function redirToIndex() {
	window.location.replace('/index');
}

function createProject() {
	var name = prompt("Please Enter a name for your project");

	var data = {
		project: name
	}

	$.ajax({
		type: "POST".
		url: "/create_project",
		data: "data",
		success: function() {
			getProjects();
		}
	})

}

function onProjectClick(projectPath, project, projectElem) {

	if (project_active != projectElem) {

		if (project_active != null) {
			project_active.classList.remove('bg-success');
			project_active.classList.remove('text-light');
			project_active.classList.add('gray');
		}

		project_active = projectElem;

		project_active.classList.add('bg-success');
		project_active.classList.add('text-light');
		project_active.classList.remove('gray');
	}

	var data = {
		project : project,
		project_path: projectPath
	}

	$.ajax({
		type: "POST",
		url: '/index',
		data: data,
		sucess: function() {

		}
	})

	return false;
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

			html += "<div onclick='onProjectClick("+'"'+project[1]+'"'+ ',"'+project[0]+'"' +", this)'class='dir-header gray text-light' style='margin-left:50px;'><h5>"+project[0]+"</h5></div>";

		}

	}


	return html;	
}