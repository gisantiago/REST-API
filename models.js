'use strict';

const mongoose = require('mongoose');
// Validate that the provided email address isn't already associated with an existing user record
var uniqueValidator = require('mongoose-unique-validator');
const ObjectId = mongoose.Schema.Types.ObjectId;


// Build the Schema for for the database --- includes the User and Course collections
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName:      String,
    lastName:       String,
    emailAddress:   {type: String, index: true, unique: true, required: true, uniqueCaseInsensitive: true},
    password:       String
}); 
UserSchema.plugin(uniqueValidator); // pljugin for the uniqueValidator

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
const User = mongoose.model("User", UserSchema, "users");
const Course = mongoose.model("Course", CourseSchema, "courses");

module.exports.User = User;
module.exports.Course = Course;