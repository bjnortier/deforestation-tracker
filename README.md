

## Requirements

- NodeJS
- A Mapbox token
- ProbaV HDF5 files
- HDF5

## Get the ProbaV HDF5 files

The Terms of User prohibits me from posting the data files to a network so you'll unfortunately have to copy them yourself.

Navigate to [http://proba-v.vgt.vito.be/en/product-types](http://proba-v.vgt.vito.be/en/product-types), choose 1 KM (free data), then click on "S10-TOC-NDVI - Global 10-daily composites, Top-Of-Canopy, Normalized Difference Vegetation Index band", or you can use [this link](http://www.vito-eodata.be/PDF/portal/Application.html#Browse;Root=581615;Collection=1000109;Time=NORMAL,NORMAL,-1,,,-1,,) if the website has changed.

A free signup or required to download the HDF5 files, so register first (top right-hand corner).

We'll be looking at South Africa, so you can draw a rectangle on the map or choose the following Region Of Interest (ROI):

Latitude: from -20 to -28
Longitude: from 10 to 35

The under Date we'll choose 11/02/2019-11/02/2019 ***Note United States Users - the date format is not US, but World format, i.e. day first.***

Click on "Search".

There should be one row in the table, with Product ID "PV_S10_TOC_NDVI-20190211_1KM_V101".

Select the left-most checkbox and click "Order now..."

You will receive an email with the FTP link to download.

Once you have downloaded the files, copy them to resources/

```
$ ls -lhR resources/
total 0
drwx------  14 bjnortier  staff   448B Feb 27 16:47 PV_S10_TOC_NDVI_20190211_1KM_V101

resources//PV_S10_TOC_NDVI_20190211_1KM_V101:
total 12336
-rw-------@ 1 bjnortier  staff    51K Feb 27 16:44 INSPIRE.xml
-rw-------@ 1 bjnortier  staff   531B Feb 27 16:44 PROBAV_S10_TOC_20190211_1KM_NDVI_V101.VRG
-rw-------@ 1 bjnortier  staff    13K Feb 27 16:44 PROBAV_S10_TOC_20190211_1KM_NDVI_V101.xml
-rw-------@ 1 bjnortier  staff   806K Feb 27 16:44 PROBAV_S10_TOC_X19Y09_20190211_1KM_NDVI_V101.hdf5
-rw-------@ 1 bjnortier  staff   734K Feb 27 16:44 PROBAV_S10_TOC_X19Y10_20190211_1KM_NDVI_V101.hdf5
-rw-------@ 1 bjnortier  staff   134K Feb 27 16:44 PROBAV_S10_TOC_X19Y11_20190211_1KM_NDVI_V101.hdf5
-rw-------@ 1 bjnortier  staff   954K Feb 27 16:44 PROBAV_S10_TOC_X20Y09_20190211_1KM_NDVI_V101.hdf5
-rw-------@ 1 bjnortier  staff   913K Feb 27 16:44 PROBAV_S10_TOC_X20Y10_20190211_1KM_NDVI_V101.hdf5
-rw-------@ 1 bjnortier  staff   294K Feb 27 16:44 PROBAV_S10_TOC_X20Y11_20190211_1KM_NDVI_V101.hdf5
-rw-------@ 1 bjnortier  staff   950K Feb 27 16:44 PROBAV_S10_TOC_X21Y09_20190211_1KM_NDVI_V101.hdf5
-rw-------@ 1 bjnortier  staff   908K Feb 27 16:44 PROBAV_S10_TOC_X21Y10_20190211_1KM_NDVI_V101.hdf5
-rw-------@ 1 bjnortier  staff   236K Feb 27 16:44 PROBAV_S10_TOC_X21Y11_20190211_1KM_NDVI_V101.hdf5
```

There are 9 HDF files in the ROI.

## HDF5

Follow the instruction on [https://www.hdfgroup.org/downloads/hdf5/](https://www.hdfgroup.org/downloads/hdf5/)

or if you're on a Mac you can install via Homebrew:

```$ brew install hdf5```

## Install all app dependencies

```$ npm i```

## Create PNG files for each HDF5 tile

```$  node src/scripts/createPNGs.js```


## Fetch the country boundary GeoJSON data

```
$ npm install -g data-cli
$ data get https://datahub.io/core/geo-countries
$ data info core/geo-countries
$ tree core/geo-countries
```
