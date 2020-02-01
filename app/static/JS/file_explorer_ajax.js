$(document).ready(function () {

	getFileExplorerContent();


});

// File Creation Handling
function onNewDirectory() {
	working_name = ajaxSessionVars('working_name');
	var promptPath = prompt("Specify the path for the directory: (You are at "+ working_name +")");

	if (promptPath.trim() != '') {
		var data = {
			type: "DIR",
			path: "data/" + working_name + "/" + promptPath
		}

		ajaxCreate(data);

	}

}

function onNewFile() {
	working_name = ajaxSessionVars('working_name');
	var promptPath = prompt("Specify the path for the directory: (You are at "+ working_name +")");

	if (promptPath.trim() != '') {
		var data = {
			type: "FILE",
			path: "data/" + working_name + "/" + promptPath
		}

		ajaxCreate(data);

	}

}


// Handle Ajax for File Creation

function ajaxCreate(data) {
	$.ajax({
		type: "POST",
		url: "/create",
		data: data,
		success: function(result) {
			getFileExplorerContent();
		}
	})
}

// Displays the File Explorer Content
function getFileExplorerContent() {
	$.ajax({
		type: "POST",
		url: "/files",
		success: function(result) {

			console.log(result);
			html = directoryHTML(result.dir, 0);

			$("#file-explorer").html(html);

		}
	});
}

// Directory HTML computer
function directoryHTML(dir, depth) {

	console.log(dir);
	var dir_arr = dir[2];
	var html = '<div class="directory bg-light" depth = "'+ depth + '"';
	html += 'style = "padding-left: '+ (depth * 20) +'px; ">';

	html += '<div id="dir" class="dir-header text-light bg-secondary"><span class="dir-span" path="'+ dir[1] +'">'+ dir[0] +'</span></div>' 

	for (var i = 0; i < dir_arr.length; i++) {
		if (dir_arr[i].file != undefined) {	// File
			html += fileHTML(dir_arr[i].file, depth + 1);
		}
		else if (dir_arr[i].dir != undefined) {	// Directory
			html += directoryHTML(dir_arr[i].dir, depth + 1);
		}
		else {
			html += '<div class="empty_dir" depth = "'+depth+'"></div>'
		}
	}

	html += '</div>';

	return html;
}

// File HTML computer
function fileHTML(file_arr, depth) {

	return '<div id="file" onclick="onClickFile(this)" file = "' + file_arr[0] + '" path = "'+ file_arr[1]+'" class="file gray" style = "margin-left: 20px" depth = "'+ depth +'"><span>'+ file_arr[0] +'</span></div>'

}

// Ajax Handling
function ajaxSessionVars(type) {
	
	var resultString;

	var data = {
		type : type
	}

	$.ajax({
		async: false,
		type: 'POST', 
		url: '/ses',
		global: false,
		data: data,
		success: function (result) {
			console.log(result.ses);
			resultString = result.ses;
		}
	})

	return resultString
}