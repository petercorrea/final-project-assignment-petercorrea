from flask import Blueprint, request, jsonify, send_from_directory
from app.lib.lib import check_sensor_guard, log
from .camera import Camera

camera_blueprint = Blueprint('camera', __name__)
camera_control = Camera()

@camera_blueprint.route('/capture', methods=['GET'])
def capture_images():
    try:
        images = camera_control.capture_images()
        return images
    except Exception as e:
        return jsonify(error=str(e)), 400

@camera_blueprint.route('/get', methods=['POST'])
def get_image():
    data = request.get_json()
    filename = data.get('value')
    return camera_control.get_image(filename)

@camera_blueprint.route('/list-images', methods=['GET'])
def list_images():
    return camera_control.list_images()

@camera_blueprint.route('/delete', methods=['POST'])
def delete_image():
    data = request.get_json()
    filename = data.get('value')
    return jsonify(message=camera_control.delete_image(filename)), 200