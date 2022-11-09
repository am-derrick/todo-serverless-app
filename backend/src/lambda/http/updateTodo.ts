import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodoForUser } from "../../businessLogic/todo";

export const handler: APIGatewayProxyHandler = 
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

            const todoId = event.pathParameters.todoId;

            // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
            const auth = event.headers.Authorization;
            const jwt = auth.split(' ')[1];
            const todoUpdate: UpdateTodoRequest = JSON.parse(event.body);
            const updatedItem = await updateTodoForUser(todoUpdate, todoId, jwt);

            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Credentials': true
                },
                body: JSON.stringify({
                    "item": updatedItem
                }),
            };
};