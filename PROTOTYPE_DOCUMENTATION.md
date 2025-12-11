# Ecobot Prototype Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prototype Scope](#prototype-scope)
3. [System Architecture](#system-architecture)
4. [Features Implemented](#features-implemented)
5. [User Flows](#user-flows)
6. [Technical Specifications](#technical-specifications)
7. [Design Decisions](#design-decisions)
8. [API Documentation](#api-documentation)
9. [Testing & Validation](#testing--validation)
10. [Known Limitations](#known-limitations)
11. [Future Enhancements](#future-enhancements)
12. [Development Timeline](#development-timeline)

---

## Overview

### Project Purpose

Ecobot is an intelligent autonomous robot control system designed to revolutionize waste management in Uganda. The prototype demonstrates a web-based control interface that enables real-time monitoring, manual control, and AI-powered trash detection using computer vision.

### Problem Statement

Uganda faces significant challenges with waste management, leading to:
- Environmental pollution
- Public health concerns
- Inefficient waste collection processes
- Lack of data-driven insights into waste generation patterns

### Solution Approach

The Ecobot prototype addresses these challenges by providing:
- **AI-Powered Detection**: Real-time trash detection using YOLOv8 computer vision
- **Remote Control**: Web-based interface for manual robot control
- **Live Monitoring**: Real-time video streaming with object detection overlays
- **Data Collection**: System for tracking robot status, waste collection, and operational metrics
- **User Management**: Authentication and authorization system for secure access

### Target Users

- **Administrators**: Monitor fleet status, view analytics, manage robots
- **Operators**: Control robots manually, monitor live feeds
- **Maintenance Staff**: Access robot vitals, view alerts and notifications

---

## Prototype Scope

### What's Included

✅ **Frontend Application**
- Responsive web interface built with React
- Multiple pages: Home, Login, Live Monitoring, Manual Control, Admin Dashboard, About
- Real-time video streaming integration
- Theme support (light/dark mode)
- Modern UI with Tailwind CSS

✅ **Backend Services**
- Flask API for camera streaming and YOLO object detection
- Node.js/Express API for request proxying and authentication
- RESTful API endpoints for robot control
- Health check endpoints

✅ **Computer Vision**
- YOLOv8 integration for object detection
- Real-time trash detection (class 39 in COCO dataset)
- MJPEG video streaming
- Detection overlay on video feed

✅ **User Interface Features**
- Manual robot control (directional movement)
- Live monitoring dashboard
- Admin dashboard with fleet overview
- Robot vitals display (battery, connectivity, temperature)
- Alert and notification system
- Recent activity feed

### What's Not Included (Future Work)

❌ Physical robot hardware integration
❌ GPS tracking and mapping
❌ Autonomous navigation algorithms
❌ Database persistence (currently in-memory)
❌ User registration and authentication (UI ready, backend partial)
❌ Analytics and reporting features
❌ Mobile application
❌ Multi-robot fleet management
❌ Real-time communication protocols (WebSocket/Socket.io)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │  Login   │  │  Monitor │  │  Control │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST
                        │
┌───────────────────────┴─────────────────────────────────────┐
│              Node.js API (Express) - Port 3001               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Request Proxy │ Authentication │ CORS Handling     │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST
                        │
┌───────────────────────┴─────────────────────────────────────┐
│              Flask API (Python) - Port 5000                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Camera Control │ YOLO Detection │ Video Streaming  │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼──────┐              ┌────────▼────────┐
│   Webcam     │              │   YOLOv8 Model  │
│  (OpenCV)    │              │   (Ultralytics) │
└──────────────┘              └─────────────────┘
```

### Component Breakdown

#### Frontend Layer
- **Framework**: React 19 with Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **State Management**: React Context API (Theme)
- **HTTP Client**: Native Fetch API

#### Backend Layer - Node.js
- **Framework**: Express.js v5
- **Middleware**: CORS, JSON parser
- **Proxy**: Axios for Flask API communication
- **Environment**: dotenv for configuration

#### Backend Layer - Flask
- **Framework**: Flask v3.0
- **Computer Vision**: OpenCV, Ultralytics YOLO
- **Video Streaming**: MJPEG format
- **Threading**: Camera and detection in separate threads

### Data Flow

1. **Video Streaming Flow**:
   ```
   Webcam → OpenCV → YOLO Detection → Flask API → Node.js Proxy → Frontend
   ```

2. **Control Flow**:
   ```
   Frontend → Node.js API → Flask API → Robot Control (Future: Hardware)
   ```

3. **Status Flow**:
   ```
   Robot Sensors → Flask API → Node.js API → Frontend Dashboard
   ```

---

## Features Implemented

### 1. Home Page
- **Purpose**: Landing page with project overview
- **Features**:
  - Hero section with call-to-action
  - Problem statement and solution overview
  - Core features showcase (AI Vision, Autonomous Navigation, IoT Data Hub)
  - Navigation to login page
- **Status**: ✅ Complete

### 2. Login Page
- **Purpose**: User authentication
- **Features**:
  - Login form UI
  - Route protection (planned)
- **Status**: ⚠️ UI Complete, Backend Partial

### 3. Live Monitoring Page
- **Purpose**: Real-time robot monitoring
- **Features**:
  - Live video stream with detection overlays
  - Robot vitals dashboard:
    - Battery level (circular progress)
    - Bin capacity
    - Connectivity status
    - Motor temperature
  - Live fleet location map (placeholder)
  - Urgent alerts panel
  - Recent events timeline
  - Robot status indicator (recording, collecting, etc.)
- **Status**: ✅ UI Complete, Video Stream Integration Ready

### 4. Manual Control Page
- **Purpose**: Direct robot control
- **Features**:
  - Directional control buttons (Up, Down, Left, Right)
  - Play/Pause controls
  - Robot status display
  - Connection status indicator
  - Battery and signal indicators
  - Auto-reconnect functionality
  - API health check with fallback
- **Status**: ✅ Complete (UI + API Integration)

### 5. Admin Dashboard Page
- **Purpose**: Fleet management overview
- **Features**:
  - Key metrics cards:
    - Active robots count
    - Average battery level
    - Connectivity status
    - Waste capacity
  - Real-time fleet location map
  - Quick action cards:
    - Live Monitoring
    - Manual Control
    - View Analytics (placeholder)
    - Maintenance (placeholder)
  - Notifications panel with alerts
  - Recent activity feed
- **Status**: ✅ UI Complete

### 6. About Robot Page
- **Purpose**: Information about the robot
- **Features**:
  - Robot specifications
  - Technical details
  - Capabilities overview
- **Status**: ✅ Complete

### 7. Shared Components
- **Header**: Navigation and branding
- **Sidebar**: Main navigation menu
- **Footer**: Additional links and information
- **Theme Context**: Dark/light mode support (infrastructure ready)

---

## User Flows

### Flow 1: First-Time User Access

```
1. User visits homepage
   ↓
2. Views project overview and features
   ↓
3. Clicks "Login to Access Dashboard"
   ↓
4. Redirected to login page
   ↓
5. Enters credentials (future: authentication)
   ↓
6. Redirected to Admin Dashboard
```

### Flow 2: Manual Robot Control

```
1. User navigates to Manual Control page
   ↓
2. System checks API availability (Node.js → Flask)
   ↓
3. Displays connection status
   ↓
4. User clicks directional buttons
   ↓
5. Frontend sends POST request to /api/robot/control
   ↓
6. Node.js API proxies to Flask API
   ↓
7. Flask API processes control command
   ↓
8. Response sent back to frontend
   ↓
9. UI updates with robot status
```

### Flow 3: Live Monitoring

```
1. User navigates to Live Monitoring page
   ↓
2. System requests camera stream
   ↓
3. Flask API initializes camera and YOLO model
   ↓
4. Video stream starts (MJPEG format)
   ↓
5. YOLO processes each frame for trash detection
   ↓
6. Detected objects are highlighted with bounding boxes
   ↓
7. Stream displayed in frontend with overlays
   ↓
8. Robot vitals updated in real-time (simulated)
   ↓
9. Alerts displayed if critical issues detected
```

### Flow 4: Admin Dashboard Overview

```
1. Admin logs in
   ↓
2. Redirected to Admin Dashboard
   ↓
3. Views fleet metrics (active robots, battery, etc.)
   ↓
4. Checks notifications for urgent alerts
   ↓
5. Reviews recent activity feed
   ↓
6. Accesses quick actions:
   - Live Monitoring
   - Manual Control
   - Analytics (future)
   - Maintenance (future)
```

---

## Technical Specifications

### Frontend Specifications

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 19.2.0 |
| Build Tool | Vite | 7.2.4 |
| Routing | React Router DOM | 7.9.6 |
| Styling | Tailwind CSS | 4.1.17 |
| Icons | Lucide React | 0.554.0 |
| Font | Plus Jakarta Sans | 5.2.6 |

### Backend Specifications

#### Node.js API
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Express | 5.1.0 |
| HTTP Client | Axios | 1.10.0 |
| CORS | cors | 2.8.5 |
| Environment | dotenv | 16.5.0 |

#### Flask API
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Flask | 3.0.0 |
| CORS | Flask-CORS | 4.0.0 |
| Computer Vision | OpenCV | 4.8.1.78 |
| Object Detection | Ultralytics YOLO | 8.0.196 |
| Scientific Computing | NumPy | 1.24.3 |

### System Requirements

- **Node.js**: v18 or higher
- **Python**: v3.8 or higher
- **Webcam**: USB webcam connected to system
- **RAM**: Minimum 4GB (8GB recommended for YOLO)
- **Storage**: ~2GB for dependencies and model weights
- **Browser**: Modern browser with WebRTC support (Chrome, Firefox, Edge)

### API Endpoints

#### Node.js API (Port 3001)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/health` | Health check | ✅ |
| POST | `/api/camera/start` | Start camera stream | ✅ |
| POST | `/api/camera/stop` | Stop camera stream | ✅ |
| GET | `/api/camera/status` | Get camera status | ✅ |
| GET | `/api/camera/stream` | Video stream (MJPEG) | ✅ |
| POST | `/api/auth/login` | User authentication | ⚠️ Partial |
| POST | `/api/auth/register` | User registration | ⚠️ Partial |

#### Flask API (Port 5000)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/health` | Health check | ✅ |
| POST | `/api/camera/start` | Start camera stream | ✅ |
| POST | `/api/camera/stop` | Stop camera stream | ✅ |
| GET | `/api/camera/status` | Get camera status | ✅ |
| GET | `/api/camera/stream` | Video stream (MJPEG) | ✅ |

---

## Design Decisions

### 1. Dual Backend Architecture

**Decision**: Use both Node.js and Flask backends

**Rationale**:
- **Node.js**: Handles authentication, request proxying, and CORS management
- **Flask**: Optimized for computer vision tasks (Python ecosystem)
- Separation of concerns: Web logic vs. AI/ML logic
- Future scalability: Can scale each service independently

**Trade-offs**:
- ✅ Better performance for each specialized task
- ✅ Easier to maintain and update
- ❌ More complex deployment (two services)
- ❌ Additional network hop (minimal latency)

### 2. MJPEG Video Streaming

**Decision**: Use MJPEG format for video streaming

**Rationale**:
- Browser compatibility (no codec issues)
- Low latency for real-time detection
- Simple implementation with Flask
- Works well with OpenCV

**Trade-offs**:
- ✅ Universal browser support
- ✅ Simple to implement
- ❌ Higher bandwidth usage than H.264
- ❌ No audio support (not needed for this use case)

### 3. React Context for State Management

**Decision**: Use React Context API instead of Redux

**Rationale**:
- Simpler state management for current scope
- Less boilerplate code
- Sufficient for theme and user state
- Can migrate to Redux if needed later

**Trade-offs**:
- ✅ Simpler codebase
- ✅ Less overhead
- ❌ May need refactoring if state grows complex

### 4. Tailwind CSS for Styling

**Decision**: Use Tailwind CSS utility-first approach

**Rationale**:
- Rapid UI development
- Consistent design system
- Small bundle size with purging
- Easy to maintain and customize

**Trade-offs**:
- ✅ Fast development
- ✅ Consistent styling
- ❌ Learning curve for team members
- ❌ Verbose class names in JSX

### 5. YOLOv8 for Object Detection

**Decision**: Use YOLOv8 (nano variant) for trash detection

**Rationale**:
- State-of-the-art object detection
- Fast inference speed (real-time capable)
- Pre-trained on COCO dataset (includes bottle class)
- Easy to fine-tune for specific trash types

**Trade-offs**:
- ✅ High accuracy
- ✅ Real-time performance
- ❌ Requires GPU for optimal performance
- ❌ Model weights not in repository (size constraints)

---

## API Documentation

### Camera Control Endpoints

#### Start Camera Stream

```http
POST /api/camera/start
```

**Request Body**: None

**Response**:
```json
{
  "status": "success",
  "message": "Camera started successfully"
}
```

**Error Response**:
```json
{
  "status": "error",
  "message": "Failed to start camera: [error details]"
}
```

#### Stop Camera Stream

```http
POST /api/camera/stop
```

**Request Body**: None

**Response**:
```json
{
  "status": "success",
  "message": "Camera stopped successfully"
}
```

#### Get Camera Status

```http
GET /api/camera/status
```

**Response**:
```json
{
  "status": "streaming",
  "is_active": true,
  "frame_count": 1234
}
```

#### Video Stream

```http
GET /api/camera/stream
```

**Response**: MJPEG stream (multipart/x-mixed-replace)

**Headers**:
- `Content-Type: multipart/x-mixed-replace; boundary=frame`
- `Cache-Control: no-cache`
- `Connection: keep-alive`

### Health Check

```http
GET /api/health
```

**Response**:
```json
{
  "status": "healthy",
  "service": "flask-api",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## Testing & Validation

### Manual Testing Performed

#### Frontend Testing
- ✅ All pages render correctly
- ✅ Navigation between pages works
- ✅ Responsive design on mobile/tablet/desktop
- ✅ Theme switching (infrastructure tested)
- ✅ Button interactions and hover states
- ✅ Form validation (login page)

#### Backend Testing
- ✅ Flask API starts and initializes camera
- ✅ YOLO model loads successfully
- ✅ Video stream generates correctly
- ✅ Object detection works on test images
- ✅ Node.js API proxies requests correctly
- ✅ Health checks respond appropriately
- ✅ CORS headers configured correctly

#### Integration Testing
- ✅ Frontend connects to Node.js API
- ✅ Node.js API proxies to Flask API
- ✅ Video stream displays in frontend
- ✅ API fallback mechanism works (Node.js → Flask)
- ✅ Error handling for unavailable services

### Test Scenarios

| Scenario | Status | Notes |
|----------|--------|-------|
| Camera initialization | ✅ | Works with webcam indices 0-4 |
| YOLO detection | ✅ | Detects class 39 (bottle) correctly |
| Video streaming | ✅ | MJPEG stream works in browsers |
| Manual control | ✅ | API endpoints respond correctly |
| Multiple users | ⚠️ | Not tested (single camera limitation) |
| Error recovery | ✅ | Fallback mechanism works |
| Performance | ⚠️ | Needs optimization for low-end devices |

### Known Issues

1. **Single Camera Limitation**: Only one camera stream can be active at a time
2. **No Authentication**: Login page UI exists but authentication not fully implemented
3. **Simulated Data**: Robot vitals and metrics are currently simulated
4. **No Database**: No persistent storage for user data or robot logs
5. **Performance**: YOLO inference may be slow on CPU-only systems

---

## Known Limitations

### Technical Limitations

1. **Hardware Integration**
   - No physical robot hardware connected
   - Control commands are API-ready but not sent to actual robot
   - Sensor data is simulated

2. **Single Camera Support**
   - Only one camera stream at a time
   - No multi-robot video streaming
   - Camera index detection may fail on some systems

3. **Authentication**
   - Login UI implemented but backend incomplete
   - No JWT token validation
   - No user session management
   - No role-based access control

4. **Data Persistence**
   - No database integration
   - Robot logs not saved
   - User data not persisted
   - Analytics data not stored

5. **Real-time Communication**
   - No WebSocket implementation
   - Status updates require polling
   - No push notifications

6. **Performance**
   - YOLO inference on CPU is slow (~2-5 FPS)
   - GPU acceleration recommended for production
   - Large model weights not in repository

### Functional Limitations

1. **Robot Control**
   - Manual control UI works but commands not sent to hardware
   - No autonomous navigation
   - No obstacle avoidance
   - No path planning

2. **Monitoring**
   - Robot vitals are simulated
   - No real sensor data
   - Fleet location map is placeholder
   - No GPS tracking

3. **Analytics**
   - No data collection
   - No reporting features
   - No historical data
   - No trend analysis

4. **Multi-Robot Support**
   - UI supports multiple robots but backend doesn't
   - No fleet management
   - No robot assignment
   - No load balancing

---

## Future Enhancements

### Phase 1: Core Functionality (Short-term)

1. **Authentication System**
   - Complete JWT implementation
   - User registration
   - Password hashing and validation
   - Session management
   - Role-based access control (Admin, Operator, Viewer)

2. **Database Integration**
   - MySQL database setup
   - User management tables
   - Robot logs and events
   - Analytics data storage
   - Migration scripts

3. **Real-time Communication**
   - WebSocket implementation
   - Live status updates
   - Push notifications
   - Real-time alerts

4. **Hardware Integration**
   - Robot control protocol
   - Sensor data collection
   - Motor control
   - Actuator commands

### Phase 2: Advanced Features (Medium-term)

1. **Autonomous Navigation**
   - Path planning algorithms
   - Obstacle detection and avoidance
   - GPS integration
   - Route optimization

2. **Multi-Robot Support**
   - Fleet management
   - Robot assignment
   - Load balancing
   - Coordinated operations

3. **Analytics Dashboard**
   - Data visualization
   - Historical trends
   - Performance metrics
   - Waste collection statistics
   - Route efficiency analysis

4. **Mobile Application**
   - React Native app
   - Push notifications
   - Mobile-optimized UI
   - Offline capabilities

### Phase 3: AI/ML Enhancements (Long-term)

1. **Improved Detection**
   - Fine-tuned YOLO model for trash types
   - Multi-class detection (plastic, paper, metal, etc.)
   - Trash classification
   - Quality assessment

2. **Predictive Analytics**
   - Waste generation prediction
   - Optimal route prediction
   - Maintenance scheduling
   - Battery life prediction

3. **Computer Vision Upgrades**
   - Depth estimation
   - 3D object localization
   - Trash volume estimation
   - Quality assessment

### Phase 4: Scalability & Production (Long-term)

1. **Infrastructure**
   - Docker containerization
   - Kubernetes deployment
   - Load balancing
   - Auto-scaling

2. **Monitoring & Logging**
   - Application monitoring
   - Error tracking
   - Performance metrics
   - Log aggregation

3. **Security**
   - HTTPS/SSL certificates
   - API rate limiting
   - Input validation
   - Security audits

4. **Documentation**
   - API documentation (Swagger/OpenAPI)
   - User manuals
   - Developer guides
   - Deployment guides

---

## Development Timeline

### Completed (Prototype Phase)

- ✅ Project setup and architecture design
- ✅ Frontend UI development (all pages)
- ✅ Flask API for camera and YOLO integration
- ✅ Node.js API for request proxying
- ✅ Video streaming implementation
- ✅ Manual control interface
- ✅ Admin dashboard UI
- ✅ Live monitoring page
- ✅ Basic error handling and fallback mechanisms

### Estimated Timeline for Future Phases

**Phase 1 (2-3 months)**
- Authentication system: 2 weeks
- Database integration: 2 weeks
- Real-time communication: 3 weeks
- Hardware integration: 4 weeks
- Testing and bug fixes: 2 weeks

**Phase 2 (3-4 months)**
- Autonomous navigation: 6 weeks
- Multi-robot support: 4 weeks
- Analytics dashboard: 4 weeks
- Mobile application: 6 weeks

**Phase 3 (4-6 months)**
- AI/ML enhancements: 8 weeks
- Predictive analytics: 6 weeks
- Computer vision upgrades: 6 weeks

**Phase 4 (2-3 months)**
- Infrastructure setup: 4 weeks
- Monitoring and logging: 3 weeks
- Security implementation: 3 weeks
- Documentation: 2 weeks

---

## Conclusion

The Ecobot prototype successfully demonstrates the core concepts and architecture for an intelligent waste management robot control system. The prototype includes:

- ✅ Modern, responsive web interface
- ✅ Real-time video streaming with AI detection
- ✅ Manual robot control interface
- ✅ Comprehensive monitoring dashboard
- ✅ Scalable backend architecture

While the prototype has limitations (no hardware integration, simulated data, incomplete authentication), it provides a solid foundation for future development. The modular architecture allows for incremental improvements and feature additions.

The next steps should focus on:
1. Completing authentication and database integration
2. Integrating with physical robot hardware
3. Implementing real-time communication
4. Adding analytics and reporting features

---

## Authors

- **NABASA ISAAC**
- **LETICIA LAKICA**
- **ATWIJUKIRE APOPHIA**

## Version History

- **v0.1.0** (Prototype) - Initial prototype with core features
  - Frontend UI complete
  - Backend APIs functional
  - YOLO integration working
  - Video streaming operational

---

## Appendix

### A. Environment Variables

#### Backend `.env`
```env
PORT=3001
FLASK_URL=http://localhost:5000
JWT_SECRET=your-secret-key-here
DB_HOST=localhost
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=ecobot
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:3001
```

### B. File Structure

```
Ecobot/
├── backend/
│   ├── flask_app.py          # Flask API
│   ├── server.js             # Node.js API
│   ├── requirements.txt      # Python dependencies
│   ├── package.json          # Node.js dependencies
│   ├── yolo_weights/         # YOLO model weights
│   └── bottle_images/        # Detected images
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   └── pages/            # Page components
│   └── package.json
├── README.md
└── PROTOTYPE_DOCUMENTATION.md
```

### C. Key Dependencies

See `package.json` and `requirements.txt` files in respective directories for complete dependency lists.

---

*Last Updated: [Current Date]*
*Document Version: 1.0*

