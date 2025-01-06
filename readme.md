# SITN Luftbilder

## About

This app is used to overlay swisstopo aerial imagery with the SITN basemap.

The base URL has to be called using three parameters:

* url: the orthophoto URL has given in the swisstopo metadata (see links on that
page: https://www.swisstopo.admin.ch/fr/imagesaerienne-en-telechargement-20241120)
* east: the east coordinate of the image center
* north: the north coordinate of the image center

Hence, the called URL would be something like:
* Docker: http://localhost:5024/?east=2559158.53&north=1203713.73&url=https://data.geo.admin.ch/ch.swisstopo.lubis-luftbilder_schwarzweiss/lubis-luftbilder_schwarzweiss_000-321-260/lubis-luftbilder_schwarzweiss_000-321-260_op_2056.tif
* Dev mode: http://localhost:5173/?east=2559158.53&north=1203713.73&url=https://data.geo.admin.ch/ch.swisstopo.lubis-luftbilder_schwarzweiss/lubis-luftbilder_schwarzweiss_000-321-260/lubis-luftbilder_schwarzweiss_000-321-260_op_2056.tif

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
cp .env.sample .env
docker compose build
```

To build and run locally:
```
docker compose up -d --build 
```

To build and run on remote server:

Set the **DOCKER_HOST** environment variable and launch the build/run :
```
docker compose build
docker compose push
$env:DOCKER_HOST="<PATH_TO_REMOTE_HOST>"
docker compose pull
docker compose up -d
```