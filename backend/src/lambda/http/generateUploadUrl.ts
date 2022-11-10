import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import { addAttachmentToTodo, createPresignedUrl } from "../../businessLogic/todo";
import { getUserId } from '../utils';
import * as uuid from "uuid"

export const handler: APIGatewayProxyHandler = 
async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

        const todoId = event.pathParameters.todoId;
        const userId = getUserId(event)
        const attachmentId = uuid.v4()
        // TODO: Return a presigned URL to upload a file for a TODO item with the provided id        
        const signedURL = createPresignedUrl(attachmentId);
        await addAttachmentToTodo(userId, todoId, attachmentId)

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