#!/bin/bash

scp html/* root@69.164.195.155:/var/www/html/
scp jsapp/* root@69.164.195.155:/var/www/jsapp/
ssh root@69.164.195.155 systemctl restart jsapp
ssh root@69.164.195.155 systemctl restart nginx