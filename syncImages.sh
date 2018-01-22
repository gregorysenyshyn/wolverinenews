#!/bin/bash
rsync -avh "/Volumes/GoogleDrive/Team Drives/Yearbook 2017-2018/Prod Files/images/" images --delete --exclude "*.gdoc"
chmod -R 755 images
