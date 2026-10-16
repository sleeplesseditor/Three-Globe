# Three.js 3D Globe

#### Table of Contents
- [Description](#description)
- [Example Screenshots](#example-screenshots)
- [Updates from Original Project](#updates-from-original-project)
- [Running the App Locally](#running-the-app-locally)

## Description
A 3D globe displaying global population data, as part of the coursework for a [Udemy course on using shaders with Three.js](https://www.udemy.com/course/intermediate-threejs-with-shaders). The 3D globe with population sizes represented by prisms, and popovers for precise figures.

## Example Screenshots
![ezgif-3-8a1d89b42b](https://user-images.githubusercontent.com/25869284/222009278-0d47e932-ef85-487a-8bb6-558b9a1d6125.gif)

## Updates from Original Project
- Converted original JavaScript version to use React and Vite, with TypeScript.
- Created dialog element, with data provided by [REST Countries API](https://restcountries.com/). Displayed when user clicks on country marker.

## Running the App Locally
- You will need to get your own API key for use of the [REST Countries API](https://restcountries.com/) content, and add it your own .env file.
- CD into the repo folder
- Run `npm install`
- Run `npm run dev`
