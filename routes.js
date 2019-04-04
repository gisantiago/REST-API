'use strict';

// load modules
const express = require('express');
const router = express.Router();
const User = require("./models").User;
const Course = require("./models").Course;
const { check, validationResult } = require('express-validator/check');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
// const {isEmail} = require('validator');


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
const emailValidator = check('emailAddress', 'Please enter a valid email')
    .isEmail();

//Password Validator
const pwdValidator = check('password')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please enter a password name');

// ****** Courses Validator **********

//Title Validator
const titleValidator = check('title')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please enter the course\'s title');

//Description Validator
const dscpValidator = check('description')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please enter a description for the course');
  

/******* Function to authenticate uers ********/
const authenticateUser = async (req, res, next) =>{
    let message = null;

    const credentials = auth(req);

    if (credentials) {
       
        const user = await User.findOne( {emailAddress: credentials.name} );

        if (user) {
            console.log(typeof credentials.pass)
            console.log(typeof user.password)
            const authenticated = bcryptjs
                .compareSync(credentials.pass, user.password);

            if (authenticated) {
                console.log(`Authentication successful for username: ${user.emailAddress}`)
                req.currentUser = user;
            } else {
                message = `Authentication failure for username ${user.emailAddress}`;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);

        res.status(401).json( { message: 'Access Denied' } );
    } else {
        next();
    }
};



/*****************************************************************
 *  USERS ROUTES
****************************************************************/

// Route that returns the current authenticated user.
router.get('/users', authenticateUser, (req, res) => {
    const user = req.currentUser;
  
    res.json({
        user_id: user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        emailAddress: user.emailAddress,
        password: user.password 
    });
});

//GET: /api/users 200 --- All Users
// router.get("/users", (req, res, next) => {
//     User.find({})
//                 .exec((err, users) => {
//                     if(err) return next(err);
//                     res.json(users);
//                 });
// });

//POST: /api/users 201
//Route for creating a user -- with fields validators
router.post("/users", [fnameValidator, lnameValidator, emailValidator, pwdValidator], (req, res, next) => {
    const errors = validationResult(req);

    if ( !errors.isEmpty() ) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }

    const user = new User(req.body);
    // Hash the new user's password.
    user.password = bcryptjs.hashSync(user.password);
    user.save( (err) => {
        if(err) return next(err);
        res.location("/");
        res.status(201);
        res.json();
    });
});


/*****************************************************************
 *  COURSES ROUTES
****************************************************************/

//GET: /api/courses 200 --- All Course
router.get("/courses", (req, res, next) => {
    Course.find({}).populate('user', ['firstName', 'lastName'])
                .exec((err, courses) => {
                    if(err) return next(err);
                    res.json(courses);
                });
});


//GET: /api/courses/:id 201
//Route that resturns a course based on the provided course ID
router.get("/courses/:id", (req, res, next) => {
    //  res.json(req.course);
     Course.findById(req.params.id).populate('user', ['firstName', 'lastName'])
                .exec( (err, course) => {
                    res.json(course);
                });
}); 


//POST: /api/courses 201
//Route for creating a course --- with validators for the title and description
router.post("/courses", authenticateUser, [titleValidator, dscpValidator], (req, res, next) => {
    const errors = validationResult(req);
    const course = new Course(req.body);
    if ( !errors.isEmpty() ) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }
    // Set the location to the course's uri and return no content
    course.save( (err, course) => {
        if(err) return next(err);
        res.location(req.body.url);
        res.status(201);
        res.json();
    });
});

//PUT: /api/course/:id 200
//Route to updates a course and return no content 
router.put("/courses/:id", authenticateUser, (req, res, next) => {
    const currUser = req.currentUser.id;
    const courseUser = req.course.user;
    // Testing for equality
    // const isEql = currUser == courseUser;
    // console.log("Current User: " + currUser);
    // console.log("courseUser: " + courseUser);
    // console.log(isEql);

    if (currUser == courseUser) {
        Course.findOneAndUpdate(req.params.id, {$set:req.body}, (err, result) => {
            if(err) return next(err);
            res.status(204);
            res.json();
        });
    } else {
        const err = new Error('You do not have permissions to update this course');
        err.status = 403;
        return next(err);
    }
});

//DELETE: /api/course/:id 200
//Route that deletes courses
router.delete("/courses/:id", authenticateUser, (req, res, next) => {
    const currUser = req.currentUser.id;
    const courseUser = req.course.user;

    if (currUser == courseUser) {
        Course.findByIdAndRemove(req.params.id, (err) => {
            req.course.save( (err, course) => {
                if(err) return next(err);
                res.status(204);
                res.json();
            });
        });
    } else {
        const err = new Error('You do not have permissions to update this course');
        err.status = 403;
        return next(err);
    }
});

module.exports = router;