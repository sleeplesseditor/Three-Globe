# Three.js 3D Globe

#### Table of Contents
- [Description](#description)
- [Example Screenshots](#example-screenshots)
- [Updates from Original Project](#updates-from-original-project)
- [Running the App Locally](#running-the-app-locally)
- [Planned Improvement Work](#planned-improvement-work)

## Description
A 3D globe displaying data about different countries (i.e. population size, economy, political systems), originally built as part of the coursework for a [Udemy course on using shaders with Three.js](https://www.udemy.com/course/intermediate-threejs-with-shaders). The 3D globe displays national population sizes represented by prisms, with further information provided in a dialog when the user clicks on a prism.

The app is live and available to use [here](https://sleeplesseditor.github.io/Three-Globe/).

## Example Screenshots
<img width="1918" height="842" alt="three-globe" src="https://github.com/user-attachments/assets/98a2d2a4-98b1-4188-ab17-6a7c894c098d" />

## Updates from Original Project
- Converted original JavaScript version to use React and Vite, with TypeScript.
- Added zoom event listener for globe element
- Created dialog element, with data provided by [REST Countries API](https://restcountries.com/). Displayed when user clicks on country marker.

## Running the App Locally
- You will need to get your own API key for use of the [REST Countries API](https://restcountries.com/) content, and add it your own .env file.
- CD into the repo folder
- Run `npm install`
- Run `npm run dev`

## Planned Improvement Work
- Updating media queries for better mobile responsiveness
- Add additional event listener to allow for optional closing of dialog element by clicking outside of the dialog
