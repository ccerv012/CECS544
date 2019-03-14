function SearchBugs(){
    var params = {
        'Method': 'Search',
        'BugID': $('#bugID').val(),
        'Pgm': $('#prg').val(),
        'ReportType': $('#rptType').val(),
        'Severity': $('#severity').val(),
        'FunctionalArea': $('#funcArea').val(),
        'Assigned': $('#assigned').val(),
        'Status': $('#status').val(),
        'Priority': $('#priority').val(),
        'Resolution': $('#resolution').val(),
        'ReportedBy': $('#reportBy').val(),
        'ReportDate': $('#reportDate').val(),
        'ResolvedBy': $('#resolBy').val(),
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
            $('#bugSearchResults').empty();

            //  creeate a table to dsiplay the results
            $('#bugSearchResults').append('<table id="BugResultsTable" class="ResultsTable">');

            // add a header row to the table
            $('#BugResultsTable').append('<thead><th>Bug ID</th><th>Program</th><th>Report Type</th><th>Severity</th><th>Functional Area</th><th>Assigned</th><th>Status</th><th>Priority</th><th>Resolution</th><th>Reported By</th><th>Report Date</th><th>Resolved By</th><th>Delete</th></thead>');

            // loop through the search results and add them to the results table
            var tr;
            for (var i = 0; i < AJAX_Response['Data'].length; i++) {
                tr = $('<tr/>'); // this is jquery short hand for adding a new row object
                tr.append('<td onclick="OpenBugReport(\'' + AJAX_Response['Data'][i].ID + '\')" class="link">' + AJAX_Response['Data'][i].ID + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].Program + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].ReportType + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].Severity + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].FuncArea + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].Assigned + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].Status + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].Priority + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].Resolution + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].ReportedBy + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].ReportedDate + '</td>'); // populate the new row, cell by cell
                tr.append('<td>' + AJAX_Response['Data'][i].ResolvedBy + '</td>'); // populate the new row, cell by cell
                tr.append('<td><button onclick="DeleteBug(\'' + AJAX_Response['Data'][i].ID + '\')">Delete</button></td>'); // populate the new row, cell by cell
                $('#BugResultsTable').append(tr); // add the row you just built to the table
            }
        }
    })

    // the AJAX call was not issued succesfully
	.fail(function(load){
		alert("The webpage is unable to load, please contact the system admin")
	})
}

function DeleteBug(bugID){
    // prompt the user to confirm their choice to delete a record
    if (confirm("Are you sure you want to delete " + bugID + "?")){
        var params = {
            'Method' : 'Delete',
            'ID' : bugID
        }

        // data needs to be formatted before it can be sent via ajax
        var formData = new FormData()
        formData.append('params', JSON.stringify(params));

        // make the ajax call
        var AJAX_Call = getData(formData, './Bugs');

        // wait for the ajax call to finish then execute...
        $.when(AJAX_Call).then(function (AJAX_Response){
            if (AJAX_Response['Result'] == 'Success'){
                // re-run the search to show the user its been deleted
                SearchBugs();

                // let the user know it was successful
                alert('You have successfully deleted ' + bugID);
            }
        })

        // the AJAX call was not issued succesfully
        .fail(function(load){
            alert("The webpage is unable to load, please contact the system admin");
        })
    }
}

