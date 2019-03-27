'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id:            {type: ObjectId, auto},
    firstName:      String,
    lastName:       String,
    emailAddress:   String,
    password:       String
});

const CourseSchema = new Schema({
    _id:                {type: ObjectId, auto},
    user:               {type: ObjectId, ref: 'User'},
    title:              String,
    description:        String,
    estimatedTime:      String,
    materialsNeeded:    String,
    users: [UserSchema]
});

const Course = mongoose.model("User", CourseSchema);
const User = mongoose.model("User", UserSchema);

module.exports.User = User;