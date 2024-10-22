import json
import base64
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3')

# Create a DynamoDB table object
table = dynamodb.Table('UsersTable')

def lambda_handler(event, context):
    # Parse input data from the API Gateway event
    body = json.loads(event['body'])
    email = body['email']
    name = body['name']
    password = body['password']  # You should hash the password in a real app
    profile_image = body['profileImage']

    # Check if email already exists in DynamoDB
    try:
        response = table.get_item(Key={'email': email})
        if 'Item' in response:
            return {
                'statusCode': 409,  # Conflict
                'body': json.dumps({'error': 'Email is already registered'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Allow-Credentials': 'true'
                }
            }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
            }
        }

    # Save profile image to S3
    try:
        image_data = base64.b64decode(profile_image)
        s3_client.put_object(
            Bucket='profile-imagesbucket',
            Key=email,
            Body=image_data,
            ContentType='image/jpeg'
        )
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
            }
        }

    # Save user details in DynamoDB
    try:
        table.put_item(
            Item={
                'email': email,
                'name': name,
                'password': password,
                'profileImageUrl': f"https://{s3_client.meta.endpoint_url}/profile-imagesbucket/{email}"
            }
        )
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
            }
        }

    return {
        'statusCode': 200,
        'body': json.dumps('User registered successfully'),
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
        }
    }
