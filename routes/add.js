/**
 * Created by Micro on 19.08.2016.
 */
var express = require('express');
var router = express.Router();
var TaskModel = require('../libs/mongoose').TaskModel;


router.post('/', function(req, res) {

    //res.send({ status: 'OK' });

    TaskModel.count({}, function( err, count){

        var task = new TaskModel({
            sort: count+1,
            name: req.body.name,
            priority: req.body.priority,
            state: req.body.state,
            deadline: req.body.datepicker
        });

        return task.save(function (err) {
            if (!err) {
                console.log("task created");
                return res.send({ status: 'OK', task:task });
            } else {
                console.log(err);
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                console.log('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
});
module.exports = router;