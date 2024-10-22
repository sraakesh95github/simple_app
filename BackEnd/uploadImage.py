import json
import base64
import boto3
from botocore.exceptions import ClientError

s3_client = boto3.client('s3')

def lambda_handler(event, context):
    
    print(f"Event: {event}")
    print(f"Event type: {event}")
    
    # body = json.loads(event['body'])
    # email = body['email']
    # profile_image = body['profileImage']
    
    email = event['email']
    profile_image = event['profileImage']
    print(f"Email: {email}")
    print(f"Profile Image: {profile_image}")

    # Save profile image to S3
    try:
        image_data = base64.b64decode(profile_image)
        s3_client.put_object(
            Bucket='profile-imagesbucket',
            Key=email,
            Body=image_data,
            ContentType='image/jpeg'
        )
        image_url = f"https://{s3_client.meta.endpoint_url}/profile-imagesbucket/{email}"
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Image uploaded successfully', 'imageUrl': image_url}),
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
            'body': json.dumps({'error': str(e), 'imageUrl': image_url, 'email': email}),
        'headers': {
            'Access-Control-Allow-Origin': '*',  # Allow any origin
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',  # Allowed methods
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',  # Allowed headers
            'Access-Control-Allow-Credentials': 'true'
        }
        }
