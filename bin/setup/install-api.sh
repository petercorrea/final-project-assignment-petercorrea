#!/bin/bash

# Define color constants for output formatting
GRN="\e[32m"
RED="\e[31m"
RST="\e[0m"

# Define logging functions for different message types
function error { echo -ne "[${RED}ERROR${RST}]: $*\n" >&2; }
function info  { echo -ne "[${GRN}INFO${RST}]: $*\n" >&2; }
function red   { echo -ne "[${RED}INFO${RST}]: $*\n" >&2; }

# Log function based on verbosity setting
if [ "$VERBOSE" == "true" ]; then
  log() { echo "$@"; }
else
  log() { :; } # Do nothing if not verbose
fi

# Determine script's and project's root directory
BIN_DIR=$(dirname $(readlink -f $0))
INSTALL_DIR=$(realpath $BIN_DIR/../../)

# Change to the installation directory
cd $INSTALL_DIR

# Update package lists and install essential packages
sudo apt update
sudo apt install -y i2c-tools fswebcam pigpio python3 python3-pip python3-venv

# Set up Python virtual environment and install dependencies
info "Creating a python virtual environment and install dependencies"
cd $INSTALL_DIR/api
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
deactivate
