function showFuncAreaSection(){
    $('#employees').hide();
    $('#bugs').hide();
    $('#functionalAreas').show();
    $('#programs').hide();
    $('#export').hide();

    // change the active flag on the navigation bar
    $('#Home').removeClass('active');
    $('#Bugs').removeClass('active');
    $('#Employees').removeClass('active');
    $('#FunctionalArea').addClass('active');
    $('#Programs').removeClass('active');
    $('#Export').removeClass('active');

    var params = {
        'Method' : 'DropDown',
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './functionalAreas');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success'){
            $.each(AJAX_Response['Data'], function (i, Prg){
                $('#prgm_id').append($('<option>', {
                    value: AJAX_Response['Data'][i]['ID'],
                    text: AJAX_Response['Data'][i]['Name']
                }));

                $('#add_to_prgm_id').append($('<option>', {
                    value: AJAX_Response['Data'][i]['ID'],
                    text: AJAX_Response['Data'][i]['Name']
                }));
            })
        }
    })

    // the AJAX call was not issued succesfully
	.fail(function(load){
		alert("The webpage is unable to load, please contact the system admin")
	})
}

function addFuncArea(){
    var params = {
        'Method' : 'Add',
        'FunctionalArea_Name' : $('#add_farea_name').val(),
        'Program' : $('#add_to_prgm_id').val(),
        'ProgramRel' : $('#add_prg_rel').val(),
        'ProgramVer' : $('#add_prg_ver').val()
    }

    if (params['FunctionalArea_Name']!='' && params['Program']!='PleaseSelect' && params['ProgramRel']!='' && params['ProgramVer']!=''){
        // data needs to be formatted before it can be sent via ajax
        var formData = new FormData()
        formData.append('params', JSON.stringify(params));

        // make the ajax call
        var AJAX_Call = getData(formData, './functionalAreas');

        // wait for the ajax call to finish then execute...
        $.when(AJAX_Call).then(function (AJAX_Response){
            if (AJAX_Response['Result'] == 'Success'){
                // clear the values the user entered
                $('#add_farea_name').val('');
                $('#add_to_prgm_id').val('PleaseSelect');
                $('#add_prg_rel').val('');
                $('#add_prg_ver').val('');

                // let the user know it was successful
                alert('You have successfully added a new functional area to the selected program');
            }
            else if (AJAX_Response['Result']=='PK Violation')
                alert('This record already exists. Add Failed.');
            else if (AJAX_Response['Result'] == 'Invalid Program')
                alert('That program, rel, and version does not exist, please try again');
        })

        // the AJAX call was not issued succesfully
        .fail(function(load){
            alert("The webpage is unable to load, please contact the system admin")
        })
    }

    else
        alert("Please fill out all required fields");

}

function searchFuncArea(){
    var params = {
        'Method' : 'Search',
        'Program' : $('#prgm_id').val()
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './functionalAreas');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success') {
            // clear any existing search results
            $('#functionalSearchResults').empty();

            //  creeate a table to dsiplay the results
            $('#functionalSearchResults').append('<table id="FunctionalResultsTable" class="ResultsTable">');

            // add a header row to the table
            $('#FunctionalResultsTable').append('<thead><th>Program Name</th><th>Program Rel</th><th>Program Ver</th><th>Functional Area</th><th>Delete</th></thead>');

            // loop through the search results and add them to the results table
            var tr;
            for (var i = 0; i < AJAX_Response['Data'].length; i++) {
                tr = $('<tr/>'); // this is jquery short hand for adding a new row object
                tr.append('<td onclick="openfunctionalArea(\'' + AJAX_Response['Data'][i].FunctionalArea_ID + '\')" class="link">' + AJAX_Response['Data'][i].Program_Name + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].Program_Rel + '</td>');
                tr.append('<td>' + AJAX_Response['Data'][i].Program_Ver + '</td>');
                tr.append('<td>' + AJAX_Response['Data'][i].FuntionalAreaName + '</td>'); // populate the new row, cell by cell
                tr.append('<td><button onclick="deletefunctionalArea(\'' + AJAX_Response['Data'][i].FunctionalArea_ID + '\')">Delete</button></td>'); // populate the new row, cell by cell
                $('#FunctionalResultsTable').append(tr); // add the row you just built to the table
            }
        }
    })
}

function ClearSearchFuncArea(){
    $('#prgm_id').val('PleaseSelect');
}

function resetFuncArea(){
    $('#add_to_prgm_id').val('PleaseSelect');
    $('#add_prg_rel').val('');
    $('#add_prg_ver').val('');
    $('#add_farea_name').val('');
}

function deletefunctionalArea(farea_id){
    //promt user to confirm deletion
    if (confirm("Are you sure you want to delete " + farea_id + "?")){
        var params = {
            'Method' : 'Delete',
            'FunctionaArea_ID' : farea_id
        }
        // data needs to be formatted before it can be sent via ajax
        var formData = new FormData()
        formData.append('params', JSON.stringify(params));

        // make the ajax call
        var AJAX_Call = getData(formData, './functionalAreas');

        // wait for the ajax call to finish then execute...
        $.when(AJAX_Call).then(function (AJAX_Response){
            if (AJAX_Response['Result'] == 'Success'){
                // re-run the search to show the user its been deleted
                searchFuncArea();

                // let the user know it was successful
                alert('You have successfully deleted ' + farea_id);
            }
        })

        // the AJAX call was not issued succesfully
        .fail(function(load){
            alert("The webpage is unable to load, please contact the system admin");
        })
    }
}

function openfunctionalArea(farea_id){
    // set a cookie so the next page can read the cookie and know which bug to open
	setCookie('farea_id', farea_id, .5);

	// redirect to the bug editor
	window.open('./FunctionalArea_Editor.html');
}

function loadFuncArea(){
    if (document.cookie.indexOf("EmployeeName")>=0){
        var EmployeeName = getCookie("EmployeeName");
        
        if (document.cookie.indexOf("farea_id")>=0){
            // save the farea_id to a variable that we will send to the search function
            var farea_id = getCookie("farea_id");
            // delete the cookie so if a user opens another page the bugID variable is reset
            setCookie('farea_id', farea_id, 0);

            populate_farea_editor(farea_id);
        }
    }
    else
		window.location.replace('http://localhost:8081/ReusableJavascript/Login.html');
}

function populate_farea_editor(farea_id){
    var params = {
        'Method': 'Populate',
        'FunctionalArea_ID': farea_id,
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './functionalAreas');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success') {
            // populate the form with the values that are currently in the database
            // we can hardcode [0] because only 1 row will ever be returned since we are searching
            // by the farea ID.  We could change our sendData variable in python but this way
            // everything stays consistent
            $('#program_name').val(AJAX_Response['Data'][0]['Program_Name']);
            $('#farea_id').val(AJAX_Response['Data'][0]['FunctionalArea_ID']);
            $('#farea_name').val(AJAX_Response['Data'][0]['FuntionalAreaName']);
        }
    })

    // the AJAX call was not issued succesfully
	.fail(function(load){
		alert("The webpage is unable to load, please contact the system admin")
	})
}

function updateFunctionalArea(){
    var params = {
        'Method' : 'Update',
        'FunctionalArea_ID' : $('#farea_id').val(),
        'FunctionalArea_Name' : $('#farea_name').val()
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './functionalAreas');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success'){
            // let the user know it was successful
            alert('You have successfully saved your changes');
            window.close();
        }
    })

    // the AJAX call was not issued succesfully
	.fail(function(load){
		alert("The webpage is unable to load, please contact the system admin")
	})
}
