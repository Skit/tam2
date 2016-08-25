/**
 * Created by Micro on 19.08.2016.
 */
var express = require('express');
var router = express.Router();
var TaskModel = require('../libs/mongoose').TaskModel;


router.post('/', function(req, res, next) {

    TaskModel.findById(req.body.id, function (err, task) {
        if(!task) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return task.remove(function (err) {
            if (!err) {
                console.log("article removed");
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });

});

module.exports = router;