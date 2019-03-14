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

function AddProgram() {
    var params = {
        'Method' : 'Add',
        'Program_Name' : $('#program-name-to-add').val(),
        'Program_Version' : $('#program-version-to-add').val(),
        'Program_Release' : $('#program-release-to-add').val(),
    }

    if (params['Program_Name'] != '') {

      var use_default_rel_ver = false;
      if (params['Program_Version'] == '' || params['Program_Release'] == '')
        use_default_rel_ver = true;

      // data needs to be formatted before it can be sent via ajax
      var formData = new FormData()
      formData.append('params', JSON.stringify(params));

      // make the ajax call
      var AJAX_Call = getData(formData, './Programs');

      // wait for the ajax call to finish then execute...
      $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result'] == 'Success'){
           var name = $('#program-name-to-add').val();
           var version  = $('#program-version-to-add').val();
           var release = $('#program-version-to-add').val();

            // clear the values the user entered
            $('#program-name-to-add').val('');
            $('#program-release-to-add').val('1');
            $('#program-version-to-add').val('0');

            // let the user know it was successful
            alert('You have successfully added a new program.');
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

function SearchPrograms() {

}

function UpdateProgram() {
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

function DeleteProgram() {
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
