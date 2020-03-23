import {
  APIGatewayProxyEvent,
  APIGatewayProxyCallback
} from 'aws-lambda'

export async function handler(
  event: APIGatewayProxyEvent,
  context: any,
  callback: APIGatewayProxyCallback
) {
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      hello: 'world'
    })
  })
}