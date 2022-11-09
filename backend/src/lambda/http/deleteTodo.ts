import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register'
import { deleteTodoForUser } from "../../businessLogic/todo";


export const handler: APIGatewayProxyHandler = 
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {    
        const todoId = event.pathParameters.todoId;

        // TODO: Remove a TODO item by id
        const auth = event.headers.Authorization;
        const jwt = auth.split(' ')[1];
        const dataToDelete = await deleteTodoForUser(todoId, jwt);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Credentials': true
            },
            body: dataToDelete,
        };
};