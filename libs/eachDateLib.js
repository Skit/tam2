/**
 * Created by Micro on 23.08.2016.
 */
 module.exports = eachDate;

function eachDate(){

    var date = new Date(), month = (date.getMonth() +1);

    month = (month < 10) ? ('0' + month) : month;
    return date.getDate() + '.' + month + '.' + date.getFullYear();
}