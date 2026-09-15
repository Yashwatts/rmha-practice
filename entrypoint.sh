#!/bin/sh
set -e

echo "Running orders migrations..."
npm run migration:run --orders

echo "Running payments migrations..."
npm run migration:run --payments

echo "Running deliveries migrations..."
npm run migration:run --deliveries

echo "Starting application..."
npm run start:dev