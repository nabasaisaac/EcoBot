# Ecobot 🤖

An intelligent robot control system for detecting and managing plastic bottles using computer vision and real-time monitoring.

## 🌟 Features

- **Real-time Object Detection**: Uses YOLOv8 to detect plastic bottles in real-time via webcam
- **Live Monitoring**: Stream video feed with object detection overlays
- **Manual Control**: Direct robot control interface with directional controls
- **Admin Dashboard**: Comprehensive monitoring and management interface
- **User Authentication**: Secure login system with JWT tokens
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🏗️ Architecture

The project consists of three main components:

1. **Frontend** (React + Vite): Modern web interface for robot control and monitoring
2. **Node.js Backend** (Express): API proxy and authentication server
3. **Flask Backend**: Camera streaming and YOLO object detection service

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MySQL** database
- **Webcam** connected to your system

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Ecobot.git
cd Ecobot
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

#### Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### Install Node.js Dependencies

```bash
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3001
FLASK_URL=http://localhost:5000
JWT_SECRET=your-secret-key-here
DB_HOST=localhost
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=ecobot
```

#### Download YOLO Weights

The YOLO model weights should be placed in `backend/yolo_weights/yolov8n.pt`. The weights file is not included in the repository due to size constraints. You can download it from the [Ultralytics repository](https://github.com/ultralytics/ultralytics).

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
```

#### Install Dependencies

```bash
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3001
```

### 4. Start the Application

You'll need to run three services:

#### Terminal 1 - Start Flask API (Camera & Detection)

```bash
cd backend
python flask_app.py
```

Or use the provided scripts:
- Windows: `start_flask.bat`
- Linux/Mac: `./start_flask.sh`

#### Terminal 2 - Start Node.js API (Proxy & Auth)

```bash
cd backend
npm run dev
```

#### Terminal 3 - Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## 📁 Project Structure

```
Ecobot/
├── backend/
│   ├── flask_app.py          # Flask API for camera and YOLO detection
│   ├── server.js             # Node.js Express API server
│   ├── requirements.txt      # Python dependencies
│   ├── package.json          # Node.js dependencies
│   ├── yolo_weights/         # YOLO model weights (not in repo)
│   └── bottle_images/        # Detected bottle images (gitignored)
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── contexts/         # React contexts (Theme, etc.)
│   │   └── pages/            # Page components
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔌 API Endpoints

### Node.js API (Port 3001)

- `POST /api/camera/start` - Start camera stream
- `POST /api/camera/stop` - Stop camera stream
- `GET /api/camera/status` - Get camera status
- `GET /api/camera/stream` - Video stream (MJPEG)
- `GET /api/health` - Health check
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration

### Flask API (Port 5000)

- `POST /api/camera/start` - Start camera stream
- `POST /api/camera/stop` - Stop camera stream
- `GET /api/camera/status` - Get camera status
- `GET /api/camera/stream` - Video stream (MJPEG)
- `GET /api/health` - Health check

## 🛠️ Technologies Used

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **Flask** - Python web framework
- **Express.js** - Node.js web framework
- **YOLOv8 (Ultralytics)** - Object detection model
- **OpenCV** - Computer vision library
- **MySQL** - Database
- **JWT** - Authentication tokens
- **Socket.io** (if used) - Real-time communication

## 📝 Notes

- The Flask API uses YOLO to detect plastic bottles (class 39 in COCO dataset)
- Camera will automatically try indices 0-4 to find an available webcam
- Video stream is in MJPEG format for browser compatibility
- Make sure your webcam is connected and accessible before starting the application

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- [Ultralytics](https://ultralytics.com/) for YOLOv8
- [OpenCV](https://opencv.org/) for computer vision capabilities

