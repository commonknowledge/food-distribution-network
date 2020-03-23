/** @jsx jsx */
import { jsx } from "theme-ui"
import { Suspense, useContext, Fragment } from 'react';
import { fetchAreasThatNeedDeliveries } from '../data/apis';
import { BackgroundMap } from '../components/map/background';
import { DeliveryAreas } from '../components/map/deliveryareas';
import { GlobalMapContextProvider, GlobalMapContext } from '../components/map/context';

const requestAreaList = fetchAreasThatNeedDeliveries()

const IndexPage = () => {
  return (
    <GlobalMapContextProvider>
      <div sx={{ p: [0, 3] }}>
        <div sx={{
          zIndex: -1,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}>
          <BackgroundMap
            initialViewport={{
              "latitude": 51.55770998925126,
              "longitude": -0.15159831105417568,
              "zoom": 13.5,
            }}
          />
          <Suspense fallback={<h1>Loading map</h1>}>
            <DeliveryAreasMapLayer />
          </Suspense>
        </div>
        <div sx={{ bg: 'white', p: 4, float: 'left', width: ['100%', 300] }}>
          <h2>Deliver food to those in need</h2>
          <p>Food is stored in the depots. Addresses that need deliveries are marked in green.</p>
          <Suspense fallback={<h1>Looking for requested deliveries</h1>}>
            <h4>Areas that need food delivered</h4>
            <RequestAreaList />
          </Suspense>
        </div>
      </div>
    </GlobalMapContextProvider>
  )
}

const RequestAreaList: React.FC = () => {
  const areas = requestAreaList.read()
  return (
    <Fragment>
      {!!areas && Array.isArray(areas) && areas.length > 0 ? (
        <ul sx={{ pl: 3 }}>
          {areas.map((d, i) => <li key={i}>
            {d.addressCount} addresses to deliver to in {d.id}
          </li>)}
        </ul>
      ) : (
          <div>No areas require deliveries right now</div>
        )}
    </Fragment>
  )
}

const DeliveryAreasMapLayer = () => {
  const areas = requestAreaList.read()

  if (!areas || !Array.isArray(areas) || areas.length === 0) {
    return null
  }

  const { map } = useContext(GlobalMapContext)

  if (!map) {
    return null
  }

  return (
    <DeliveryAreas areas={areas} />
  )
}

export default IndexPage
