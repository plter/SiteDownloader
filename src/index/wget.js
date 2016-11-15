/**
 * Created by plter on 2016/11/15.
 */

module.exports = function (url) {
    return new Promise(function (ok, rej) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            ok(xhr.responseText);
        };
        xhr.onerror = function (e) {
            rej(e);
        };
        xhr.open("GET", url);
        xhr.send();
    });
};