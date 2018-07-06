[![Build Status](https://travis-ci.org/dondrzzy/the_business_center_react.svg?branch=master)](https://travis-ci.org/dondrzzy/the_business_center_react)
[![Coverage Status](https://coveralls.io/repos/github/dondrzzy/the_business_center_react/badge.svg?branch=master)](https://coveralls.io/github/dondrzzy/the_business_center_react?branch=master)


# The Business Center

This is an application that enables users to sign up and register their business in order to get access to an enormous pool of customers from all over the world.


>Application UI

The application is live [here](https://the-business-center.herokuapp.com).This is a `react` application.

>Application API

The application consumes an API hosted [here](https://the-business-center-api.herokuapp.com). This is a `python` application.


## Main application features

- User can sign up
- User can reset password
- User can login
- User can register a business
- User can edit and delete his/her own business
- User can view businesses
- User can review other businesses
- User can view business reviews


## Installation and Setup

##### Run the following commands to have a working version of the application locally

Navigate to the folder where you want to install the application

> Run `git clone https://github.com/dondrzzy/the_business_center_react.git`

cd into the application folder

> Run `cd <application folder>`

Install the application dependencies

> Run `npm install`

Change the **`baseUrl`** to your backend API in **`src/utils/baseUrl.js`**

Forexample

`
      getBaseUrl = () {
          return 'http://127.0.0.1:5000/api/v1/';
      }
`

## Start the application

Run `npm run start`

Go to `http://localhost:3000/`


##### Running tests and coverage

Testing the application

> Run `npm run test`

Testing coverage

> Run `npm run coverage`


### Author: Sibo Donald

> For more enquiries: Email me at sibo.donald16@gmail.com

