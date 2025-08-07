# Settings Integration Setup

This guide explains how to run the integrated backend and frontend for the Settings component.

## Backend Setup

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Make sure your `.env` file contains:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start the Backend Server**:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

## Frontend Setup

1. **Install React Dependencies** (in your frontend directory):
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in your React app root:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start the Frontend**:
   ```bash
   npm start
   ```
   The React app will run on `http://localhost:3000`

## API Endpoints

### Settings Endpoints

- **GET** `/api/settings/:userId` - Get user settings
- **POST** `/api/settings/:userId` - Save/update user settings

### Example API Usage

```javascript
// Get settings
const response = await fetch('http://localhost:5000/api/settings/user123');
const settings = await response.json();

// Save settings
const response = await fetch('http://localhost:5000/api/settings/user123', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    twoFactorAuth: true,
    emailAlerts: true,
    autoLogout: 30,
    darkTheme: true,
    biometricAuth: false,
    sessionTimeout: 15,
    breachAlerts: true,
    chatNotifications: true,
    vaultNotifications: true
  }),
});
const updatedSettings = await response.json();
```

## Features Implemented

### Backend
- ✅ MongoDB Settings model with default values
- ✅ GET endpoint to retrieve user settings
- ✅ POST endpoint to save/update user settings
- ✅ Automatic user creation if settings don't exist (upsert)
- ✅ Error handling and validation

### Frontend
- ✅ Settings API service (`src/services/settingsApi.js`)
- ✅ Updated Settings component with backend integration
- ✅ Loading states and error handling
- ✅ Success/error message display
- ✅ Real-time settings persistence
- ✅ Automatic settings loading on component mount

## Settings Schema

The Settings model includes the following fields:

```javascript
{
  userId: String (required, unique),
  twoFactorAuth: Boolean (default: true),
  emailAlerts: Boolean (default: true),
  autoLogout: Number (default: 30),
  darkTheme: Boolean (default: true),
  biometricAuth: Boolean (default: false),
  sessionTimeout: Number (default: 15),
  breachAlerts: Boolean (default: true),
  chatNotifications: Boolean (default: true),
  vaultNotifications: Boolean (default: true),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Testing

1. Start both backend and frontend servers
2. Navigate to the Settings page in your React app
3. The component will automatically load settings from the backend
4. Make changes to any settings
5. Click "Save Settings" to persist changes
6. Refresh the page to verify settings are loaded from the database

## Troubleshooting

### Common Issues

1. **CORS Error**: Make sure CORS is enabled in your backend (`app.js` includes `app.use(cors())`)

2. **API Connection Error**: 
   - Verify backend is running on port 5000
   - Check that `REACT_APP_API_URL` is set correctly
   - Ensure MongoDB is connected

3. **Settings Not Saving**:
   - Check browser console for errors
   - Verify backend logs for database connection issues
   - Ensure MongoDB is running and accessible

4. **Default Settings Not Loading**:
   - The component will use frontend defaults if backend is unavailable
   - Check network tab in browser dev tools for API call status

### Development Tips

- Use browser dev tools Network tab to monitor API calls
- Check backend console logs for database operations
- The userId is currently hardcoded as 'user123' for demo purposes
- In production, replace with actual user authentication

## Next Steps

1. **Authentication Integration**: Replace hardcoded userId with actual user authentication
2. **Validation**: Add client-side and server-side validation
3. **Security**: Add authentication middleware to protect API endpoints
4. **Error Boundaries**: Add React error boundaries for better error handling
5. **Testing**: Add unit tests for API service and component integration