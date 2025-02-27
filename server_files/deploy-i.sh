#!/bin/bash

scp html/* isaac@isluc.mooo.com:/var/www/html/
scp jsapp/* isaac@isluc.mooo.com:/var/www/jsapp/
ssh isaac@isluc.mooo.com systemctl restart jsapp