function AddBug(){
    var params = {
        'Method' : 'Add',
        'ProgramID' : $('#addPrg').val(),
        'Program' : $('#addPrg option:selected').text(),
        'Release' : $('#addRel').val(),
        'Version' : $('#addVer').val(),
        'ReportType' : $('#addRptType').val(),
        'Severity' : $('#addSeverity').val(),
        'ProblemSummary' : $('#addProbSumm').val(),
        'Reproduce' : $('#addReproduce').val(),
        'SuggestedFix' : $('#addSuggFix').val(),
        'ReportBy' : $('#addReportBy').val(),
        'ReportDate' : $('#addReportDate').val(),
        'fileCount' : uploadList.length
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    for (var i=0;i<uploadList.length;i++){
        formData.append("fileItem", uploadList[i]);
    }

    // make the ajax call
   $.ajax({
       url: './Bugs',
       type: 'POST',
       data: formData,
       processData: false,
       contentType: false
   })

    // wait for the ajax call to finish then execute...
    .done(function(json) {
        if (json['Result'] == 'Success'){
            // clear the values the user entered
            $('#addPrg').val('');
            $('#addRel').val('');
            $('#addVer').val('');
            $('#addRptType').val('');
            $('#addSeverity').val('');
            $('#addProbSumm').val('');
            $('#addReproduce').val('');
            //$('#reproducSteps').val(AJAX_Response['Data'][0]['']); //???
            $('#addSuggFix').val('');
            $('#addReportBy').val('');
            $('#addReportDate').val('');

            uploadList = [];
            rowCount = 0;
            $('files').empty();

            // let the user know it was successful
            alert('You have successfully created a new bug');
        }
    })

    .fail(function(json){
        alert("The webpage is unable to load, please contact the system admin");
    })
}

var BUG_DROP_DOWN_VALUES = '';
function showBugSection(){
    // show/hide the sections we want the user to see
    $('#bugs').show();
    $('#employees').hide();
    $('#programs').hide();

    // change the active flag on the navigation bar
    $('#Home').removeClass('active');
    $('#Bugs').addClass('active');
    $('#Employees').removeClass('active');
    $('#Programs').removeClass('active');

    // populate the Add Date
    $('#addReportDate').val($.datepicker.formatDate('mm/dd/yy', new Date()));
    //Populate the Reported by
    $('#addReportBy').val(getCookie('EmployeeName'));

    var params = {
        'Method': 'PopulateDropdown'
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './Bugs');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success') {
            // save AJAX response to a global variable that we can access later
            BUG_DROP_DOWN_VALUES = AJAX_Response['DropdownVals'];

            // populate the program dropdown menus on the search and add form
            var Prgs = Object.keys(AJAX_Response['DropdownVals']['Programs']);
            $.each(Prgs, function (i, Prg){
                $('#prg').append($('<option>', {
                    value: AJAX_Response['DropdownVals']['Programs'][Prg][1]['PrgmID'],
                    text: Prg
                }));

                $('#addPrg').append($('<option>', {
                    value: AJAX_Response['DropdownVals']['Programs'][Prg][1]['PrgmID'],
                    text: Prg
                }));
            })

            //populate the employee fields
            var Employees = AJAX_Response['DropdownVals']['Employees'];
            $.each(Employees, function (i, Emp){
                $('#reportBy').append($('<option>', {
                    value: Emp['Name'],
                    text: Emp['Name']
                }));

                $('#resolBy').append($('<option>', {
                    value: Emp['Name'],
                    text: Emp['Name']
                }));
            })
        }

        // add the jquery date picker to all the date fields
        $( ".datepicker" ).datepicker();
    })

    // the AJAX call was not issued succesfully
	.fail(function(load){
		alert("The webpage is unable to load, please contact the system admin")
	})
}

function OpenBugReport(bugID){
	// set a cookie so the next page can read the cookie and know which bug to open
	setCookie('bugID', bugID, .5);

	// redirect to the bug editor
	window.open('./BugEditor.html');
}

function LoadBugReport(){
    EnableLoadingGraphic();
    if (document.cookie.indexOf("bugID")>=0){
        // save the bugID to a variable that we will send to the search function
        var bugID = getCookie("bugID");
        // delete the cookie so if a user opens another page the bugID variable is reset
        setCookie('bugID', bugID, 0);

        PopulateBugEditor(bugID);
    }
}

function PopulateBugEditor(bugID){
    var params = {
        'Method': 'PopulateBug',
        'BugID': bugID
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './Bugs');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success') {
            // populate the form with the values that are currently in the database
            // we can hardcode [0] because only 1 row will ever be returned since we are searching
            // by the bug ID.  We could change our sendData variable in python but this way
            // everything stays consistent
            $('#bugID').val(AJAX_Response['Data'][0]['ID']);
            $('#prg').val(AJAX_Response['Data'][0]['Program']);
            $('#rel').val(AJAX_Response['Data'][0]['ProgramRel']);
            $('#ver').val(AJAX_Response['Data'][0]['ProgramVer']);
            $('#rptType').val(AJAX_Response['Data'][0]['ReportType']);
            $('#severity').val(AJAX_Response['Data'][0]['Severity']);
            $('#probSumm').val(AJAX_Response['Data'][0]['ProbSumm']);
            $('#reproduce').val(AJAX_Response['Data'][0]['Reproducable']);
            //$('#reproducSteps').val(AJAX_Response['Data'][0]['']); //???
            $('#suggFix').val(AJAX_Response['Data'][0]['SuggFix']);
            $('#reportBy').val(AJAX_Response['Data'][0]['ReportBy']);
            $('#reportDate').val(AJAX_Response['Data'][0]['ReportDate']);
            $('#funcArea').val(AJAX_Response['Data'][0]['FuncArea']);
            $('#assigned').val(AJAX_Response['Data'][0]['Assigned']);
            $('#comments').val(AJAX_Response['Data'][0]['Comments']);
            $('#status').val(AJAX_Response['Data'][0]['Status']);
            $('#priority').val(AJAX_Response['Data'][0]['Priority']);
            $('#resolution').val(AJAX_Response['Data'][0]['Resolution']);
            $('#resolVer').val(AJAX_Response['Data'][0]['ResolutionVer']);
            $('#resolBy').val(AJAX_Response['Data'][0]['ResolvedBy']);
            $('#resolDate').val(AJAX_Response['Data'][0]['ResolvedDate']);
            $('#resolTestedBy').val(AJAX_Response['Data'][0]['TestedBy']);
            $('#resolTestDate').val(AJAX_Response['Data'][0]['TestedDate']);
            $('#defer').val(AJAX_Response['Data'][0]['Deferred']);

            //populate the attachments that have already been added
            if (AJAX_Response['Attachments'].length > 0 ){
                $('#uploadedFiles').append('<b>Current Attachments</b><br>');

                for (var i=0; i < AJAX_Response['Attachments'].length;i++){
                    $('#uploadedFiles').append('<a href=".\\' + AJAX_Response['Attachments'][i]['FileLocation'] + AJAX_Response['Attachments'][i]['FileName'] + '" target="_blank">' + AJAX_Response['Attachments'][i]['FileName'] + '</a><br>');
                }
            }

            //populate the employee fields
            var Employees = AJAX_Response['DropdownVals']['Employees'];
            $.each(Employees, function (i, Emp){
                $('#resolBy').append($('<option>', {
                    value: Emp['ID'],
                    text: Emp['Name']
                }));

                $('#resolTestedBy').append($('<option>', {
                    value: Emp['ID'],
                    text: Emp['Name']
                }));

                $('#assigned').append($('<option>', {
                    value: Emp['ID'],
                    text: Emp['Name']
                }));
            })

            // populate func areas
            var FuncAreas = AJAX_Response['DropdownVals']['FuncAreas'];
            $.each(FuncAreas, function (i, Func){
                $('#funcArea').append($('<option>', {
                    value: Func['ID'],
                    text: Func['Name']
                }));
            })
        }

        // add the jquery date picker to all the date fields
        $( ".datepicker" ).datepicker();
    })

    // the AJAX call was not issued succesfully
	.fail(function(load){
		alert("The webpage is unable to load, please contact the system admin")
	})
}

