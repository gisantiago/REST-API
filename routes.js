'use strict';

// load modules
const express = require('express');
const router = express.Router();
const User = require("./models").User;
const Course = require("./models").Course;
const { check, validationResult } = require('express-validator/check');


router.param("id", (req, res, next, id) => {
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

router.param("_id", (req, res, next) => {
    req.course = req.course.id(id);
    if(!req.course) {
        err = new Error("Not Found");
        err.status = 404;
        return next(err);
    }
    next();
});


// ****** Users Validator **********

//First Name Validator
const fnameValidator = check('firstName')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please enter the first name');

//Last Name Validator
const lnameValidator = check('lastName')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please enter the last name');

//Email Validator
const emailValidator = check('email')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please enter a valid email');

//Password Validator
const pwdValidator = check('password')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please enter the last name');


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
//Route for creating a user -- with fields validators
router.post("/users", fnameValidator, lnameValidator, emailValidator, pwdValidator, (req, res, next) => {
    //const user = new User(req.body);
    const errors = validationResult(req);
   // user.save( (errors, user) => {
        //if(err) return next(err);
        if ( !errors.isEmpty() ) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        const user = req.body;
        users.push(user);
        return res.status(201).end();
       // res.status(201);
       // res.json(user);
    //});
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

//PUT: /api/course/:id 200
//Route to updates a course
router.put("/courses/:id", (req, res, next) => {
    req.course.update(req.body, (err, result) => {
        if(err) return next(err);
        res.json(course);
    });
});

//DELETE: /api/course/:id 200
//Route that deletes courses
router.post("/courses/:id", (req, res, next) => {
    req.course.remove((err) => {
        req.course.save( (err, course) => {
            if(err) return next(err);
            res.json(course);
        });
    });
});

module.exports = router;