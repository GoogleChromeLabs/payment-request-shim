#!/bin/bash

VERSION="v1"
CLOUD_PROJECT="prshim"

npm install
gulp build

# Log in to gcloud with service account or manually with one of the following
# commands:

# gcloud auth activate-service-account --key-file client-secret.json
# gcloud auth login

# Ensure gcloud is pointing to the correct project
gcloud config set project $CLOUD_PROJECT

# Commit projects to the repo
gsutil cp build/* "gs://$CLOUD_PROJECT/$VERSION/"
gsutil acl set public-read "gs://$CLOUD_PROJECT/$VERSION/*"
