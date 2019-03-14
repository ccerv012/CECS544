function CheckLoginStatus(){
	if (document.cookie.indexOf("EmployeeName")>=0){
		var EmployeeName = getCookie("EmployeeName"); // since we know the user has been authenticated, grab their Name
		$('#greeting').html('Welcome ' + EmployeeName); // simple welcome banner

		// display all the session info about the user, compare this to the cookie
		// see how we are able to store more sensitive data in the session variable
		// that we do not want to store in the cookie because the user can tamper with the cookie
		// but the user cannot tamper with the session variable
		// SessionInfo();

		// hide the sections we dont want the user to know about yet
		$('#bugs').hide();
		$('#employees').hide();
		$('#programs').hide();

		// set up the accordion on each page
		$( ".bugAccordion" ).accordion({heightStyle: "content"});
		$( ".emp_accordion" ).accordion({heightStyle: "content"});
		$( ".programAccordion" ).accordion({heightStyle: "content"});

		EnableLoadingGraphic();

	}
	else
		window.location.replace('http://localhost:8081/ReusableJavascript/Login.html');
}

function SessionInfo(){
	// make the AJAX call using the predfined function
	// notice we have to retrieve the session info from our server, this protects the data from being modified by the user
	var AJAX_Call = getData('', '../ReusablePython/Session');

	// listen for the AJAX response
	$.when(AJAX_Call).then(function (AJAX_Response){
		str = ''
		str += 'Employee ID: ' + AJAX_Response['Employee_ID'] + '<br>'; // because the data is a dictionary, access it by the dictionary name and the key
		str += 'Name: ' + AJAX_Response['Name'] + '<br>';
		str += 'Username: ' + AJAX_Response['Username'] + '<br>';
		str += 'Permission: ' + AJAX_Response['Permission'] + '<br>';
		$('#sessionInfo').html(str);
	})

	// the AJAX call was not issued succesfully
	.fail(function(load){
		alert("The webpage is unable to load, please contact the system admin");
	})
}

function EnableLoadingGraphic(){
	$(document).ajaxStart(function() {
		$('#wait').css('display', 'block');
	});

	$(document).ajaxComplete(function() {
		$('#wait').css('display', 'none');
	});
}

/*********************DRAG AND DROP INTERFACE*********************************/
// override default browser behavior to enable drag and drop zone
var uploadList = [];
$(document).ready(function(){

	$("#dragandrophandler").on('dragenter dragover drop', function (event){
		if (event.type === "dragenter") {
			event.stopPropagation();
			event.preventDefault(); // allow dropping and don't navigate to file on drop
			$(this).css('border', '2px solid #0B85A1');
		}
		else if (event.type === "dragover") {
			event.stopPropagation();
			event.preventDefault(); // allow dropping and don't navigate to file on drop
		}
		else if (event.type === "drop") {
			$(this).css('border', '2px dotted #0B85A1');
			event.preventDefault(); // allow dropping and don't navigate to file on drop


			var files = event.originalEvent.dataTransfer.files;
			// console.log(files);

			for (var i = 0; i < files.length; i++){
				// console.log(files[i]);
				uploadList.push(files[i])
			}

			// console.log(uploadList)
			processDroppedFiles(files);

		}
	});

	$(document).on('dragenter drop dragover', function (event){
		event.stopPropagation();
		event.preventDefault();

		if (event.type === "dragover") {
			$("#dragandrophandler").css('border', '2px dotted #0B85A1');
		}
	});
});

// extract file data and render to the screen under Drag and Drop zone
var rowCount=0; //global variable to keep track of div id in below function
function processDroppedFiles(files){
	for (var i = 0; i < files.length; i++) {

		// add a header row above files if its the first time files have been added
		if (rowCount === 0){
			$('#files').append("<span class='fileListHeader' style='width:300px'>File Name</span>");
			$('#files').append("<span class='fileListHeader' style='width:105px'>File Size</span>");
			$('#files').append("<span class='fileListHeader'>Remove File</span><br/>");
		}

		// render file info to the screen
		$('#files').append("<div id='row" + rowCount + "'></div>");
		$('#row' + rowCount).append("<span class='filename'>" + files[i].name + "</span>");
		$('#row' + rowCount).append("<span class='filesize'>" + files[i].size + "</span>");
		$('#row' + rowCount).append("<span class='abort'>Remove</span><br/>");
		rowCount++;
	}
}

// function needed to "remove file" onclick
$(document).on('click', '.abort', function () {
	$(this).parent().remove(); //removes div but not file data from input

	fileToDelete = $(this).siblings(".filename").text();

	// console.log("need to delete : " + fileToDelete);

	// delete file from array
	for (var i = 0;i < uploadList.length;i++){
		if (uploadList[i]['name'] == fileToDelete){
			// console.log("found it! : " + uploadList[i]['name'] + " deleted!");
			uploadList.splice(i,1);
			break // break out in case the user added the file twice and wants to delete only one of them
		}
	}

	// remove header row if all files have been deleted
	if (uploadList.length === 0){
		$('#files').empty();
		rowCount = 0;
	}

	// console.log(uploadList);
});
/*****************************************************************************/
