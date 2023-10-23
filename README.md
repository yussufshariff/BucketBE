# BucketBE

Welcome to Buckit Bucket! An app which allowes users to create their personal travel and adventure bucket list.

## Description

The Back-end for our group project, used Express.js to create our API with MongoDB to hold our destination data, used Mongoose to connect our database with Node.js. 

We took a full TDD (Test Driven Development) approach using Jest and Supertest. You can also use the command `npmstart` to start the app on a local port and use software such as Insomnia to test the development database/

## Here are the API endpoints

## GET

* /api/locations
* /api/:locations/comments
* /api/:locations
* /api/users/:user
* /api/users/:user/list

## POST

* /api//users
* /api/locations
* /api/comments

## PATCH

* /api/:user/list
* /api/:commentsID/votes/:user
* /api/:user/:profilepicture
* /api/:user/:location/visited

## DELETE

* /api/users/:user
* /api/comments/:comment
* /api/locations/:location
* /api/:user/list/locationId

## Getting Started

* To use this repository on your local machine you can for the repository run the command `git clone add_url_here`
* You can then install the required dependencies by running `npm install` in your terminal

## Links

Here is the link to our front end repo, where you can also view a walkthrough of our app:

https://github.com/yussufshariff/BucketFE
