# Ecobot

Robot control + real-time trash detection with YOLO and a live MJPEG web UI.

## Overview
The project has two backend servers and a React frontend:

1. Frontend (React + Vite): control pages + live camera display.
2. Node.js backend (Express, default port 3001): authentication + API proxy for robot control/streams.
3. Flask backend (default port 5000): runs the vision + control loops and serves MJPEG streams.

The robot itself provides:
- An HTTP MJPEG camera stream at `http://<ROBOT_IP>:8080?action=stream`
- A JSON-RPC endpoint for control at `http://<ROBOT_IP>:9030/jsonrpc`

## Modes

Manual:
- `backend/flask_app.py` starts threads for camera capture, YOLO inference, sonar polling, and Xbox (pygame) control.

Autonomous:
- `backend/autonomous_trash_collector.py` starts a worker thread that runs the same autonomous logic as `working_autonomous2.py`:
  YOLO sizing + smoothing + pickup sequence.

## Ports

- Frontend: `http://localhost:5173` (Vite default)
- Node API: `http://localhost:3001`
- Flask API: `http://localhost:5000`

## Configuration

### Node environment (backend/.env, examples)
Used by `backend/server.js`:

- `PORT` (default: `3001`)
- `FLASK_URL` (default: `http://localhost:5000`)
- `JWT_SECRET` (default: `ecobot-secret-change-in-production`)
- `FRONTEND_ORIGIN` (default: `http://localhost:5173`)
- MySQL:
  - `MYSQL_HOST` (default: `localhost`)
  - `MYSQL_USER` (default: `root`)
  - `MYSQL_PASSWORD` (default: empty)
  - `MYSQL_DATABASE` (default: `ecobot`)
- Email/OTP reset:
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`
  - `EMAIL_USER`, `EMAIL_APP_PASSWORD`

### Frontend environment (frontend/.env)
- `VITE_API_URL` (default: `http://localhost:3001`)

### Autonomous robot IP override (optional)
Used by `backend/autonomous_trash_collector.py`:
- `ECOBOT_ROBOT_IP` (default: `172.20.10.8`)

Note: `backend/flask_app.py` currently hardcodes the robot IP to `172.20.10.8`.

## YOLO model
- Flask manual control and autonomous both expect `best.pt` in the `backend/` directory (same as `flask_app.py` / imported module).

## Start the app
You typically run three terminals:

1. Flask backend (vision + MJPEG + control loops):
   ```bash
   cd backend
   python flask_app.py
   ```
2. Node backend (auth + proxy):
   ```bash
   cd backend
   npm run dev
   ```
3. Frontend (UI):
   ```bash
   cd frontend
   npm run dev
   ```

## API endpoints

### Node.js API (Express, port 3001)

Auth + user management (protected by cookie JWT):
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`

Health (proxy):
- `GET /api/health`

Robot control + streams (proxy to Flask, no auth required):
- Manual:
  - `POST /api/control/start`  -> Flask `POST /api/control/start`
  - `POST /api/control/stop`   -> Flask `POST /api/control/stop`
  - `GET /api/camera/status`   -> Flask `GET /api/camera/status`
  - `GET /api/status`         -> Flask `GET /api/status`
  - `GET /api/camera/stream` -> Flask `GET /api/camera/stream` (MJPEG)
- Autonomous:
  - `POST /api/autonomous/start`  -> Flask `POST /api/autonomous/start`
  - `POST /api/autonomous/stop`   -> Flask `POST /api/autonomous/stop`
  - `GET /api/autonomous/status`  -> Flask `GET /api/autonomous/status`
  - `GET /api/autonomous/stream`  -> Flask `GET /api/autonomous/stream` (MJPEG)
  - `GET /api/autonomous/snapshot` -> Flask `GET /api/autonomous/snapshot` (JPEG)

### Flask API (Python, port 5000)

- `GET /api/health`
- `GET /api/status`
  - returns: `sonar_cm`, `battery_voltage`, `battery_percent`, `action`, `trash_count`, `mode`, `control_active`
- `GET /api/camera/status`
  - returns: `status` (streaming/stopped) and `control_active`

Manual control:
- `POST /api/control/start`  (starts camera + YOLO + sonar + Xbox loop; also stops autonomous)
- `POST /api/control/stop`   (stops manual control loops)
- `GET /api/camera/stream`  (MJPEG with overlays; requires manual control to be active)

Autonomous:
- `POST /api/autonomous/start` (stops manual and starts autonomous worker)
- `POST /api/autonomous/stop`  (stops autonomous worker)
- `GET /api/autonomous/status` (returns `autonomous_active`)
- `GET /api/autonomous/stream` (MJPEG annotated feed)
- `GET /api/autonomous/snapshot` (single JPEG, debug endpoint)

## Communication flow (frontend -> Node -> Flask -> robot)
- Frontend calls Node endpoints on port 3001.
- Node proxies robot/stream endpoints to Flask on port 5000 via HTTP (axios).
- Flask reads the robot camera MJPEG via OpenCV (`cv2.VideoCapture(STREAM_URL)`).
- Flask runs YOLO (Ultralytics) on the latest frame and draws overlays.
- Flask sends robot motion/arm commands via JSON-RPC (`SetChassisVelocity`, `SetPWMServo`) and reads sonar via `GetSonarDistance`.

