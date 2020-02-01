var currentFilePath = '';
var currentFile = null;
var changeCounter = 0;

// Auto Save


$(document).ready(function() {

	editor.on("change", function () {
		changeCounter += 1;
		if (changeCounter < 50) {
			$("#save").html('Saving');
		}

	})

	window.setInterval(function(){
		if (changeCounter > 25) {
			onSave();
			$("#save").html('Saved');
			changeCounter = 0;
		}
	}, 1000);


	window.setInterval(function(){
		onSave();
		$("#save").html('Saved');
		changeCounter = 0;
	}, 10000);


})

// Button Callbacks

function onClickFile(file) {

	onSave();

	if(file.getAttribute('path') != currentFilePath) {
		currentFilePath = file.getAttribute('path');
		
		if (currentFile != null) {
			currentFile.classList.remove('bg-success');
			currentFile.classList.remove('text-light');
			currentFile.classList.add('gray');
		} 

		currentFile = file;
		currentFile.classList.add('bg-success');
		currentFile.classList.add('text-light');
		currentFile.classList.remove('gray');

		$("#curr_file").html("<-- Editing <b>" + file.getAttribute('file') + "</b>");
		openFileAjax(currentFilePath);
	}
}

function onSave() {

	$("#save").html('Saved');

	var textContent = editor.getDoc().getValue();

	var data = {
		path: currentFilePath,
		mode: 'SAVE',
		content: textContent
	}

	saveFileAjax(data);
}

function onRefresh() {
	if (currentFilePath != '') {
		openFileAjax(currentFilePath);
	}
	getFileExplorerContent();
}

function onRun() {
	onSave();
	if (currentFilePath != '') {
		runFileAjax(currentFilePath);
	}
}

// Ajax Calls

function runFileAjax(filePath) {
		
	var data = {
		path : filePath
	}

	$.ajax({
		type: 'POST',
		url: '/run',
		data: data,
		success: function(result) {
			$("#console").html(result.output);
		}
	}) 
}

function saveFileAjax(data) {
	$.ajax({
		type: 'POST',
		url: '/update_file',
		data: data
	})
}

function openFileAjax(filePath) {
		
	if (filePath == '') {
		return;
	}

	var data = {
		path: filePath 
	}

	$.ajax({
		type: 'POST',
		url: '/get_contents',
		data: data,
		success: function(result) {
			editor.getDoc().setValue(result.content);
		} 
	})

}