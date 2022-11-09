import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import { createPresignedUrl } from "../../businessLogic/todo";

export const handler: APIGatewayProxyHandler = 
async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

        const todoId = event.pathParameters.todoId;

        // TODO: Return a presigned URL to upload a file for a TODO item with the provided id        
        const signedURL = await createPresignedUrl(todoId);

        return {
            statusCode: 202,
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                uploadUrl: signedURL,
            })
        };
};