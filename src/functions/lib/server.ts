import 'cross-fetch/polyfill';
import { AIRTABLE_BASE_ID, AIRTABLE_API_KEY } from './../../data/constants';
import { AirtableResult, AddressFields, DepotFields, DeliveryArea } from '../../types/api';
import { featureCollection } from '@turf/helpers';
import { fetchJSON } from '../../helpers/fetch';
import { getBulkPostcodeData } from '../../data/apis';
import { isFuture, differenceInDays, isToday } from 'date-fns';

export async function getDepots() {
  return fetchJSON<AirtableResult<DepotFields>>(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Depots`, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`
    }
  })
}

export async function getAddresses() {
  return fetchJSON<AirtableResult<AddressFields>>(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Recipients`, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`
    }
  })
}

export async function getDepotGeoJSONFeatureset() {
  // Get depot data
  const depots = await getDepots()
  // Match depot postcodes to coordinates
  const postcodeData = await getBulkPostcodeData(depots.records.map(r => r.fields.Postcode))
  const depotFeatures = featureCollection(
    depots.records
      .map(d => {
        const matchedPostcodeData = postcodeData.find(P => P.query === d.fields.Postcode)
        return {
          type: 'Feature' as any,
          properties: {
            id: d.id,
            ...d.fields,
            postcodeData: matchedPostcodeData,
          },
          geometry: {
            type: 'point',
            coordinates: [
              matchedPostcodeData?.result.longitude,
              matchedPostcodeData?.result.latitude
            ] as [number, number]
          }
        }
      })
      .filter(d => d.geometry.coordinates.every(c => typeof c === 'number'))
  )
  return depotFeatures
}

export type DepotGeoJSONFeature = ThenArg<ReturnType<typeof getDepotGeoJSONFeatureset>>

export async function getDeliveryAreas() {
  // get list of addresses from airtable
  const addresses = await getAddresses()
  // filter addresses to those requiring a delivery to be scheduled in the next few days
  const filteredAddresses = addresses.records.filter(r => {
    const nextDeliveryDate = new Date(r.fields["Next delivery date"])
    const isSoonish = isFuture(nextDeliveryDate) && differenceInDays(nextDeliveryDate, new Date()) < 14
    return isToday(nextDeliveryDate) || isSoonish
  })
  // collect delivery postcodes and request postcodes.io data for each
  const postcodeData = await getBulkPostcodeData(filteredAddresses.map(r => r.fields.PostCode))
  // reduce postcodes to LSOA codes
  const codeMap = postcodeData
    .map(r => r.result.lsoa)
    // get count of LSOA codes
    .reduce((areas, code) => {
      areas[code] = areas[code] ? areas[code] + 1 : 1
      return areas
    }, {} as { [key: string]: number })
  const codes: DeliveryArea[] = Object.entries(codeMap).map(([id, addressCount]) => ({ id, addressCount }))
  return codes
}

export type DeliveryAreaResult = ThenArg<ReturnType<typeof getDeliveryAreas>>