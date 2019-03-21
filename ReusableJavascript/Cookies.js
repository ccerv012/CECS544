function setCookie(cookieName, cookieValue, maxDays){
    var date = new Date();
    date.setTime(date.getTime() + (maxDays*24*60*60*1000));
    var expires = "expires="+date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + "; " + expires + ";domain=;path=/";
}

function getCookie(cookieName){
    var name = cookieName + "=";
    var ca = document.cookie.split('; ');
    for (var i=0; i<ca.length; i++){
        var c = ca[i];
        while (c.charAt(0)=='  ') 
            c=c.substring(1);

        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }

    return "";
}

function deleteCookies(){
    setCookie('EmployeeName', ' ', 0);
    location.reload();
}