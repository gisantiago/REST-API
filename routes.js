'use strict';

// load modules
const express = require('express');
const router = express.Router();
const User = require("./models").User;
const Course = require("./models").Course;




router.param("_id", (req, res, next, id) => {
    User.findById(id, (err, doc) => {
        if(err) return next(err);
        if(!doc) {
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        req.user = doc;
        return next();
    });
});

//GET: /api/users --- All Users
router.get("/users", (req, res, next) => {
    User.find({})
                .exec((err, users) => {
                    if(err) return next(err);
                    res.json(users);
                });
});

//GET:

//POST: /courses
//Route for creating a course
router.post("/courses", (req, res, next) => {
    const course = new Course(req.body);
    course.save( (err, course) => {
        if(err) return next(err);
        res.status(201);
        res.json(course);
    });
});


//GET: /api/users --- All Course
router.get("/courses", (req, res, next) => {
    Course.find({})
                .exec((err, courses) => {
                    if(err) return next(err);
                    res.json(courses);
                });
});

//POST: /users
//Route for creating a user
router.post("/users", (req, res, next) => {
    const user = new User(req.body);
    user.save( (err, user) => {
        if(err) return next(err);
        res.status(201);
        res.json(user);
    });
});


module.exports = router;