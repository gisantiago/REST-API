'use strict';

// load modules
const express = require('express');
const router = express.Router();
const User = require("./models").User;
const Course = require("./models").Course;


router.param("_id", (req, res, next, id) => {
    Course.findById(id, (err, doc) => {
        if(err) return next(err);
        if(!doc) {
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        req.course = doc;
        return next();
    });
});



/*****************************************************************
 *  USERS ROUTES
****************************************************************/

//GET: /api/users 200 --- All Users
router.get("/users", (req, res, next) => {
    User.find({})
                .exec((err, users) => {
                    if(err) return next(err);
                    res.json(users);
                });
});

//POST: /api/users 201
//Route for creating a user
router.post("/users", (req, res, next) => {
    const user = new User(req.body);
    user.save( (err, user) => {
        if(err) return next(err);
        res.status(201);
        res.json(user);
    });
});


/*****************************************************************
 *  COURSES ROUTES
****************************************************************/

//GET: /api/courses 200 --- All Course
router.get("/courses", (req, res, next) => {
    Course.find({})
                .exec((err, courses) => {
                    if(err) return next(err);
                    res.json(courses);
                });
});


//GET: /api/courses/:id 201
//Route that resturns a course based on the provided course ID
router.get("/courses/:id", (req, res, next) => {
     res.json(req.course);
}); 


//POST: /api/courses 201
//Route for creating a course
router.post("/courses", (req, res, next) => {
    const course = new Course(req.body);
    course.save( (err, course) => {
        if(err) return next(err);
        res.status(201);
        res.json(course);
    });
});







module.exports = router;