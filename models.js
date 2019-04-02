'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


// Build the Schema for for the database --- includes the User and Course collections
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName:      String,
    lastName:       String,
    emailAddress:   String,
    password:       String
}); 


// UserSchema.pre("save", (next) => {
//     next();
// });

const CourseSchema = new Schema({
    user:               {type: ObjectId, ref: 'User'},
    title:              String,
    description:        String,
    estimatedTime:      String,
    materialsNeeded:    String,
    url:                String
});

CourseSchema.method("update", (updates, callback) => {
    Object.assign(this, updates);
    this.parent().save(callback);
});

// User/Course models definition
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);

module.exports.User = User;
module.exports.Course = Course;