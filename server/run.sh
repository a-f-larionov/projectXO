#!/bin/bash

# This restart server after failed, after 1 seconds.

parentFolder =${PWD##*/}

while true; do
nodejs run.js $parentFolder
sleep 1
done