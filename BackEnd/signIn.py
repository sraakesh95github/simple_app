import json
import boto3
from botocore.exceptions import ClientError
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UsersTable')

def lambda_handler(event, context):
    body = json.loads(event['body'])
    email = body['email']
    password = body['password']

    try:
        response = table.get_item(Key={'email': email})
        if 'Item' in response:
            user = response['Item']
            if user['password'] == password:
                return {
                    'statusCode': 200,
                    'body': json.dumps({'profileImageUrl': user['profileImageUrl'][8:]}),
                    'headers': {
                        'Access-Control-Allow-Origin': '*',  # Allow any origin
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',  # Allowed methods
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',  # Allowed headers
                        'Access-Control-Allow-Credentials': 'true'
                    }   
                    
                }
            else:
                return {
                    'statusCode': 401,
                    'body': json.dumps('Invalid password'),
                    'headers': {
                        'Access-Control-Allow-Origin': '*',  # Allow any origin
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',  # Allowed methods
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',  # Allowed headers
                        'Access-Control-Allow-Credentials': 'true'
                    }   
                }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps('User not found'),
                    'headers': {
                        'Access-Control-Allow-Origin': '*',  # Allow any origin
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',  # Allowed methods
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',  # Allowed headers
                        'Access-Control-Allow-Credentials': 'true'
                    }   
            }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {
            'Access-Control-Allow-Origin': '*',  # Allow any origin
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',  # Allowed methods
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',  # Allowed headers
            'Access-Control-Allow-Credentials': 'true'
        }
        }
