# Secret Santa Mailer
[![Known Vulnerabilities](https://snyk.io/test/github/DeanGaffney/secret-santa-mailer.git/badge.svg)](https://snyk.io/test/github/DeanGaffney/secret-santa-mailer.git) [![Build Status](https://travis-ci.com/DeanGaffney/secret-santa-mailer.svg?branch=master)](https://travis-ci.com/DeanGaffney/secret-santa-mailer)




A Node.js application which pairs users together and sends emails to the secret santa's with the name of the person they must buy a gift for.

## Dependencies
Run the following commands to retrieve dependencies
```code
$ git clone https://github.com/DeanGaffney/secret-santa-mailer.git
$ cd secret-santa-mailer
$ npm install
```
Run the following to make sure everything is working as expected:
```code
$ npm test
```
All the tests should pass.

## Specifying Users
To specify the users you want involved do the following:
```code
$ cd data/
$ touch users.json
```
Inside the data folder there is ***users.schema.json*** file which shows you the json array schema for your users to follow. It is a json array of objects containing a ***'name'*** key and an ***'email'*** key. Fill in the newly created ***users.json*** file with your desired users following the structure shown in the ***users.schema.json*** file.

## Attaching Images
To attach an image of the user to the email do the following:
* Create an images folder in the root of the project with the following command:
    ```code
    $ mkdir images
    ```
* Copy the desired images into the `images` folder where each image is named in the following format `name.jpg` i.e the image is the user's name in the `users.json` file.

## Setting Environment Variables
In the root of the project create a ***.env*** file based off of the supplied ***.env.schema*** file. Add in the following environment variables.

* EMAIL_ADDRESS=sample@gmail.com  (the email address to use for sending the emails to other users)
* EMAIL_PASSWORD=password        (the password for the email address sending the emails)
* EMAIL_SERVICE=gmail             (the service used for sending the emails)

### Gmail Password
* It's recommended that you generate an `App Password` and use that instead of your email password.
* Using an App Password will allow you to keep 2FA enabled on your account, and prevent you from having to allow less secure apps interact with your google account.
* To generate an App Password do the following
  * Go to `https://myaccount.google.com/security`
  * Go to `Signing in to Google`
  * Go to `App Passwords`
  * Generate an App Password
  * Use this password for your `EMAIL_PASSWORD` environment variable.
## Running the script
Once you have your ***users.json*** file and ***.env*** file in place you can run the program by running the following:
```code
$ npm start
```

## Logs
Two logs are generated in the root of the project once the program is run.
* ***combined.log***  - logs the json objects representing each user and the other user they were paired with. A log of the acceptance of the emails from each user is also logged into this file. It's a good idea to check this file after running to make sure every user has been included correctly.
* ***error.log*** - in the event an error occurs due to an invalid email address or the rejection of an email for another reason, the error will be logged into this file.

## Notes
The code is currently only tested using ***gmail*** as a service.