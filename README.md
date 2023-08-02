# Reddit Bookmark Manager

Reddit Bookmark Manager is a web-app that allows users to organize their saved Reddit posts/comments/links in custom categories. Previously, only Reddit premium users had access to such a feature. This web-app allows users to do so without affecting their Reddit account. This web-app uses it's own database to store the saved data so if a user accidentally removes a save from their Reddit account, it would still exist in any category it is saved in.

This repository is the source code for the client-side. To view server-side source code, visit [reddit-bm-api](https://github.com/ryanpv/reddit-bm-api)

![Reddit-bookmark-manager-screenshot](https://raw.githubusercontent.com/ryanpv/reddit-bookmark-manager-client/public/Reddit-bookmark-manager-screenshot.jpg)

## Features
* Sign up / login
* Sign in with google
* Create custom categories
* Log into Reddit and view saved list
* Search Reddit saves
* Save Reddit saves into custom categories
* Search saved content in all user created categories
* Delete user created categories
* Remove saves from user created categories

## Technologies

### Front-end
* ReactJS
* Firebase - user authentication

### Back-end
* ExpressJS
* Axios - network requests to Reddit API
* Firebase-admin - verify user token 
* MongoDB

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).