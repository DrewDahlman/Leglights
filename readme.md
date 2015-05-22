## Leglights
A simple app to control the lights in the office.

## Setup / Requirements
- Have Docker (https://docs.docker.com/)
- cd into project directory
- run `boot2docker init`
- run `boot2docker up`
- run `docker-compose build`
- run `docker-compose up`
- Check'r out ( check your IP: `boot2docker ip` will show you the IP)

## Routes
- http://APP_IP/api/logs - show all logs
- ( POST )http://APP_IP/api/status - Update the status
- http://APP_IP:5000 - Connect with Websockets for devices that should listen for payloads on status change