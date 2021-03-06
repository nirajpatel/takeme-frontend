takeme: Frontend
===============
####Based on your current location, we will show you the next available public transit to take you wherever you want to go.

**Live application:** http://takeme.s3-website-us-east-1.amazonaws.com. Note: Automatic user geolocation works; however, at times it is slow. If at first it does not work after a few seconds, please try again or manually input origin.

**Frontend:** The frontend is coded in HTML, CSS, and Javascript. Bootstrap has been used for easy styling, and has been tweaked to be more clean/flat and to fit the takeme branding scheme. AngularJS is used for dynamic web content consumption.

1. **HTML (./)**
  * **index.html:** Index file for takeme. Holds base website structure. Forms are injected into this HTML file.
  * **form.html:** Form base representation.
  * **form-start.html:** Start of form.
  * **form-origin.html:** Gets origin information from user automatically, or manually if location cannot be retrieved.
  * **form-destination.html:** Gets destination information from user.
  * **form-result.html:** Displays trip result information, or error if no trip found between origin and destination/any other error.
2. **CSS (./css)**
  * **bootstrap.css:** Bootstrap base file.
  * **bootstrap-theme.css:** Boostrap theme extension file.
3. **JS (./js)**
  * **app.js:** AngularJS file containing all form logic and serves as a client that consumes RESTful backend.
4. **Images (./img)**

**Experience:** I have had experience for several years with HTML and CSS. This is my first time writing javascript code. I chose to use AngularJS as it seemed a bit easier to pick up. Due to time constraints I could not abstract app.js out to seperate files based on controllers, factories, etc. Given more time I would have split app.js into several files.

**Extension points:** 1, display individual steps for an itinerary on the results page (data already exists in backend). 2, seperate app.js into smaller javascript files divided by controllers, factories, etc. 3, mostly mobile friendly; however, form inputs need to be on separate lines on mobile. 