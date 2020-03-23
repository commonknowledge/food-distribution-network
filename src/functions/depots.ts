import {
  APIGatewayProxyEvent,
  APIGatewayProxyCallback
} from 'aws-lambda'
import { getDepotGeoJSONFeatureset } from './lib/server';

export async function handler(
  event: APIGatewayProxyEvent,
  context: any,
  callback: APIGatewayProxyCallback
) {
  let statusCode = 200
  let data
  let errors: Error[] = []

  try {
    data = await getDepotGeoJSONFeatureset()
  } catch (e) {
    errors = errors.concat(e.toString())
    statusCode = 400
  }

  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data || false)
  })
}