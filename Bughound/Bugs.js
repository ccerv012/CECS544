function search_bugs(){
    var params = {
        'Method' : 'Search'
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './Bugs');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success') {
            // clear any existing search results
            $('#bugSearchResults').empty()

            //  creeate a table to dsiplay the results
            $('#bugSearchResults').append('<table id="BugResultsTable">');

            // add a header row to the table
            $('#BugResultsTable').append('<thead><tr>Bug ID</tr><tr>Program</tr><tr>Report Type</tr><tr>Severity</tr><tr>Delete</tr></thead>');
        
            // loop through the search results and add them to the results table 
            var tr;
            for (var i = 0; i < AJAX_Response['Data'].length; i++) { 
                tr = $('<tr/>'); // this is jquery short hand for adding a new row object
                tr.append('<td onclick="OpenBugReport(\"' + AJAX_Response['Data'][i].ID + '\")" class="link">' + AJAX_Response['Data'][i].ID + '<td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].Program + '<td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].ReportType + '<td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].Severity + '<td>'); // populate the new row, cell by cell
                tr.append('<td><button id="DeleteBug(\"' + AJAX_Response['Data'][i].ID + '\")"<td>'); // populate the new row, cell by cell
            }
        }
    })

    // the AJAX call was not issued succesfully
	.fail(function(load){
		alert("The webpage is unable to load, please contact the system admin")
	})
}

function DeleteBug(bugID){
    var params = {
        'Method' : 'Delete'
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './Bugs');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success'){
            // remove the row from the table

            // let the user know it was successful
            alert('You have successfully deleted ' + bugID);
        }
    })

    // the AJAX call was not issued succesfully
	.fail(function(load){
		alert("The webpage is unable to load, please contact the system admin")
	})
}