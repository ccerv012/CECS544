function Login(){
    var url = document.referrer; // get the original page the user requested
    var app = url.split('/')[3];

    // need to prevent the page from crashing if the user bookmarks the login screen and not the app
    if (app == null){
        app = 'Login;'
    }

    // get the values the user entered in the login form
    var parameters = {
        'Username' : $('#Username').val(),
        'Password' : $('#Password').val(),
        'App' : app
    }

    if (parameters['Username'].length > 0 && parameters['Password'].length > 0){
        var formData = new FormData() // special Javascript object type needed to make an AJAX call
        formData.append("parameters", JSON.stringify(parameters)); // append the paramaters dictionary above into the new object needed for the AJAX call, the stringify function convert the data to ensure it gets sent correctly

        // make the AJAX call using the predfined function, pass the formData object we created, pass the name of the PY page to be run
        var AJAX_Call = getData(formData, '../ReusablePython/Login');

        // listen for the AJAX response
        $.when(AJAX_Call).then(function (AJAX_Response){

            if (AJAX_Response['Result'] == 'Success'){
                // set the cookie so the app knows their name
                setCookie('EmployeeName', AJAX_Response['Data']['EmployeeName'], 0.5); // 1/2 day expiration for the cookie
				
                if (app != 'Login'){
                    window.location.replace(url); // send the user back to the original page
                }
                else
                    alert('Please navigate to the App')
            }
            else if (AJAX_Response['Result'] == 'Failed'){
                // let the user know their authentication was not successfull
                alert('You entered the wrong username or password');
                // reset the login form so they can try again
                $('#Username').val('');
                $('#Password').val('');
            }
        })

        // the AJAX call was not issued succesfully
        .fail(function(load){
            alert("The webpage is unable to load, please contact the system admin")
        })
    }
    else
        alert('Please enter both a username and password and try again');
}