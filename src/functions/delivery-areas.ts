import 'cross-fetch/polyfill';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyCallback
} from 'aws-lambda'
import { DeliveryArea, PostcodeResultElement } from '../types/api';
import { getAddresses, getBulkPostcodeData } from '../data/apis';

export async function handler(
  event: APIGatewayProxyEvent,
  context: any,
  callback: APIGatewayProxyCallback
) {
  let statusCode = 200
  let data
  let errors: Error[] = []

  try {
    // get list of addresses from airtable
    const addresses = await getAddresses()
    // collect delivery postcodes and request postcodes.io data for each
    const postcodeData = await getBulkPostcodeData(addresses.records.map(r => r.fields.PostCode))
    // reduce postcodes to LSOA codes
    const codeMap = postcodeData
      .reduce((arr, res) => {
        if (!!res.error || !Array.isArray(res.result)) {
          throw new Error(res.error)
        }
        return [...arr, ...res.result]
      }, [] as PostcodeResultElement[])
      .map(r => r.result.lsoa)
      // get count of LSOA codes
      .reduce((areas, code) => {
        areas[code] = areas[code] ? areas[code] + 1 : 1
        return areas
      }, {} as { [key: string]: number })
    const codes: DeliveryArea[] = Object.entries(codeMap).map(([id, addressCount]) => ({ id, addressCount }))
    data = { codes }
  } catch (e) {
    errors = errors.concat(e.toString())
    statusCode = 400
  }

  callback(null, {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data?.codes || [])
  })
}