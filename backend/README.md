# Backend API Setup

This backend consists of two parts:
1. **Flask API** - Handles camera streaming and YOLO detection
2. **Node.js API** - Proxies requests from frontend to Flask API

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
FLASK_URL=http://localhost:5000
```

### 4. Start the Servers

**Terminal 1 - Start Flask API:**
```bash
python flask_app.py
```

**Terminal 2 - Start Node.js API:**
```bash
npm run dev
```

## API Endpoints

### Node.js API (Port 3001)

- `POST /api/camera/start` - Start camera stream
- `POST /api/camera/stop` - Stop camera stream
- `GET /api/camera/status` - Get camera status
- `GET /api/camera/stream` - Video stream (MJPEG)
- `GET /api/health` - Health check

### Flask API (Port 5000)

- `POST /api/camera/start` - Start camera stream
- `POST /api/camera/stop` - Stop camera stream
- `GET /api/camera/status` - Get camera status
- `GET /api/camera/stream` - Video stream (MJPEG)
- `GET /api/health` - Health check

## Notes

- The Flask API uses YOLO to detect plastic bottles (class 39 in COCO dataset)
- Camera will try indices 0-4 to find an available webcam
- Video stream is in MJPEG format for browser compatibility
- Make sure your webcam is connected and accessible





