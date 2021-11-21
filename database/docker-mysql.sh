#!/bin/bash

sudo apt-get update

sudo docker pull mysql:8.0

sudo docker rm safelogmysql -f

# creating container
sudo docker run -it -d -p 3306:3306 --network safelog -e MYSQL_ROOT_PASSWORD=urubu100 --name safelogmysql mysql:8.0

# creating /db inside directory container
sudo docker exec -it safelogmysql mkdir /db
sudo docker exec -it safelogmysql apt update 
sudo docker exec -it safelogmysql apt install nano

# copying sql scripts to container
sudo docker cp BDSafelog.sql safelogmysql:/db
sudo docker cp create_sql_user.sql safelogmysql:/db
sudo docker cp pivot.sql safelogmysql:/db
sudo docker cp build-db.sh safelogmysql:/db

# enter in MySQL container
sudo docker exec -it safelogmysql bash