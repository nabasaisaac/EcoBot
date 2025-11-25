from flask import Flask, Response, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import threading
import time

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Global variables
camera = None
model = None
is_streaming = False
frame_lock = threading.Lock()
current_frame = None

def init_camera():
    """Initialize camera and YOLO model"""
    global camera, model
    try:
        # Load YOLO model
        model = YOLO(r"./yolo_weights/yolov8n.pt")
        
        # Open webcam
        camera = cv2.VideoCapture(0)
        if not camera.isOpened():
            # Try different camera indices
            for i in range(1, 5):
                camera = cv2.VideoCapture(i)
                if camera.isOpened():
                    break
        
        if not camera.isOpened():
            raise Exception("Could not open webcam")
        
        # Set camera properties for better performance
        camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        camera.set(cv2.CAP_PROP_FPS, 30)
        
        return True
    except Exception as e:
        print(f"Error initializing camera: {e}")
        return False

def detect_plastic(frame):
    """Detect plastic bottles and other objects using YOLO"""
    global model
    if model is None:
        return frame
    
    try:
        # YOLO detection - focusing on bottle class (class 39 in COCO dataset)
        results = model(frame, conf=0.25, classes=[39])  # class 39 is bottle
        
        # Draw detections on frame
        annotated = results[0].plot()
        return annotated
    except Exception as e:
        print(f"Detection error: {e}")
        return frame

def generate_frames():
    """Generate video frames with YOLO detection"""
    global camera, is_streaming, current_frame, frame_lock
    
    frame_count = 0
    print("Starting frame generation...")
    
    while is_streaming:
        if camera is None:
            print("Camera is None, breaking loop")
            break
            
        ret, frame = camera.read()
        if not ret:
            print("Failed to capture frame")
            time.sleep(0.1)
            continue
        
        # Flip camera horizontally (mirror effect)
        frame = cv2.flip(frame, 1)
        
        # Detect plastic bottles
        try:
            frame = detect_plastic(frame)
        except Exception as e:
            print(f"Detection error: {e}")
        
        # Update current frame
        with frame_lock:
            current_frame = frame.copy()
        
        # Encode frame as JPEG
        try:
            ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
            if not ret:
                continue
            
            frame_bytes = buffer.tobytes()
            frame_count += 1
            
            if frame_count % 30 == 0:  # Log every 30 frames
                print(f"Streaming frame {frame_count}")
            
            # Yield frame in MJPEG format
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        except Exception as e:
            print(f"Encoding error: {e}")
            continue
        
        time.sleep(0.033)  # ~30 FPS
    
    print("Frame generation stopped")

@app.route('/api/camera/start', methods=['POST'])
def start_camera():
    """Start camera stream"""
    global camera, is_streaming, model
    
    if is_streaming:
        print("Camera already streaming")
        return jsonify({'status': 'already_streaming', 'message': 'Camera is already streaming'}), 200
    
    if camera is None:
        print("Initializing camera...")
        if not init_camera():
            print("Failed to initialize camera")
            return jsonify({'status': 'error', 'message': 'Failed to initialize camera'}), 500
        print("Camera initialized successfully")
    
    # Test if camera can read a frame
    if camera is not None and camera.isOpened():
        ret, test_frame = camera.read()
        if not ret:
            print("Camera opened but cannot read frames")
            return jsonify({'status': 'error', 'message': 'Camera cannot read frames'}), 500
        print(f"Camera test frame read successfully: {test_frame.shape if ret else 'failed'}")
        
        is_streaming = True
        print("Camera streaming started - ready to serve frames")
        return jsonify({'status': 'success', 'message': 'Camera started'}), 200
    else:
        print("Camera not available")
        return jsonify({'status': 'error', 'message': 'Camera opened but not available'}), 500

@app.route('/api/camera/stop', methods=['POST'])
def stop_camera():
    """Stop camera stream"""
    global camera, is_streaming
    
    is_streaming = False
    
    if camera:
        camera.release()
        camera = None
    
    return jsonify({'status': 'success', 'message': 'Camera stopped'}), 200

@app.route('/api/camera/status', methods=['GET'])
def camera_status():
    """Get camera status"""
    global is_streaming, camera
    
    return jsonify({
        'status': 'streaming' if is_streaming else 'stopped',
        'camera_available': camera is not None and camera.isOpened() if camera else False
    }), 200

@app.route('/api/camera/stream')
def video_stream():
    """Video streaming route"""
    global is_streaming, camera
    
    print(f"Stream request received. is_streaming: {is_streaming}, camera: {camera is not None}")
    
    if not is_streaming:
        print("Stream requested but camera not started")
        return Response("Camera not started. Please start camera first.", status=400, mimetype='text/plain')
    
    if camera is None or not camera.isOpened():
        print("Camera not available for streaming")
        return Response("Camera not available.", status=500, mimetype='text/plain')
    
    print("Starting video stream response...")
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame',
                    headers={
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                        'X-Accel-Buffering': 'no',
                        'Connection': 'keep-alive',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    })

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    print("Starting Flask API server...")
    app.run(host='0.0.0.0', port=5000, threaded=True, debug=False)

