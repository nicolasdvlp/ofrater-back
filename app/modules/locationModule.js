"use strict";

const config = require('./../../config'),
  fetch = require('node-fetch');

/**
 * @version 30/05/2021
 * @author Nicolas 
 * @param {string} input 
 */
const getCitysAndZips = async function (input) {

  let cityArray;

  if (typeof parseInt(input) === 'number' && input.length === 5) { //if it's a number
    await fetch(`${config.gouvGeoAPI.zipCode}${parseInt(input)}`)
      .then(res => res.json())
      .then(json => {
        if (!!json)
          cityArray = json.map(city => (
            { city: city.nom, zipCode: city.codesPostaux[0] }
          ));
      })
  } else {
    await fetch(`${config.gouvGeoAPI.cityName}${input}`)
      .then(res => res.json())
      .then(json => {
        if (!!json)
          cityArray = json.map(city => (
            { city: city.nom, zipCode: city.codesPostaux[0] }
          ));
      });
  }
  return cityArray
}

const getGPSCoordinates = async function (input, callback = (i) => i) {

  let result;
  let uri = await callback(input);
  await fetch(`${config.gouvGeoAPI.geoPosition}${uri}`)
    .then(res => res.json())
    .then((json) => {
      if (json?.features) {
        // result = [latitude, longitude]
        result = json.features[0].geometry.coordinates
      }
    });
  return result
}

module.exports = { getCitysAndZips, getGPSCoordinates }

/*
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
    }

    function deg2rad(deg) {
    return deg * (Math.PI/180)
}
*/