#!/bin/bash

if [ $# -eq 0 ]; then
  echo "Usage: $0 <app_name>"
  exit 1
fi
app_name=$1
project_directory="$app_name"
if [ ! -d "$project_directory" ]; then
  echo "Error: Project '$app_name' not found in '$project_directory'."
  exit 1
fi
cd "$project_directory" || exit 1
echo "Executing command in $app_name project..."
npm install
npm run clean
npm run start

