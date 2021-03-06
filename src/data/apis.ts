import { suspendablePromise, fetchJSON, batchedPromise } from '../helpers/fetch';
import { DeliveryArea, PostcodesResult, PostcodeResultElement } from '../types/api';
import { tuple } from '../helpers/array';
import { DepotGeoJSONFeature, DeliveryAreaResult } from '../functions/lib/server';

export const fetchAreasThatNeedDeliveries = suspendablePromise(async (): Promise<DeliveryAreaResult> => {
  return fetchJSON(process.env.GATSBY_FUNCTIONS_URL + '/delivery-areas')
})

export const fetchDepots = suspendablePromise(async (): Promise<DepotGeoJSONFeature> => {
  return fetchJSON(process.env.GATSBY_FUNCTIONS_URL + '/depots') as any
})

const POSTCODES_IO_BULK_QUERY_LIMIT = 100

export async function getBulkPostcodeData(codes: string[]) {
  const data = await batchedPromise(
    codes,
    POSTCODES_IO_BULK_QUERY_LIMIT,
    postcodes => fetchJSON<PostcodesResult>("https://api.postcodes.io/postcodes", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postcodes })
    })
  )
  return data
    .reduce((arr, res) => {
      if (!!res.error || !Array.isArray(res.result)) {
        throw new Error(res.error)
      }
      return [...arr, ...res.result]
    }, [] as PostcodeResultElement[])
}

export const convertPostcodeToCoordinates = async (
  postcode: string
): Promise<[number, number]> => {
  const res = await fetch(`https://api.postcodes.io/postcodes/${postcode}`)
  if (!res.ok || res.status !== 200) throw new Error('Failed to get postcode')
  const data = await res.json()
  if (data.status !== 200 || !data.result) {
    throw new Error('Failed to validate postcode')
  }
  return [data.result.latitude, data.result.longitude].reverse() as any
}

export const convertCoordinatesToPostcode = async ({
  longitude,
  latitude
}: Coordinates): Promise<string> => {
  const res = await fetch(
    `https://api.postcodes.io/postcodes?lon=${longitude}&lat=${latitude}&radius=1000m&limit=1`
  )
  if (!res.ok || res.status !== 200) throw new Error('Failed to get postcode')
  const data = await res.json()
  if (
    data.status !== 200 ||
    !data.result ||
    !Array.isArray(data.result) ||
    data.result.length === 0
  )
    throw new Error('Failed to validate postcode')
  return data.result[0].postcode
}

export const convertLocationToCoordinates = async (
  location: string
): Promise<[number, number]> => {
  const encodedLocation = encodeURIComponent(location)
  const res = await fetch(
    `https://nominatim.openstreetmap.com/search?q=${encodedLocation}&format=geojson&countrycodes=gb&limit=1&email=digital@peoplesmomentum.com`
  )
  const data = await res.json()
  if (data.features.length === 0)
    throw new Error('Failed to find co-ordinates for location')
  return data.features[0].geometry.coordinates
}

export const UKBounds = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: tuple(-3.578428221023512, 54.72814098390994)
  }
}
