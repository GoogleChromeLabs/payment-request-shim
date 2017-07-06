#!/bin/bash

VERSION="v1"
BUCKET_NAME="prshim"
BUILD_FILES[0]="payment-shim.debug.js"
BUILD_FILES[1]="payment-shim.js"
BUILD_FILES[2]="payment-shim.js.map"

npm install
gulp build

# Log in to gcloud with service account or manually with one of the following
# commands:

# gcloud auth activate-service-account --key-file client-secret.json
# gcloud auth login

# Ensure gcloud is pointing to the correct project
gcloud config set project $BUCKET_NAME

# Commit projects to the repo
for buildFile in ${BUILD_FILES[@]}
do
  gsutil cp "build/$buildFile" "gs://$BUCKET_NAME/$VERSION/"
done

gsutil acl set -r public-read "gs://$BUCKET_NAME/$VERSION/"
