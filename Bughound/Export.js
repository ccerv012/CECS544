function showExportSection(){
    // show/hide the sections we want the user to see
  $('#bugs').hide();
  $('#functionalAreas').hide();
  $('#employees').hide();
  $('#programs').hide();
  $('#export').show();

  // change the active flag on the navigation bar
  $('#Home').removeClass('active');
  $('#Bugs').removeClass('active');
  $('#FunctionalArea').removeClass('active');
  $('#Employees').removeClass('active');
  $('#Programs').removeClass('active');
  $('#Export').addClass('active');
}

function exportBugsXML(){
    var params = {
        'Method': 'XML'
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './Bugs');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result']=='Success'){
            window.open(AJAX_Response['FileName']);
        }
    })

    // the AJAX call was not issued succesfully
    .fail(function(load){
        alert("The webpage is unable to load, please contact the system admin")
    })
}

function exportBugsASCII(){
    var params = {
        'Method': 'ASCII'
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './Bugs');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result']=='Success'){
            window.open(AJAX_Response['FileName']);
        }
    })

    // the AJAX call was not issued succesfully
    .fail(function(load){
        alert("The webpage is unable to load, please contact the system admin")
    })
}

function exportEmployeesXML(){
    var params = {
        'Method': 'XML'
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './employees');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result']=='Success'){
            window.open(AJAX_Response['FileName']);
        }
    })

    // the AJAX call was not issued succesfully
    .fail(function(load){
        alert("The webpage is unable to load, please contact the system admin")
    })
}

function exportEmployeesASCII(){
    var params = {
        'Method': 'ASCII'
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './employees');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result']=='Success'){
            window.open(AJAX_Response['FileName']);
        }
    })

    // the AJAX call was not issued succesfully
    .fail(function(load){
        alert("The webpage is unable to load, please contact the system admin")
    })
}

function exportProgramsXML(){
    var params = {
        'Method': 'XML'
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './Programs');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result']=='Success'){
            window.open(AJAX_Response['FileName']);
        }
    })

    // the AJAX call was not issued succesfully
    .fail(function(load){
        alert("The webpage is unable to load, please contact the system admin")
    })
}

function exportProgramsASCII(){
    var params = {
        'Method': 'ASCII'
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './Programs');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result']=='Success'){
            window.open(AJAX_Response['FileName']);
        }
    })

    // the AJAX call was not issued succesfully
    .fail(function(load){
        alert("The webpage is unable to load, please contact the system admin")
    })
}

function exportFuncAreaXML(){
    var params = {
        'Method': 'XML'
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './functionalAreas');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result']=='Success'){
            window.open(AJAX_Response['FileName']);
        }
    })

    // the AJAX call was not issued succesfully
    .fail(function(load){
        alert("The webpage is unable to load, please contact the system admin")
    })
}

function exportFuncAreaASCII(){
    var params = {
        'Method': 'ASCII'
    }

    // data needs to be formatted before it can be sent via ajax
    var formData = new FormData()
    formData.append('params', JSON.stringify(params));

    // make the ajax call
    var AJAX_Call = getData(formData, './functionalAreas');

    // wait for the ajax call to finish then execute...
    $.when(AJAX_Call).then(function (AJAX_Response){
        if (AJAX_Response['Result']=='Success'){
            window.open(AJAX_Response['FileName']);
        }
    })

    // the AJAX call was not issued succesfully
    .fail(function(load){
        alert("The webpage is unable to load, please contact the system admin")
    })
}