function SaveBug(){
    var params = {
        'Method' : 'Update',
        'BugID' : $('#bugID').val(),
        // 'Prg' : $('#prg').val(),
        // 'Rel' : $('#rel').val(),
        // 'Ver' : $('#ver').val(),
        'ReportType' : $('#rptType').val(),
        'Severity' : $('#severity').val(),
        'ProblemSumm' : $('#probSumm').val(),
        'Reproduceable' : $('#reproduce').val(),
        'ReproduceSteps' : $('#reproducSteps').val(), //???
        'SuggestFix' : $('#suggFix').val(),
        // 'ReportBy' : $('#reportBy').val(),
        // 'ReportByDate' : $('#reportDate').val(),
        'FunctionalArea' : $('#funcArea').val(),
        'AssignedTo' : $('#assigned').val(),
        'Comments' : $('#comments').val(),
        'Status' : $('#status').val(),
        'Priority' : $('#priority').val(),
        'Resolution' : $('#resolution').val(),
        'ResolutionVer' : $('#resolVer').val(),
        'ResolvedBy' : $('#resolBy').val(),
        'ResolvedDate' : $('#resolDate').val(),
        'ResolvedTestedBy' : $('#resolTestedBy').val(),
        'ResolvedTestDate' : $('#resolTestDate').val(),
<<<<<<< HEAD
        'Defer' : $('#defer').val()
=======
        'Defer' : $('#defer').val(),
        'fileCount' : uploadList.length     
>>>>>>> 1fdeb272e30799ae5f218ddfdb0decd63b70bf6d
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    for (var i=0;i<uploadList.length;i++){
        formData.append("fileItem", uploadList[i]);
    }

    // make the ajax call
   $.ajax({
       url: './Bugs',
       type: 'POST',
       data: formData,
       processData: false,
       contentType: false
   })

    // wait for the ajax call to finish then execute...
    .done(function(json) {
        if (json['Result'] == 'Success'){
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

$(document).on('change', '#addPrg', function () {

    // clear the choices from the Release and Version dropdowns
    $('#addRel').empty();
    $('#addVer').empty();

    $('#addRel').append('<option value="PleaseSelect">Please Select</option>');
    $('#addVer').append('<option value="PleaseSelect">Please Select</option>');

    // get the program the user selected
    selectedPrg = $('#addPrg option:selected').text();

    // populate the two corresponding drop downs
    Releases = Object.keys(BUG_DROP_DOWN_VALUES['Programs'][selectedPrg]);
    $.each(Releases, function (i, Rel){
        $('#addRel').append($('<option>', {
            value: Rel,
            text: Rel
        }));
    })

});

$(document).on('change', '#addRel', function () {
    // clear the choices from the Release and Version dropdowns
    $('#addVer').empty();
    $('#addVer').append('<option value="PleaseSelect">Please Select</option>');

    // get the program the user selected
    selectedPrg = $('#addPrg option:selected').text();
    selectedRel = $('#addRel option:selected').text();

    // populate the two corresponding drop downs
    Versions = BUG_DROP_DOWN_VALUES['Programs'][selectedPrg][selectedRel]['Ver'];
    $.each(Versions, function (i, Ver){
        $('#addVer').append($('<option>', {
            value: Ver,
            text: Ver
        }));
    })

});
