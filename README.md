#Development TIMELINE

#1.	Initial Setup

##Pages
* Add Landing Page
* Add Bets Page that lists all the bets
##Bet Model
* Description
* Image
* Date
###Example
[
	{description: “Germany vs Albania”, image: “http://www.bet-bro.com”, date: “23/06/17”},
	{description: “Brazil vs Argentina”, image: “http://www.bet-bro.com”, date: “24/06/17”},
	{description: “France vs England”, image: “http://www.bet-bro.com”, date: “27/06/17”},
]

#2.	Layout and Style
* Create Header and Footer
* Add Bootstrap

#3.	Creating New Bet (Admin)
* Setup new bet POST route
* Add in body-parser
* Setup route to show form
* Add basic unstyled form

#4.	Style the bets page
* Add a better header/title
* Make bets display in a grid

#5.	Style the Navbar and Form
* Add navbar to all templates
* Style the new bet form

#6.	Add Mongoose
* Install and configure mongoose
* Setup bet model
* Use bet model inside of our routes

#7.	Show Page
* Review the RESTful routes we’ve seen so far
* Add bet type to our bet model
* Show db.collection.drop()
* Add a show route/template

##RESTFUL ROUTES
Name		url		verb		description
INDEX		/dogs		GET		Display a list of all dogs
NEW 		/dogs/new	GET		Displays form to make a new dog
CREATE		/dogs		POST		Add new dog to DB
SHOW		/dogs/:id	GET		Shows info about one dog

#8. Refactor Mongoose Code
* Create a models directory
* Use module.exports
* Require everything correctly 

#9. Add seeds file
* Add a seeds.js file
* Run the seeds file every time the server starts

#10. Add the Comment model!
* Make our errors go away!
* Display comments on bet show page

#11. Comment New/Create
* Discuss nested routes
* Add comment new and create routes
* Add the new comment form

#12. Style Show Page
* Add sidebar to show page
* Display comments nicely

#13. Finish Styling Show Page
* Add public directory
* Add custom stylesheet

#14. Auth Pt. 1 - Add User Model
* Install all packages needed for auth
* Define User Models

#15. Auth Pt. 2 - Register
* Configure Passport
* Add register routes
* Add register template

#16. Auth Pt. 3 - Login
* Add login routes
* Add login template

#17. Auth Pt. 4 - Logout/Navbar
* Add logout route
* Prevent user from adding a comment if not signed in
* Add links to navbar
* Show/hide auth links correctly

#18. Auth Pt. 5 - Show/Hide Links
* Show/hide auth links in navbar correctly

#19. Refactor the routes
* Use express router to reorganize all routes

#20. Users + Comments
* Associate users and comments
* Save author's name to a comment automatically

#21. Users + Campgrounds
* Prevent an unauthenticated user from creating a campground
* Save username + id to newly created campground.

#22. Editing Bets
* Add Method-Override
* Add Edit Route for Bets
* Add Link to Edit Page
* Add Update Route
* Fix $set problem