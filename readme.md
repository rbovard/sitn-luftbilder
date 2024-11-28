# SITN Stationnements

## About

This app is used to compute the number of car parkings in construction projects.

## Getting started

Start a terminal (e.g. Windows PowerShell)

Set the working directory to the project directory (*sitn-luftbilder*)

Install using npm:
```
npm install
```

Build the app with:
```
npm run build
```

Run the app locally (on localhost) with:
```
npm start
```

## Docker deployment

To just build locally:
```
docker build -t sitn-luftbilder . 
```

To build and run locally:
```
docker compose up -d --build 
```

To build and run on remote server:

Set the **DOCKER_HOST** environment variable and launch the build/run :
```
$env:DOCKER_HOST="<PATH_TO_REMOTE_HOST>"
docker compose up -d --build
```