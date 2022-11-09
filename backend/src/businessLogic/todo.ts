import { TodoAccess } from "../dataLayer/TodosAccess";
import { parseUserId } from "../auth/utils";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { TodoItem } from "../models/TodoItem";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { TodoUpdate } from "../models/TodoUpdate";


// TODO: Implement business Logic
const todoAccess = new TodoAccess();
const uuidv4 = require('uuid/v4');

export function createTodoForUser(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const userId = parseUserId(jwtToken);
    const todoId =  uuidv4();
    const bucketName = process.env.ATTACHMENT_S3_BUCKET;
    
    return todoAccess.createTodoForUser({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${bucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}


export function updateTodoForUser(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return todoAccess.updateTodoForUser(updateTodoRequest, todoId, userId);
}

export function createPresignedUrl(todoId: string): Promise<string> {
    return todoAccess.createPresignedUrl(todoId);
}

export async function getTodoForUser(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return todoAccess.getTodoForUser(userId);
}

export function deleteTodoForUser(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return todoAccess.deleteTodoForUser(todoId, userId);
}