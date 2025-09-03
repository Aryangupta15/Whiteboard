
# Collaborative Whiteboard

A real-time collaborative whiteboard application that enables seamless creative collaboration across teams and individuals. Built by a passionate duo of developers using modern web technologies to provide a smooth, responsive drawing experience with powerful collaboration features.



## 🚀 Overview

This collaborative whiteboard application empowers teams to brainstorm, design, and visualize ideas together in real-time. Whether you're conducting remote meetings, educational sessions, or creative workshops, our platform provides the tools you need for effective visual collaboration.

### Key Highlights

- **Real-time Collaboration**: Multiple users can draw and interact simultaneously
- **Cross-platform**: Works seamlessly across desktop and mobile devices
- **Secure Authentication**: Firebase-powered user management
- **Performance Optimized**: Built with modern React patterns and efficient rendering

## ✨ Features

### Drawing Tools
- Multiple brush types and sizes
- Shape tools (rectangle, circle, line, arrow)
- Text insertion with customizable fonts
- Color palette with unlimited custom colors
- Eraser and selection tools

### Collaboration Features
- Real-time cursor tracking
- Room-based collaboration
- User presence indicators
- Live drawing synchronization
- Session sharing via room codes

### User Experience
- Infinite canvas with smooth panning and zooming
- Undo/Redo functionality
- Image upload and insertion
- Export capabilities (PNG, PDF)
- Professional toast notifications

### Technical Features
- Responsive design for all screen sizes
- Offline-first approach with sync capabilities
- Performance monitoring and optimization
- Modern React hooks architecture
- Modular component design

## 🛠 Tech Stack

**Frontend:**
- React 18 with Vite
- Socket.io-client for real-time communication
- Firebase Authentication
- React-Toastify for notifications
- Custom Canvas API implementation
- CSS3 with modern styling

**Backend:**
- Node.js with Express
- Socket.io for WebSocket management
- Real-time event handling
- RESTful API design

**Development Tools:**
- ESLint for code quality
- Modern JavaScript (ES2022+)
- Git version control
- Professional project structure

## 🚦 Getting Started

### Prerequisites

Before running this application, ensure you have:

- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git** for version control
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/collaborative-whiteboard.git
   cd collaborative-whiteboard
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd Frontend
   npm install
   
   # Install backend dependencies
   cd ../Backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create environment files
   cp .env.example .env
   # Configure your Firebase credentials and API keys
   ```

4. **Start the application**
   ```bash
   # Terminal 1: Start backend server
   cd Backend
   npm start
   
   # Terminal 2: Start frontend development server
   cd Frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

## 📖 Usage

### Basic Operations

1. **Create or Join Session**
   - Sign in using your Google account
   - Create a new whiteboard or join existing session with room code
   - Share room code with collaborators

2. **Drawing and Design**
   - Select drawing tools from the toolbar
   - Use mouse or touch to draw on canvas
   - Customize colors, brush sizes, and styles
   - Add text, shapes, and images as needed

3. **Collaboration**
   - Invite team members via room sharing
   - See real-time cursors and changes
   - Use chat or voice features for communication
   - Export and save your work

### Advanced Features

- **Keyboard Shortcuts**: Use Ctrl+Z (undo), Ctrl+Y (redo), Delete (remove selected)
- **Multi-select**: Hold Shift to select multiple elements
- **Precision Drawing**: Hold Shift while drawing for straight lines
- **Quick Tools**: Right-click for context menus and quick actions

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd Frontend
npm run build

# Prepare backend
cd ../Backend
npm run build  # if you have a build script
```

### Deployment Options

- **Vercel/Netlify**: For frontend static deployment
- **Heroku/Railway**: For full-stack deployment
- **AWS/Google Cloud**: For enterprise-scale deployment
- **Docker**: Container-based deployment

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper testing
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Standards

- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 🙏 Acknowledgments

- Firebase team for authentication services
- Socket.io community for real-time capabilities
- React team for the excellent framework
- All contributors and beta testers

***



## 👥 Authors
- Vikash Kumar - [GitHub][(https://github.com/dev1](https://github.com/power2loop))
- Aryan Gupta - [GitHub][(https://github.com/dev2](https://github.com/Aryangupta15))

**Built with ❤️ by two developers for creative collaboration**

