#!/bin/bash
set -e

SERVICE_NAME="cbse-api"
REGION="us-central1"

echo "🚀 Building & deploying API to Cloud Run..."

# Build and submit from the api directory
gcloud builds submit --tag gcr.io/$GCP_PROJECT/$SERVICE_NAME ./api

gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$GCP_PROJECT/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=$DATABASE_URL,GCS_BUCKET=$GCS_BUCKET,GEMINI_API_KEY=$GEMINI_API_KEY,JWT_SECRET=$JWT_SECRET
