import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const bucketName = process.env.ATTACHMENT_S3_BUCKET

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})


export function createAttachmentPresignedUrl(attachmentId: string): string {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: 1000
  })
}

export function getAttachmentBucketUrl(attachmentId: string): string {
  return `https://${bucketName}.s3.amazonaws.com/${attachmentId}`
}