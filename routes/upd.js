/**
 * Created by Micro on 23.08.2016.
 */
var express = require('express');
var router = express.Router();
var TaskModel = require('../libs/mongoose').TaskModel;

router.post('/', function(req, res) {

    return TaskModel.findById(req.body.id, function (err, task) {
        if(!task) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
            task.name       = req.body.name;
            task.priority   = req.body.priority;
            task.state      = req.body.state;
            task.deadline   = req.body.datepicker;

        return task.save(function (err) {
            if (!err) {
                console.log("task updated");
                return res.send({ status: 'OK', task:task });
            } else {
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