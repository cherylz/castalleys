# CastAlleys — A Simple and Clean Podcast Player

[castalleys.com](https://castalleys.com)

![Screenshot of the app](https://i.ibb.co/NW4Nf7D/app-screenshot.jpg)

### Table of Contents

[What Users Can Do with CastAlleys](https://github.com/cherylz/castalleys#what-users-can-do-with-castalleys)

[Technologies](https://github.com/cherylz/castalleys#technologies)

[Installation](https://github.com/cherylz/castalleys#installation)

[Credits](https://github.com/cherylz/castalleys#credits)

[Inspirations](https://github.com/cherylz/castalleys#inspirations)

[Get Support](https://github.com/cherylz/castalleys#get-support)

[Behind the Scenes](https://github.com/cherylz/castalleys#behind-the-scenes)
* [Why I Built CastAlleys](https://github.com/cherylz/castalleys#why-i-built-castalleys)
* [User Stories](https://github.com/cherylz/castalleys#user-stories)
* [Features](https://github.com/cherylz/castalleys#features)
* [Wireframes](https://github.com/cherylz/castalleys#wireframes)
* [General Approach](https://github.com/cherylz/castalleys#general-approach)

## What Users Can Do with CastAlleys

Just search for what you want to listen to and you are ready to play the show. You can use it on your phone without having to download an extra app since it's a progressive web app. To add some fun when enjoying its simplicity, you can choose what color you want the app in (only applicable to non-touchscreen users at this moment).

## Technologies

* Written in React, JavaScript, HTML5, and CSS3.
* Built with [Create React App](https://github.com/facebook/create-react-app), [React Router](https://github.com/ReactTraining/react-router), and [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/).
* Deployed to [Netlify](https://netlify.com).
* Others: Non-sensitive data is stored in the [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) of a web browser. [_.debounce from Lodash](https://lodash.com/docs/4.17.11#debounce) is used to create a debounced function to delay certain API requests.

## Installation

* Run `npm install` to install all the dependencies.
* Get your freemium X-RapidAPI-Key from https://rapidapi.com/ to be able to call the [ListenNotes API](https://rapidapi.com/listennotes/api/listennotes).
* Create a file named `apiKey.js` in the `src` folder. Paste this line `export const apiKey = "key";` into the file and replace the string key with your key grabbed from the previous step.
* Run `npm start` to make edits in the development mode.

## Credits

There are many free resources that helped me learn new things and solve problems for building this project, as well as the paid resources. Below are my thanks to some of the free resource providers.

_If you are reading this and you are learning to code, I hope the info below can save you some time of searching for free and good resources. [Shoot me an email](mailto:czcodes@gmail.com) if you want to know about the paid resources._

Thank you,
* [Wenbin Fang](https://www.listennotes.com/@wenbin/), for making [Listen Notes](https://www.listennotes.com/api/) - the podcast search & directory API.
* [Wes Bos](https://wesbos.com/), for teaching how to [build 30 things with vanilla Javascript](https://javascript30.com/).
* [Wes Bos](https://wesbos.com/) and [Scott Tolinski](https://www.scotttolinski.com/), for hosting [Syntax.fm](http://syntax.fm/) and talking about [Pre-launch Checklist](https://syntax.fm/show/088/pre-launch-checklist) and [Workflows](https://syntax.fm/show/051/our-workflows-design-development-git-and-deployment).
* the team behind [React](https://reactjs.org/), for sharing how to [think in React](https://reactjs.org/docs/thinking-in-react.html).
* the team behind [React Router](https://reacttraining.com/react-router/), for sharing [Learn Once, Route Anywhere](https://www.youtube.com/watch?v=Mf0Fy8iHp8k).
* [Canva](https://canva.com), for offering free visual design templates.
* [Justin Avery](https://twitter.com/justinavery), for making [Am I Responsive](http://ami.responsivedesign.is/) to check and present responsive designs.

## Inspirations
The navigation bar is inspired by https://www.patagonia.com/. The homepage cover image is inspired by https://www.spotify.com/.

## Get Support

If you have questions on how to get the app up and running or want to say hi, please [shoot me an email](mailto:czcodes@gmail.com).

## Behind the Scenes

### Why I Built CastAlleys

CastAlleys was built as a capstone project for an online coding bootcamp ([Altcademy](https://www.altcademy.com/)) I enrolled. My goals for this project were to build something at least I would use (I like podcasts) and something that allowed me to practice what I had learned and challenged me to learn more.

### User Stories

* Some podcast listeners who use computers more often than mobile phones want to search and play a show directly from their computer, without the need to take out their phone, unlock the screen and open an app. They will find CastAlleys handy to use since it is optimized for web users.
* There are also podcast listeners who want to keep their mobile apps to the minimum. They can use CastAlleys on their phone's home screen without downloading it since it is a progressive web app.

### Features

* Podcast search.
* Episode search with matched keyword(s) highlighted in titles, descriptions and transcripts.
* Episode search within a given podcast.
* Customizable theme color.
* Podcast streaming with playback controls.
* Podcast page view.
* Episode page view.

### Wireframes

In case you are interested in checking out wireframes, here are the sketches of the main interfaces I made with pen and paper for large screens: https://drive.google.com/drive/folders/10Y-2lI5bnXj8i2oV2Je0K8V1IdShHSvk?usp=sharing. For small screens, I coded the design.

### General Approach

#### Planning

* Steps: generate the idea, plan for the scope of work and timeline, make wireframes for main pages, plan for the component hierarchy in React, and set up the file structure based on the hierarchy.

#### Building

* Major steps: Build a static version. Then move on to build an interactive version by adding features one at a time.
* For each major step, repeat the process of 'build, test, deploy, debug, commit to GitHub'.

#### Quality

* For improving the app quality, [Lighthouse](https://developers.google.com/web/tools/lighthouse/) was used to audit pages.
* For improving the code quality, [ESLint with Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) and [Prettier](https://prettier.io/) were used.
