#!/bin/bash

# Deployment script for Invoice Downloader Application

echo "Starting deployment of Invoice Downloader Application..."

# Create deployment directory if it doesn't exist
DEPLOY_DIR="$HOME/invoice_downloader_deploy"
mkdir -p "$DEPLOY_DIR"

# Copy application files
echo "Copying application files..."
cp -r /home/ubuntu/invoice_downloader_app/* "$DEPLOY_DIR/"

# Install dependencies
echo "Installing dependencies..."
cd "$DEPLOY_DIR"
npm install

# Initialize database
echo "Initializing database..."
wrangler d1 execute DB --local --file=migrations/0001_initial.sql

# Build the application
echo "Building the application..."
npm run build

echo "Deployment completed successfully!"
echo "You can start the application with: cd $DEPLOY_DIR && npm run start"
echo ""
echo "Access the application at: http://localhost:3000"
