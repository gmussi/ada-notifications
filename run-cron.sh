#!/bin/bash
# This script will pull the image and run it. 
# It is intended to be used as a cron script.
# Example of cron job:
#   0,30 * * * * bash /home/pi/gmussi-ada-notifications/run-cron.sh
echo "Running script at date $(date)" >> /home/pi/ada_notifications.log
docker pull gmussi/gmussi-ada-notifications:latest >> /home/pi/ada_notifications.log
docker run --env-file=/home/pi/.env gmussi/gmussi-ada-notifications:latest >> /home/pi/ada_notifications.log