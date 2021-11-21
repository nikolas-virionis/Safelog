#!/bin/bash

sudo apt-get update

# downloading image
sudo docker pull node:16

# deleting node container if exists
sudo docker rm safelognode -f

# building node container
sudo docker run -it -d -p 3000:3000 --network safelog --name safelognode node:16

# copying website directory and .env
cd ..
sudo docker cp website safelognode:/
sudo docker cp website/.env safelognode:/ 

# installing packages
sudo docker exec -it safelognode npm i --prefix /website

# hosting website
sudo docker exec -d -it safelognode node /website/bin/www