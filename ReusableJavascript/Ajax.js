// generic reusable function to make AJAX calls easier and less lines of code
var getData = function(parameters, pythonURL) {
    return $.ajax({
        type: 'POST',
        data: parameters,
        dataType: 'json',
        url: pythonURL,
        processData: false,
        contentType: false
    });
}