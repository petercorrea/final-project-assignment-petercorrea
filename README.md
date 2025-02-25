# Autogarden

An automated verical garden.

## ECEA 5307 Final Project

This is the final project repository for Peter Correa.

## Team Member
Pedro (Peter) Correa - Project will be completed individually.

## Resources
See the [Project Overview](https://github.com/cu-ecen-aeld/final-project-petercorrea/wiki/1.-Project-Overview) and [Project Board](https://github.com/users/petercorrea/projects/4/views/1?groupedBy%5BcolumnId%5D=170163068) for more details.

## Setup

- Start with a clean build of Linux. Ensure SSH and WIFI is setup. SSH into the pi and perform the following steps:

- clone the repo
```bash
git clone git@github.com:petercorrea/autogarden.git
cd autogarden
```

- install dependencies and services

```bash
sudo ./bin/setup.sh
```

## Usage

### REST API (Preffered)
Run the following scripts. API will be accessible on port 5000, Web will be accessible on port 3000.

```
sudo ./bin/run-api.sh &&
sudo ./bin/run-web.sh
```

#### Endpoints

```text
[GET] http://<pi-ip>:5000/distance

[GET] http://<pi-ip>:5000/humidity

[POST] http://<pi-ip>:5000/light/on
[POST] http://<pi-ip>:5000/light/off
[POST] http://<pi-ip>:5000/light/brightness body:{"value": 50 }
[GET] http://<pi-ip>:5000/light/brightness

[GET] http://<pi-ip>:5000/temperature

[GET] http://<pi-ip>:5000/pcb-temp

[POST] http://<pi-ip>:5000/pump/on
[POST] http://<pi-ip>:5000/pump/off
[POST] http://<pi-ip>:5000/pump/speed body:{"value": 50 }
[GET] http://<pi-ip>:5000/pump/speed
[GET] http://<pi-ip>:5000/pump/stats
```

#### Postman

Export this [Postman collection](https://www.postman.com/ourkitchen/workspace/autogarden/collection/8244324-5333d899-cfdc-420a-9eff-3202f5d02648?action=share&creator=8244324), add to your private workspace, add the `pi-ip` env variable and you should be good to go.

### Scripts

Activate python venv `source venv/bin/activate`

Examples:

```bash
python app/sensors/distance/distance.py
python app/sensors/humidity/humidity.py
python app/sensors/light/light.py [--on] [--off] [--brightness INT%]
python app/sensors/pcb_temp/pcb_temp.py
python app/sensors/pump/pump.py [--on] [--off] [--speed INT%] [--factory-host STR%] [--factory-port INT%]
python app/sensors/temperature/temperature.py
```

### Cron Job

Run `crontab -e`, select your preferred editor and then add the following job. Edit as needed.

> Note: update your paths for the following...

```text
# †urn on lights at 6am, 9am, 5pm, and turn off at 8pm
0 6 * * * ~/autogarden/venv/bin/python ~/autogarden/app/sensors/light/light.py --on --brightness 50
0 9 * * * ~/autogarden/venv/bin/python ~/autogarden/app/sensors/light/light.py --on --brightness 70
0 17 * * * ~/autogarden/venv/bin/python ~/autogarden/app/sensors/light/light.py --on --brightness 50
0 20 * * * ~/autogarden/venv/bin/python ~/autogarden/app/sensors/light/light.py --off

# Pump run at 8am for 5 minutes
0 8 * * * ~/autogarden/venv/bin/python ~/autogarden/app/sensors/pump/pump.py --on --speed 100
5 8 * * * ~/autogarden/venv/bin/python ~/autogarden/app/sensors/pump/pump.py --off

# Pump run at 4pm 5 minutes
0 16 * * * ~/autogarden/venv/bin/python ~/autogarden/app/sensors/pump/pump.py --on --speed 100
5 16 * * * ~/autogarden/venv/bin/python ~/autogarden/app/sensors/pump/pump.py --off

# Pump run at 9pm for 5 minutes
0 21 * * * ~/autogarden/venv/bin/python ~/autogarden/app/sensors/pump/pump.py --on --speed 100
5 21 * * * ~/autogarden/venv/bin/python ~/autogarden/app/sensors/pump/pump.py --off

# Collect sensor data every 30 mins
*/30 * * * * ~/autogarden/bin/log-sensor-data.sh
```

### Testing

Activate python venv `source venv/bin/activate`

Start the Flask REST API `python run.py`

Test options:

```bash
# REST endpoints
./bin/api-test.sh

# unit test
python -m unittest -v

# individual tests
python tests/test_distance.py
```

## Hardware Overview

Depending on the system you have, here is a breakdown of the hardware.

**GPIO:**

- Distance (Water Level)
- Lights
- Pump

**I2C:**

- Temperature/Humidity
- PCB
- Temperature

Notes:

- GPIO num is different than pin number. See (<https://pinout.xyz/>)

### Air Temp & Humidity Sensor

- temp/humidity sensor AM2320 at address of `0x38`

### Pump Power Monitor

- motor power usage sensor INA219 at address of `0x40`

### PCB Temp Sensor

- pcb temp sensor PCT2075 at address `pf 0x48`

When you run `sudo i2cdetect -y 1`, you should see something like:

```text
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:          -- -- -- -- -- -- -- -- -- -- -- -- --
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
30: -- -- -- -- -- -- -- -- 38 -- -- -- -- -- -- --
40: 40 -- -- -- -- -- -- -- 48 -- -- -- -- -- -- --
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
70: -- -- -- -- -- -- -- --
```

### Lights

LED full spectrum lights.

#### Method

- Lights are driven by PWM duty and a frequency of 8 kHz.

#### Pins

- [GPIO-18 | PIN-12](https://pinout.xyz/pinout/pin12_gpio18/)

### Pump

#### Method

- The pump is driven by PWM with max duty of 30% and frequency of 50 Hz
- There is a current sensor to measure pump draw and a overtemp sensor to determine if board monitor PCB temp.

#### Pins

- [GPIO-24 | PIN-18](https://pinout.xyz/pinout/pin18_gpio24/)

Notes:

- Pump duty cycle is limited, likely full on is too much current draw for the system.

### Camera

Two USB cameras.

#### Method

- image capture with fswebcam

#### Devices

- /dev/video0
- /dev/video1

### Water Level Sensor

Uses the ultrasonic distance sensor DYP-A01-V2.0.

#### Pins

- [GPIO-19 | PIN-35](https://pinout.xyz/pinout/pin35_gpio19/): water level in (trigger)
- [GPIO-26 | PIN-37](https://pinout.xyz/pinout/pin37_gpio26/): water level out (echo)

#### Method

- Uses time between the echo and response to deterine the distances.

#### References

- <https://www.google.com/search?q=DYP-A01-V2.0>
- <https://www.dypcn.com/uploads/A02-Datasheet.pdf>
