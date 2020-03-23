import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from './constants';
import { suspendablePromise, fetchJSON, batchedPromise } from './fetch';
import { DeliveryArea, AirtableResult, PostcodesResult } from '../types/api';

export const fetchAreasThatNeedDeliveries = suspendablePromise(async (): Promise<DeliveryArea[]> => {
  return fetchJSON(process.env.GATSBY_FUNCTIONS_URL + '/delivery-areas')
})

export async function getAddresses() {
  return fetchJSON<AirtableResult<{ PostCode: string }>>(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Recipients`, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`
    }
  })
}

const POSTCODES_IO_BULK_QUERY_LIMIT = 100

export async function getBulkPostcodeData(codes: string[]) {
  return batchedPromise(
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
}