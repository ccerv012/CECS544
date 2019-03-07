function test_employees(){
    var AJAX_Call = getData('', './employees');

    $.when(AJAX_Call).then(function (AJAX_Response){
        console.log("made it!");
    })

    // the AJAX call was not issued succesfully
	.fail(function(load){
		alert("The webpage is unable to load, please contact the system admin")
	})
}