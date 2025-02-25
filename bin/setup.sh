# install apps
./bin/setup/install-api.sh
./bin/setup/install-web.sh

# enable hardware
./bin/setup/enable-hardware.sh

# change hostname
./bin/setup/change-hostname.sh

# enable services
./bin/services/enable-api-service.sh
./bin/services/enable-web-service.sh

