/** @jsx jsx */
import { jsx } from "theme-ui"
import { Suspense } from 'react';
import { fetchAreasThatNeedDeliveries } from '../data/apis';

const requestAreaList = fetchAreasThatNeedDeliveries()

const IndexPage = () => {
  return (
    <div>
      <h1>This is Common Knowledge.</h1>
      <div>
        <h4>Areas that need food delivered</h4>
        <Suspense fallback={<h1>Loading profile...</h1>}>
          <RequestAreaList />
        </Suspense>
      </div>
    </div>
  )
}

const RequestAreaList: React.FC = () => {
  const areas = requestAreaList.read()

  return (
    !!areas && Array.isArray(areas) && areas.length > 0 ? (
      <ul>
        {areas.map((d, i) => <li key={i}>{JSON.stringify(d)}</li>)}
      </ul>
    ) : (
        <div>No areas require deliveries right now</div>
      )
  )
}

export default IndexPage
