function showProgramsSection(){
    // show/hide the sections we want the user to see
    $('#bugs').hide();
    $('#employees').hide();
    $('#programs').show();
    $('#functionalAreas').hide();

    // change the active flag on the navigation bar
    $('#Home').removeClass('active');
    $('#Bugs').removeClass('active');
    $('#Employees').removeClass('active');
    $('#Programs').addClass('active');
    $('#FunctionalArea').removeClass('active');
}

function addProgram() {
    var params = {
        'Method' : 'Add',
        'Program_Name' : $('#program-name-to-add').val(),
        'Program_Version' : $('#program-version-to-add').val(),
        'Program_Release' : $('#program-release-to-add').val(),
    }

    if (params['Program_Name'] != '') {

      var use_default_ver_or_rel = false;
      if (params['Program_Version'] == '') {
        params['Program_Version'] = '0';
        use_default_ver_or_rel = true;
      }
      if (params['Program_Release'] == '') {
        params['Program_Release'] = '1';
        use_default_ver_or_rel = true;
      }

      // data needs to be formatted before it can be sent via ajax
      var formData = new FormData()
      formData.append('params', JSON.stringify(params));

      // make the ajax call
      var AJAX_Call = getData(formData, './Programs');

      // wait for the ajax call to finish then execute...
      $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success'){
            // clear the values the user entered
            $('#program-name-to-add').val('');
            $('#program-release-to-add').val('1');
            $('#program-version-to-add').val('0');

            // let the user know it was successful
            if (use_default_ver_or_rel)
              alert('You have successfully added a new program. A default version or release was provided.');
            else {
              alert('You have successfully added a new program.');
            }
        } else if (AJAX_Response['Result']=='PK Violation') {
          alert("This record already exists. Add failed.");
        }
      })

      // the AJAX call was not issued succesfully
      .fail(function(load){
      alert("Failed to add program.")
      })
    } else {
      alert("Please fill out all required fields.")
    }
}

function searchPrograms() {
  var params = {
      'Method' : 'Search',
      'Program_Name' : $('#program-name-to-search').val(),
      'Program_Version' : $('#program-version-to-search').val(),
      'Program_Release' : $('#program-release-to-search').val(),
  }

  // data needs to be formatted before it can be sent via ajax
  var formData = new FormData()
  formData.append('params', JSON.stringify(params));

  // make the ajax call
  var AJAX_Call = getData(formData, './Programs');

  // wait for the ajax call to finish then execute...
  $.when(AJAX_Call).then(function (AJAX_Response){
      if (AJAX_Response['Result'] == 'Success') {
          // clear any existing search results
          $('#program-search-results').empty();

          //  creeate a table to display the results
          $('#program-search-results').append('<table id="program-results-table" class="ResultsTable">');

          // add a header row to the table
          $('#program-results-table').append('<thead><th>Program ID</th><th>Program Name</th><th>Version</th><th>Release</th><th>Delete</th></thead>');

          // loop through the search results and add them to the results table

          console.log("Search success!\n");
          console.log("Data: " + AJAX_Response['Data']);

          var tr;
          for (var i = 0; i < AJAX_Response['Data'].length; i++) {
              tr = $('<tr/>'); // this is jquery short hand for adding a new row object
              tr.append('<td onclick="openProgramEditor(\'' + AJAX_Response['Data'][i].Prgm_ID + '\')" class="link">' + AJAX_Response['Data'][i].Prgm_ID + '</td>'); // populate the new row, cell by cell
              tr.append('<td>' + AJAX_Response['Data'][i].Prgm_Name + '</td>'); // populate the new row, cell by cell
              tr.append('<td>' + AJAX_Response['Data'][i].Version + '</td>'); // populate the new row, cell by cell
              tr.append('<td>' + AJAX_Response['Data'][i].Release + '</td>'); // populate the new row, cell by cell
              tr.append('<td><button onclick="deleteProgram(\'' + AJAX_Response['Data'][i].Prgm_ID + '\')">Delete</button></td>'); // populate the new row, cell by cell
              $('#program-results-table').append(tr); // add the row you just built to the table
          }
      }
    })
    .fail(function(load){ // the AJAX call was not issued succesfully
      alert("The webpage is unable to load, please contact the system admin")
    })
}

function updateProgram() {
    var params = {
        'Method' : 'Update',
        'Program_ID' : $('#program-id-to-update').val(),
        'Program_Name' : $('#program-name-to-update').val(),
        'Program_Version' : $('#program-version-to-update').val(),
        'Program_Release' : $('#program-release-to-update').val(),
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './Programs');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success'){
            // clear the values the user entered
            $('#program-id-to-update').val('');
            $('#program-name-to-update').val('');
            $('#program-version-to-update').val('');
            $('#program-release-to-update').val('');

            // let the user know it was successful
            alert('You have successfully updated a program');
        }
    })

    // the AJAX call was not issued succesfully
    .fail(function(load){
    alert("Failed to update program.")
    })
}

function deleteProgram() {
    var params = {
        'Method' : 'Delete',
        'Program_ID' : $('#program-id-to-delete').val(),
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './Programs');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success'){
            // clear the values the user entered
            $('#program-id-to-delete').val('');

            // let the user know it was successful
            alert('You have successfully deleted a program (id: ' + AJAX_Response['Data'] + ')');

        } else if (AJAX_Response['Result'] == 'Does Not Exist' ||
                   AJAX_Response['Result'] == 'Could Not Delete') {

          alert(AJAX_Response['Error'])
        }
    })

    // the AJAX call was not issued succesfully
    .fail(function(load){
      alert("Failed to delete program.")
    })
}

function openProgramEditor(programID){
	// set a cookie so the next page can read the cookie and know which program to open
	setCookie('programID', programID, .5);

	// redirect to the program editor
	window.open('./Program_Editor.html');
}

function resetProgramSearch() {
    $('#program-name-to-search').val("");
    $('#program-version-to-search').val("");
    $('#program-release-to-search').val("");
}
