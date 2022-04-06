# Patient Registration

## Configuration

Before you can launch the project, you need to configure a few things:

#### Setting up Auth0:

This project uses Auth0 to handle managing users and authorization.
Thankfully, Auth0 is extremely easy to set up.

First, navigate to https://auth0.com/signup and create a free account.

Once you are logged in, go to the **Applications** section of the dashboard and click "+ Create Application"
  * Select "Single Page Web Applications" from the modal popup and name the Application something like "Patient Registration" (name is up to you)
  * Click "Create"
  * Click on "Settings"
  * Scroll down and fill in Allowed Callback URLs, Allowed Logout URLs, and Allowed Web Origins with http://localhost:3000
  * Click "Save changes"

Now, scroll up, and copy some values into the React App:
  * Copy **Client ID** and **Domain** into the `config.json` file in the `src` directory

Next, set up the Auth0 API by going to the **APIs** section of the dashboard and clicking "+ Create API"
  * Name the API whatever you like (ex. Patient Registration API)
  * Enter a URL identifier (this is not a real URL, and Auth0 won't ever connect to it, so it can be whatever you like ex: https://patient-registration)
  * Leave the signing Algorithm as RS256
  * Click "Create"

Finally, click on **Quick Start** and copy some values from the C# code into the server file:
  * Copy the value for **options.Audience** into the value for **auth0_identifier** in the `main.go` file in the `server` directory
  * Copy the value for **options.Authority** into the value for **auth0_api_domain** in the `main.go` file in the `server` directory

With the Auth0 Configuration finished, all that remains is to have a MySQL server running locally to run the application.

#### Setting up MySQL:

Make sure MySQL is installed and running on your machine.

If you are on a Mac, you can go to Preferences > MySQL to Start / Stop the MySQL server

* Copy your MySQL Username and Password into the values **db_user** and **db_pass** in the `main.go` file in the `server` directory

With the configuration finished, you are ready to launch the application.

## Launching the Application

In the project directory, you can run:

### `npm start`

This runs the React frontend of the app.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

In another terminal window, run:
### `cd server`
### `go run main.go`

This runs the server application which the React frontend will communicate with and which serves Appointment data and License images for the application.

## Using the Application

There are two main workflows in the Patient Registration Application
1. Creating Appointments (any unauthenicated user can do this)
2. Viewing Appointments (only a authenticated user can do this)

To create an appointment, simply navigate to the homepage and click 'Register for an Appointment' and follow the steps listed on the form

To view created appointments, click 'Sign in with Auth0' from the homepage instead and create an account through the Auth0 registation process.
Once you are registered with the site, you can click 'View Appointments' to see a list of all upcoming and past appointments, as well as click on an individual appointment to see more details
