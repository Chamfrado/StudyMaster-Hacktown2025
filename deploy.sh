#!/bin/bash

echo "🚀 Iniciando deploy do StudyMaster..."

# Build e deploy da infraestrutura
echo "📦 Fazendo build do projeto..."
sam build

echo "🌐 Fazendo deploy da infraestrutura..."
sam deploy

# Obter URLs dos outputs
echo "📋 Obtendo informações do deploy..."
API_URL=$(aws cloudformation describe-stacks --stack-name studymaster --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' --output text)
WEBSITE_URL=$(aws cloudformation describe-stacks --stack-name studymaster --query 'Stacks[0].Outputs[?OutputKey==`WebsiteUrl`].OutputValue' --output text)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "🔧 Atualizando URL da API no frontend..."
sed -i "s|https://your-api-gateway-url.execute-api.region.amazonaws.com/prod|$API_URL|g" frontend/script.js

echo "📤 Fazendo upload do frontend..."
aws s3 sync frontend/ s3://studymaster-frontend-$ACCOUNT_ID/

echo "📊 Populando banco de dados..."
cd scripts
python populate_db.py
cd ..

echo "✅ Deploy concluído!"
echo "🌐 Website: $WEBSITE_URL"
echo "🔗 API: $API_URL"