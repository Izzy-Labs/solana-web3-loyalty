#!/bin/bash

set -e

# Create user and grant role
{
  echo "CREATE USER visitor_tg WITH PASSWORD '$VISITOR_TG_PASSWORD' IN ROLE visitor_tg_role;"
  echo "CREATE USER visitor_web WITH PASSWORD '$VISITOR_WEB_PASSWORD' IN ROLE visitor_web_role;"
  echo "CREATE USER staff_web WITH PASSWORD '$STAFF_WEB_PASSWORD' IN ROLE staff_web_role;"
  echo "CREATE USER admin_web WITH PASSWORD '$ADMIN_WEB_PASSWORD' IN ROLE admin_web_role;"
} >> /docker-entrypoint-initdb.d/init.sql

# Run postgres entrypoint
docker-entrypoint.sh postgres
