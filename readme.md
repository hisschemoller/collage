# Collage App

This application generates photo collages, compositions of each time three randomly chosen images.

It is a Node.js web application that loads images from directories on the local file system and shows the generated collage on a canvas element in the browser.

## Requirements

* Mac OS X, Windows, or Linux
* A web browser
* [Node.js](https://nodejs.org) I have 8.0.0 installed, but older versions might work just as well.

## Quick start

#### 1. Get the latest version

Clone the files from this Git repository.

#### 2. Switch to the app's directory

```shell
$ cd collage
```

#### 3. Install the app's dependencies with either npm or yarn

```shell
$ npm install
```
or
```shell
$ yarn install
```

#### 4. Edit the configuration file

Open `config.json` in a plain text editor

```json
{
    "width": 1600,
    "height": 900,
    "imageDirectories": [
        "../../path/to/an/image/directory/",
        "../../path/to/another/image/directory/"
    ]
}
```
"width" and "height" determine the size of the generated collage in pixels.
"imageDirectories" is a comma separated list of directories that contain the images you want to use for the collages. Image paths can be relative, as shown in the example.

#### 5. Start the Node.js server and the application

```shell
$ node index.js
```

#### 6. Open the application in your web browser

The app will be available on [http://localhost:3000/](http://localhost:3000/).



