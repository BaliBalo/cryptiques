#!/bin/bash

npm run build || exit 1

rm -rf .prod && mv .output .prod

pm2 reload cryptiques
