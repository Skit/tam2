/**
 * Created by Micro on 22.08.2016.
 */
var testrunner = require("qunit");

testrunner.run({
    deps: "D:/Dropbox/Domains/tam2/no22de_modules/jquery",
    code : "../public/javascripts/jquery-ui/custom.js",
    tests : "D:/Dropbox/Domains/tam2/22tests/jquery-ui/test.js"
}, function(err, report) {
    console.dir(report);
});