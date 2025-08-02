import json
import boto3
from boto3.dynamodb.conditions import Key, Attr
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['ROADMAPS_TABLE'])

def lambda_handler(event, context):
    try:
        # Pega o parâmetro de busca
        query_params = event.get('queryStringParameters', {})
        search_term = query_params.get('q', '').lower() if query_params else ''
        
        if not search_term:
            # Retorna todos os roadmaps se não há termo de busca
            response = table.scan()
        else:
            # Busca por tópico
            response = table.scan(
                FilterExpression=Attr('topic').contains(search_term) | 
                               Attr('title').contains(search_term) |
                               Attr('description').contains(search_term)
            )
        
        roadmaps = response.get('Items', [])
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'roadmaps': roadmaps,
                'count': len(roadmaps)
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }