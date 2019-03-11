function showEmployeesSection(){
    $('#employees').show();
    $('#bugs').hide();

    // change the active flag on the navigation bar
    $('#Home').removeClass('active');
    $('#Employees').addClass('active');
}

function add_employee(){
    var params = {
        'Method' : 'Add',
        'Employee_Name' : $('#emp_name').val(),
        'Employee_Username' : $('#emp_username').val(),
        'Employee_Password' : $('#emp_password').val(),
        'Employee_Role' : $('#emp_role').val()
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
            $('#emp_name').val('');
            $('#emp_username').val('');
            $('#emp_password').val('');
            $('#emp_role').val('');

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
                tr.append('<td onclick="OpenEmployeeReport(\'' + AJAX_Response['Data'][i].ID + '\')" class="link">' + AJAX_Response['Data'][i].ID + '</td>'); // populate the new row, cell by cell
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
		alert("The webpage is unable to load, please contact the system admin")
	})
}