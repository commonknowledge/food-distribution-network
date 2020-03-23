/** @jsx jsx */
import { jsx } from 'theme-ui'
import * as React from 'react'
import { Marker } from 'react-mapbox-gl';
import { DepotGeoJSONFeature } from '../../functions/lib/server';

export const Depots: React.FC<{ depots: DepotGeoJSONFeature }> = ({ depots }) => {
  return (
    <React.Fragment>
      {depots.features.map(depot => {
        return (
          <Marker
            key={depot.id}
            coordinates={depot.geometry.coordinates}
            anchor="bottom"
          >
            <div sx={{
              position: 'relative',
              width: '100%',
              pointerEvents: 'none'
            }}>
              <div className='pin' sx={{
                pointerEvents: 'all',
                textAlign: 'center',
                fontSize: 8,
                lineHeight: 0
              }}>📦</div>
              <div className='label' sx={{
                position: 'absolute',
                top: '30px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}>
                <div sx={{
                  boxSizing: 'border-box',
                  pointerEvents: 'all',
                  width: 240,
                  bg: 'white',
                  borderRadius: 4,
                  fontSize: 2
                }}>
                  <div sx={{ p: 3 }}>
                    <div>
                      <b>Food depot</b> &middot;&nbsp;
                      <span>{depot.properties?.Address}</span>
                    </div>
                    {depot.properties["Volunteer link"] && (
                      <a href={depot.properties["Volunteer link"]} target='__blank' sx={{ variant: 'link.block' }}>
                        🤚 Volunteer to deliver
                      </a>
                    )}
                    {depot.properties["Volunteer link"] && (
                      <a href={`https://www.google.com/maps/search/${encodeURI(depot.properties.Address)}`} target='__blank' sx={{ variant: 'link.block' }}>
                        🗺 Google maps
                      </a>
                    )}
                    {depot.properties["Contact phone"] && (
                      <a href={'tel:' + depot.properties["Contact phone"]} sx={{ variant: 'link.block' }}>
                        📞 Call
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Marker>
        )
      })}
    </React.Fragment >
  )
}