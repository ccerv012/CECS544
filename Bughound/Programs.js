function AddProgram() {
    var params = {
        'Method' : 'Add',
        'Program_ID' : $('#program-id-to-add').val(),
        'Program_Name' : $('#program-name-to-add').val(),
        'Program_Version' : $('#program-version-to-add').val(),
        'Program_Release' : $('#program-release-to-add').val(),
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
            $('#program-id-to-add').val('');
            $('#program-name-to-add').val('');
            $('#program-version-to-add').val('');
            $('#program-release-to-add').val('');

            // let the user know it was successful
            alert('You have successfully added a new program');
        }
    })

    // the AJAX call was not issued succesfully
    .fail(function(load){
    alert("Failed to add program.")
    })
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
            alert('You have successfully deleted a program');
        }
    })

    // the AJAX call was not issued succesfully
    .fail(function(load){
      alert("Failed to delete program.")
    })
}

function showProgramsSection(){
    // show/hide the sections we want the user to see
    $('#bugs').hide();
    $('#employees').hide();
    $('#programs').show();

    // change the active flag on the navigation bar
    $('#Home').removeClass('active');
    $('#Bugs').removeClass('active');
    $('#Employees').removeClass('active');
    $('#Programs').addClass('active');
}
