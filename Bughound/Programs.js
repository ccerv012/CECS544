function AddProgram() {
    var params = {
        'Method' : 'Add',
        'Program_ID' : $('#program-id-to-add').val(),
        'Program_Name' : $('#program-name').val(),
        'Program_Version' : $('#program-version').val(),
        'Program_Release' : $('#program-release').val(),
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
            $('#program-id').val('');
            $('#program-name').val('');
            $('#program-version').val('');
            $('#program-release').val('');

            // let the user know it was successful
            alert('You have successfully added a new bug');
        }
    })

    // the AJAX call was not issued succesfully
    .fail(function(load){
    alert("The webpage is unable to load, please contact the system admin")
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
            $('#program-id').val('');

            // let the user know it was successful
            alert('You have successfully deleted a bug');
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
