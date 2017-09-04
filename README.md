InterActor is a web application for creating and collaboratively editing network diagrams.

It's built using Django (for handling of user accounts, simple management of user projects etc.) and JavaScript (React, D3) for the front end.

The interface between Django and the single page React app is deliberately simple. See templates/interactor_app/project.html to see how a project is loaded.

Once a project is loaded, the SPA takes care of all user interaction and uses the API (see the interactor_api Django app) to interact with the Django app.

The SPA can be run standalone in order to reduce development cycle time. Go to interactor_app/interactor_spa and run: npm start (The SPA is built using createreactapp.)

(Functions such as save project will not operate when running the SPA in standalone mode.)

To build the SPA and copy the bundle to the Django app run buildandcopytodjango.sh
