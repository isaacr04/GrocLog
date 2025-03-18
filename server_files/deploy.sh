#!/bin/bash

scp -r html/* root@66.175.211.64:/var/www/html/
scp -r jsapp/* root@66.175.211.64:/var/www/jsapp/
ssh root@66.175.211.64 systemctl restart jsapp
ssh root@66.175.211.64 systemctl restart nginx
