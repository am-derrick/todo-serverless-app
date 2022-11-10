import * as AWS from "aws-sdk";
import { TodoUpdate } from "../models/TodoUpdate";
import { Types } from 'aws-sdk/clients/s3';
import { TodoItem } from "../models/TodoItem";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

// TODO: Implement the dataLayer logic

export class TodoAccess {
    constructor(
        private readonly bucketClient: Types = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly dynamoDocClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET) {
    }

    async getTodoForUser(userId: string): Promise<TodoItem[]> {
        const attrExpressionValue = {":userId": userId};
        const attrExpressionName = {"#userId": "userId"};
        const keys = "#userId = :userId";
        const paramPayload = {
            TableName: this.todoTable,
            KeyConditionExpression: keys,
            ExpressionAttributeNames: attrExpressionName,
            ExpressionAttributeValues: attrExpressionValue
        };
        const result = await this.dynamoDocClient.query(
                paramPayload
            ).promise();

        console.log(`Getting Todo: ${result}`);

        console.log(this.bucketClient)
        console.log(this.bucketName)

        return result.Items as TodoItem[];
    }

    async createTodoForUser(todoItem: TodoItem): Promise<TodoItem> {
        const paramPayload = {
            TableName: this.todoTable, 
            Item: todoItem,
        };
        const result = await this.dynamoDocClient.put(
                paramPayload
            ).promise();

        console.log(`Creating Todo: ${result}`);

        return todoItem as TodoItem;
    }

    async updateTodoForUser(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
        const keys = {
            "userId": userId,
            "todoId": todoId
        };
        const attrExpressionValue = {
            ":a": todoUpdate['name'],
            ":b": todoUpdate['dueDate'],
            ":c": todoUpdate['done']
        };
        const attrExpressionName = {
            "#a": "name",
            "#b": "dueDate",
            "#c": "done"
        };
        const paramPayload = {
            TableName: this.todoTable,
            Key:keys,
            UpdateExpression: "set #a = :a, #b = :b, #c = :c",
            ExpressionAttributeNames: attrExpressionName,
            ExpressionAttributeValues: attrExpressionValue,
            ReturnValues: "ALL_NEW"
        };
        const result = 
            await this.dynamoDocClient.update(paramPayload).promise();

        console.log(`Updating: ${result}`);

        return result.Attributes as TodoUpdate;
    }

    async deleteTodoForUser(todoId: string, userId: string): Promise<string> {
        const keys = {
            "userId": userId,
            "todoId": todoId
        };
        const paramPayload = {
            TableName: this.todoTable,
            Key: keys,
        };
        const result = 
            await this.dynamoDocClient.delete(paramPayload).promise();

        console.log(`Deleting: ${result}`);

        return null;
    }

    async updateAttachmentUrl(userId: string, todoId: string, attachmentUrl: string): Promise<void> {
        await this.dynamoDocClient.update({
          TableName: this.todoTable,
          Key: {
            userId,
            todoId
          },
          UpdateExpression: 'set attachmentUrl = :attachmentUrl',
          ExpressionAttributeValues: {
            ':attachmentUrl': attachmentUrl
          }
        }).promise()
      }

    /* async createPresignedUrl(attachmentId: string): Promise<string> {
        const url = this.bucketClient.getSignedUrl(
            'putObject', {
                Bucket: this.bucketName,
                Key: attachmentId,
                Expires: 1000,
            }
        );

        console.log(`Signed URL: ${url}`);

        return url as string;
    }

    async getAttachmentBucketUrl(attachmentId: string): Promise<string> {
        return `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
      } */
}