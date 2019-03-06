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
    // create a list of all the cookies
    var cookies = document.cookie.split("; ");

    // loop through each cookie
    for (var c=0; c<cookies.length; c++){
        var d = window.location.hostname.split(".");
        while (d.length > 0){
            var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" + d.join(".") + " ;path";
            var p = location.pathname.split("/");
            document.cookie = cookieBase + "/";
            while (p.length>0){
                document.cookie = cookieBase + p.join("/");
                p.pop()
            };
            d.shift();
        }
    }
}