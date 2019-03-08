function CheckLoginStatus(){
	if (document.cookie.indexOf("EmployeeName")>=0){
		var EmployeeName = getCookie("EmployeeName"); // since we know the user has been authenticated, grab their Name
		$('#greeting').html('Welcome ' + EmployeeName); // simple welcome banner 

		// display all the session info about the user, compare this to the cookie
		// see how we are able to store more sensitive data in the session variable 
		// that we do not want to store in the cookie because the user can tamper with the cookie
		// but the user cannot tamper with the session variable
		SessionInfo(); 
		
		// hide the sections we dont want the user to know about yet
		$('#bugs').hide();
		
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

function OpenBugReport(bugID){
	// set a cookie so the next page can read the cookie and know which bug to open
	setCookie('bugID', bugID, .5);

	// redirect to the bug editor
	window.open('./BugEditor.html');
}