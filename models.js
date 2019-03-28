'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    user_id:            {ObjectId},
    title:              String,
    description:        String,
    estimatedTime:      String,
    materialsNeeded:    String
});

CourseSchema.method("update", (updates, callback) => {
    Object.assign(this, updates);
    this.parent().save(callback);
});

const UserSchema = new Schema({
    firstName:      String,
    lastName:       String,
    emailAddress:   String,
    password:       String
}); 


UserSchema.pre("save", (next) => {
    next();
});


const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);

module.exports.User = User;
module.exports.Course = Course;