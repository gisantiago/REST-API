const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

mongoose.connect("mongodb://localhost:27017/fsjstd-restapi");

const db = mongoose.connection;

db.on("error", err => {
    console.error("connection error:", err);
});

db.once("open", () => {
    console.log("db connection successful");
    // All database communication goes here

    const Schema = mongoose.Schema;
    const UserSchema = new Schema({
        _id:            {type: ObjectId, auto},
        firstName:      String,
        lastName:       String,
        emailAddress:   String,
        password:       String
    });

    const User = mongoose.model("User", UserSchema);

    const CourseSchema = new Schema({
        _id:                {type: ObjectId, auto},
        user:               {type: ObjectId, ref: 'User'},
        title:              String,
        description:        String,
        estimatedTime:      String,
        materialsNeeded:    String
    });

    const Course = mongoose.model("User", CourseSchema);
});