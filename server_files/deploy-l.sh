#!/bin/bash

scp html/* lucas@isluc.mooo.com:/var/www/html/
scp jsapp/* lucas@isluc.mooo.com:/var/www/jsapp/
ssh lucas@isluc.mooo.com systemctl restart jsapp
