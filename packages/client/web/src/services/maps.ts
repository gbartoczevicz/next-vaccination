import client from './http-client';

const ACCESS_TOKEN_MAP_BOX = `access_token=${process.env.REACT_APP_ACCESS_TOKEN_MAP_BOX}`;

export const fetchLocalMapBox = (local: string) => {
  client
    .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${local}.json?${ACCESS_TOKEN_MAP_BOX}`)
    .then((resp) => resp.data());
};
