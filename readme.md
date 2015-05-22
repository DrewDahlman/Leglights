## Leglights
A simple server that pushes notifications to robots to control the lights in the office.

## Setup / Requirements
- Have Docker (https://docs.docker.com/)
- cd into project directory
- run `boot2docker init`
- run `boot2docker up`
- run `docker-compose build`
- run `docker-compose up`
- Check'r out ( check your IP: `boot2docker ip` will show you the IP )

## Running
- cd into project directory
- run `docker-compose up`
- Check'r out ( check your IP: `boot2docker ip` will show you the IP )

## Routes
- `/api/logs` - show all logs
- `/api/status` - Update the status ( POST )

## Devices
- `ws://APP_IP:666` - Connect with Websockets for devices that should listen for payloads on status change
- `ws://104.131.51.119:666` - Connect with Websockets for devices that should listen for payloads on status change ( Production )