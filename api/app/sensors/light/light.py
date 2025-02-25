import argparse
from gpiozero import PWMLED
from gpiozero.pins.pigpio import PiGPIOFactory
import pigpio
import argparse
import logging
import json
from datetime import datetime

class GPIOController:
    def __init__(self, pin, pin_factory=None):
        self.pin = pin
        self.factory = pin_factory
        host = 'localhost'  # Default host
        port = 8888          # Default port
        
        if pin_factory:
            host = pin_factory.host
            port = pin_factory.port
                 
        self.pi = pigpio.pi(host, port)

        if not self.pi.connected:
            raise RuntimeError("Failed to connect to pigpiod daemon. Ensure it's running and accessible.")

    def set_frequency(self, frequency):
        if self.pi:
            self.pi.set_PWM_frequency(self.pin, frequency)
        else:
            raise RuntimeError("pigpio.pi client is not initialized.")

class Light:
    def __init__(self, pin=18, frequency=8000, host='localhost', port=8888):
        # pigpiod is running on port 8888
        # Note: for docker: PiGPIOFactory(host='pigpiod', port=8888)
        self.pin = pin
        # self.pin_factory = pin_factory if pin_factory else PiGPIOFactory()
        self.pin_factory = PiGPIOFactory(host=host, port=port)
        self.led = PWMLED(self.pin, pin_factory=self.pin_factory)
        self.gpio = GPIOController(pin, self.pin_factory)
        self.set_frequency(frequency)

    def on(self):
        """
        Turn on lights.
        """
        if self.led.value > 0:
            logging.info("Light already on, skipping")
            return

        logging.info("Turning light on")
        self.led.value = 1

    def off(self):
        """
        Turn off lights.
        """
        logging.info("Turning light off")
        self.led.value = 0

    def set_brightness(self, brightness_percentage):
        """
        Wrapper function around set_duty_cycle. Provides more intuitive function name.

        Args:
        - brightness_percentage (int): A value between 0 (off) and 100 (max brightness).
        """
        self.set_duty_cycle(brightness_percentage)

    def get_brightness(self):
        """
        Wrapper function around get_duty_cycle. Provides more intuitive function name.

        Returns:
        - float: The current duty cycle percentage.
        """
        return self.get_duty_cycle()

    def set_frequency(self, frequency):
        logging.info(f"Setting light frequency to {frequency}")
        self.gpio.set_frequency(frequency)

    def set_duty_cycle(self, duty_cycle_percentage):
        """
        Set the duty cycle percentage, i.e. brightness level.

        Args:
        - duty_cycle_percentage (int): A value between 0 (off) and 100 (full brightness).
        """
        if 0 <= duty_cycle_percentage <= 100:
            # gpiozero's PWMLED uses a 0-1 scale for duty cycle
            duty = duty_cycle_percentage / 100.0
            logging.info(f"Setting light duty_cycle to {duty_cycle_percentage}%")
            self.led.value = duty
        else:
            raise ValueError("Speed must be between 0 and 100")

    def get_duty_cycle(self):
        """
        Get the current duty cycle percentage.

        Returns:
        - float: The current duty cycle percentage.
        """
        duty_cycle = self.led.value * 100
        logging.info(f"Light duty_cycle is {duty_cycle}%")
        return duty_cycle

    def close(self):
        self.led.close()

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    parser = argparse.ArgumentParser(description='Control a light.')
    parser.add_argument('--on', action='store_true', help='Turn the light on.')
    parser.add_argument('--off', action='store_true', help='Turn the light off.')
    parser.add_argument('--brightness', type=int, default=None, help='Set the brightness level (0-100).')
    parser.add_argument('--log', action='store_true')
    args = parser.parse_args()

    sensor = None
    try:
        sensor = Light(18)  # Default frequency of 8kHz
    except:
        logging.info("Failed to initialize lights")

    if args.on:
        sensor.on()
        if args.brightness is not None:
            sensor.set_brightness(args.brightness)
    elif args.off:
        sensor.off()
    elif args.brightness is not None:
        sensor.on()
        sensor.set_brightness(args.brightness)
    elif args.log:
        try:
            brightness = sensor.get_brightness()
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            log_entry = {
                "timestamp": timestamp,
                "sensor": "Brightness",
                "value": f"{brightness:.2f}"
            }
            logging.info(json.dumps(log_entry))
            print(json.dumps(log_entry))
        except Exception as e:
            logging.info(f"Error: {e}")
        except KeyboardInterrupt:
            logging.info("Script interrupted.")
    else:
        logging.info("No action specified. Use --on, --off, --brightness or --log.")
