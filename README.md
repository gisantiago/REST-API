
# Full Stack JavaScript Techdegree v2 - REST API Project 

# Extra Credits 
###### Additional user email address validations to the POST /api/users route
- emailAddress field validated for exitance as well as valid format: example@domain.com ---- routes.js (lines 51 - 55)
- Validate that the provided email address isn't already associated with an existing user record ----- models.js (lines 5, 15 and 18)

###### Ensure that a user can only edit and delete their own courses
- Added if/else statements to test for current user's ID Course's user's ID equality. ---- routes.js ( lines: if/else statements in router.put() and router.delete() )
- if authenticated user tries to update/delete a course not owned by him/her, an error messsage will appaer and throw a status 403.

###### Course routes
- Using Mongoose deep population to return only the firstName and lastName properties of the related user on the course model ---- routes.js ( lines: 171 and 183)
