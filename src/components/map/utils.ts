import mapboxgl from 'mapbox-gl'
import { IMapHelpers } from './core';
import { GATSBY_MAPBOX_DELIVERY_AREA_ID_PROPERTY, GATSBY_MAPBOX_DELIVERY_AREA_SOURCE_LAYER_ID } from '../../data/constants';

export const getDeliveryArea = (map: mapboxgl.Map, id: string) => {
  return getDeliveryAreas(map).find(
    d => d.properties![GATSBY_MAPBOX_DELIVERY_AREA_ID_PROPERTY] === id
  )
}

export const getDeliveryAreas = (map: mapboxgl.Map) =>
  map.querySourceFeatures('composite', {
    sourceLayer: GATSBY_MAPBOX_DELIVERY_AREA_SOURCE_LAYER_ID
  })
