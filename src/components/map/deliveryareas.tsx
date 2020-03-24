/** @jsx jsx */
import { jsx } from 'theme-ui'
import * as React from 'react'
import { useMapEventHandlers } from './context';
import { GATSBY_MAPBOX_DELIVERY_AREA_SOURCE_LAYER_ID, GATSBY_MAPBOX_DELIVERY_AREA_ID_PROPERTY, GATSBY_MAPBOX_DELIVERY_AREA_NAME_PROPERTY } from '../../data/constants';
import { Layer } from 'react-mapbox-gl';
import { DeliveryArea } from '../../types/api';

export const DeliveryAreas: React.FC<{ areas: DeliveryArea[] }> = ({ areas }) => {
  useMapEventHandlers({
    onClick: (e, lnglat, features) => {
      const deliveryArea = features.find(
        f => f.sourceLayer === GATSBY_MAPBOX_DELIVERY_AREA_SOURCE_LAYER_ID
      )
      if (!deliveryArea || !deliveryArea.properties) {
        return
      }

      const id = deliveryArea.properties[GATSBY_MAPBOX_DELIVERY_AREA_ID_PROPERTY]
      if (!id) {
        return
      }

      console.info("Clicked LSOA ID:", id)
    }
  })

  const filter = [
    'match',
    ['get', GATSBY_MAPBOX_DELIVERY_AREA_ID_PROPERTY],
    areas.map(a => a.id),
    true,
    false
  ]

  const generatelabelForArea = (a: DeliveryArea): string => {
    return `${a.addressCount} addresses`
  }

  const areaLabels = [
    'match',
    ['get', GATSBY_MAPBOX_DELIVERY_AREA_ID_PROPERTY],
    ...areas.reduce((arr, a) => [...arr, a.id, generatelabelForArea(a)], [] as any[]),
    ""
  ]

  console.log(areaLabels)

  return (
    <React.Fragment>
      {/* deliveryArea fills */}
      <Layer
        key="delivery-area-fill"
        id="delivery-area-fill"
        sourceId="composite"
        sourceLayer={GATSBY_MAPBOX_DELIVERY_AREA_SOURCE_LAYER_ID}
        before="water"
        type="fill"
        paint={{
          'fill-color': '#74DD59',
          'fill-opacity': 0.5
        }}
        filter={filter}
      />
      <Layer
        key="delivery-area-symbol"
        id="delivery-area-symbol"
        sourceId="composite"
        sourceLayer={GATSBY_MAPBOX_DELIVERY_AREA_SOURCE_LAYER_ID}
        before="lsoa-fill"
        type="symbol"
        layout={{
          'text-field': areaLabels
        }}
        filter={filter}
      />
    </React.Fragment>
  )
}