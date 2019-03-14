function showEmployeesSection(){
  // show/hide the sections we want the user to see
  $('#bugs').hide();
  $('#employees').show();
  $('#programs').hide();

  // change the active flag on the navigation bar
  $('#Home').removeClass('active');
  $('#Bugs').removeClass('active');
  $('#Employees').addClass('active');
  $('#Programs').removeClass('active');
}

function add_employee(){
    var params = {
        'Method' : 'Add',
        'Employee_Name' : $('#add_emp_name').val(),
        'Employee_Username' : $('#add_emp_username').val(),
        'Employee_Password' : $('#add_emp_password').val(),
        'Employee_Role' : $('#add_emp_role').val()
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './employees');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success'){
            // clear the values the user entered
            $('#add_emp_name').val('');
            $('#add_emp_username').val('');
            $('#add_emp_password').val('');
            $('#add_emp_role').val('');

            // let the user know it was successful
            alert('You have successfully added a new employee');
        }
    })

    // the AJAX call was not issued succesfully
	.fail(function(load){
		alert("The webpage is unable to load, please contact the system admin")
	})
}

function search_employees(){
    var params = {
        'Method' : 'Search',
        'Employee_ID' : $('#emp_id').val()
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './employees');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success') {
            // clear any existing search results
            $('#employeeSearchResults').empty();

            //  creeate a table to dsiplay the results
            $('#employeeSearchResults').append('<table id="EmployeeResultsTable" class="ResultsTable">');

            // add a header row to the table
            $('#EmployeeResultsTable').append('<thead><th>Employee ID</th><th>Employee Username</th><th>Employee Name</th><th>Employee Role</th><th>Delete</th></thead>');

            // loop through the search results and add them to the results table
            var tr;
            for (var i = 0; i < AJAX_Response['Data'].length; i++) {
                tr = $('<tr/>'); // this is jquery short hand for adding a new row object
                tr.append('<td onclick="open_employee(\'' + AJAX_Response['Data'][i].ID + '\')" class="link">' + AJAX_Response['Data'][i].ID + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].Username + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].Name + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].Role + '</td>'); // populate the new row, cell by cell
                tr.append('<td><button onclick="delete_employees(\'' + AJAX_Response['Data'][i].ID + '\')">Delete</button></td>'); // populate the new row, cell by cell
                $('#EmployeeResultsTable').append(tr); // add the row you just built to the table
            }
        }
    })

    // the AJAX call was not issued succesfully
	.fail(function(load){
		alert("The webpage is unable to load, please contact the system admin")
	})
}

function delete_employees(emp_id){
    //promt user to confirm deletion
    if (confirm("Are you sure you want to delete " + emp_id + "?")){
        var params = {
            'Method' : 'Delete',
            'EmpID' : emp_id
        }
        // data needs to be formatted before it can be sent via ajax
        var formData = new FormData()
        formData.append('params', JSON.stringify(params));

        // make the ajax call
        var AJAX_Call = getData(formData, './employees');

        // wait for the ajax call to finish then execute...
        $.when(AJAX_Call).then(function (AJAX_Response){
            if (AJAX_Response['Result'] == 'Success'){
                // re-run the search to show the user its been deleted
                search_employees();

                // let the user know it was successful
                alert('You have successfully deleted ' + emp_id);
            }
        })

        // the AJAX call was not issued succesfully
        .fail(function(load){
            alert("The webpage is unable to load, please contact the system admin");
        })
    }
}


function open_employee(emp_id){
	// set a cookie so the next page can read the cookie and know which bug to open
	setCookie('emp_id', emp_id, .5);

	// redirect to the bug editor
	window.open('./Employee_Editor.html');
}

function load_employees(){
    if (document.cookie.indexOf("emp_id")>=0){
        // save the bugID to a variable that we will send to the search function
        var emp_id = getCookie("emp_id");
        // delete the cookie so if a user opens another page the bugID variable is reset
        setCookie('emp_id', emp_id, 0);

        populate_emp_editor(emp_id);
    }
}

function populate_emp_editor(emp_id){
    var params = {
        'Method': 'Populate',
        'emp_id': emp_id
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './employees');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success') {
            // populate the form with the values that are currently in the database
            // we can hardcode [0] because only 1 row will ever be returned since we are searching
            // by the bug ID.  We could change our sendData variable in python but this way
            // everything stays consistent
            $('#emp_id').val(AJAX_Response['Data'][0]['ID']);
            $('#emp_username').val(AJAX_Response['Data'][0]['Username']);
            $('#emp_name').val(AJAX_Response['Data'][0]['Name']);
            $('#emp_password').val(AJAX_Response['Data'][0]['Password']);
            $('#emp_role').val(AJAX_Response['Data'][0]['Role']);
        }
    })

    // the AJAX call was not issued succesfully
	.fail(function(load){
		alert("The webpage is unable to load, please contact the system admin")
	})
}

function update_employee(){
    var params = {
        'Method' : 'Update',
        'emp_id' : $('#emp_id').val(),
        'emp_username' : $('#emp_username').val(),
        'emp_name' : $('#emp_name').val(),
        'emp_password' : $('#emp_password').val(),
        'emp_role' : $('#emp_role').val()
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './employees');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success'){
            // let the user know it was successful
            alert('You have successfully saved your changes');
        }
    })

    // the AJAX call was not issued succesfully
	.fail(function(load){
		alert("The webpage is unable to load, please contact the system admin")
	})
}
