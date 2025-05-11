#!/bin/bash

# Load environment variables from the .env file in the server directory
set -a
source ./server/.env
set +a

echo "Loading schema into MySQL container..."
docker exec -i slope-search-mysql-1 mysql -u root -p"$DB_PASS" slope_search < ./sql/createTables.sql

echo "Loading data into MySQL container..."
docker exec -i slope-search-mysql-1 mysql --local-infile=1 -u root -p"$DB_PASS" slope_search < ./sql/loadData.sql

echo "Database initialized"