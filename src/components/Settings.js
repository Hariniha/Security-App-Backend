import React, { useState, useEffect } from 'react';
import { Shield, Bell, Moon, Sun, Smartphone, Lock, Eye, AlertTriangle, Save, User, Key, Clock, Loader2 } from 'lucide-react';
import SettingsApi from '../services/settingsApi';

const Settings = () => {
  // For demo purposes, using a hardcoded userId. In a real app, this would come from authentication context
  const userId = 'user123';

  const [settings, setSettings] = useState({
    twoFactorAuth: true,
    emailAlerts: true,
    autoLogout: 30,
    darkTheme: true,
    biometricAuth: false,
    sessionTimeout: 15,
    breachAlerts: true,
    chatNotifications: true,
    vaultNotifications: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [logs] = useState([
    { id: 1, action: 'Login successful', timestamp: '2024-01-15 14:30:25', location: 'New York, NY', ip: '192.168.1.1' },
    { id: 2, action: 'Password changed', timestamp: '2024-01-14 09:15:10', location: 'New York, NY', ip: '192.168.1.1' },
    { id: 3, action: '2FA enabled', timestamp: '2024-01-13 16:45:33', location: 'New York, NY', ip: '192.168.1.1' },
    { id: 4, action: 'Login attempt failed', timestamp: '2024-01-12 22:18:07', location: 'Unknown', ip: '203.45.67.89' },
  ]);

  // Load settings from backend on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const userSettings = await SettingsApi.getSettings(userId);
      
      if (userSettings) {
        setSettings(userSettings);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError('Failed to load settings. Using default values.');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    // Clear any existing messages
    setError(null);
    setSuccessMessage('');
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      const updatedSettings = await SettingsApi.saveSettings(userId, settings);
      setSettings(updatedSettings);
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Show loading spinner while initial data is loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3 text-cyan-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xl">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account security and preferences</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Save className="w-5 h-5 text-green-400" />
            <span className="text-green-300">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">Security</h3>
          </div>
          
          <div className="space-y-6">
            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-white font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-400">Add an extra layer of security</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {/* Biometric Authentication */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-white font-medium">Biometric Authentication</p>
                  <p className="text-sm text-gray-400">Use fingerprint or face ID</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.biometricAuth}
                  onChange={(e) => handleSettingChange('biometricAuth', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {/* Auto Logout */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-white font-medium">Auto Logout</p>
                  <p className="text-sm text-gray-400">Minutes of inactivity</p>
                </div>
              </div>
              <select
                value={settings.autoLogout}
                onChange={(e) => handleSettingChange('autoLogout', Number(e.target.value))}
                className="bg-slate-700 text-white text-sm rounded px-3 py-2 border border-slate-600 focus:border-cyan-500 focus:outline-none"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={0}>Never</option>
              </select>
            </div>

            {/* Session Timeout */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-white font-medium">Session Timeout</p>
                  <p className="text-sm text-gray-400">Auto-lock after inactivity</p>
                </div>
              </div>
              <select
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', Number(e.target.value))}
                className="bg-slate-700 text-white text-sm rounded px-3 py-2 border border-slate-600 focus:border-cyan-500 focus:outline-none"
              >
                <option value={5}>5 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">Notifications</h3>
          </div>
          
          <div className="space-y-6">
            {/* Email Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Alerts</p>
                <p className="text-sm text-gray-400">Security notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {/* Breach Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Breach Alerts</p>
                <p className="text-sm text-gray-400">Notifications for data breaches</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.breachAlerts}
                  onChange={(e) => handleSettingChange('breachAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {/* Chat Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Chat Notifications</p>
                <p className="text-sm text-gray-400">New secure message alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.chatNotifications}
                  onChange={(e) => handleSettingChange('chatNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {/* Vault Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Vault Notifications</p>
                <p className="text-sm text-gray-400">File expiry and access alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.vaultNotifications}
                  onChange={(e) => handleSettingChange('vaultNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {settings.darkTheme ? <Moon className="w-5 h-5 text-cyan-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                <div>
                  <p className="text-white font-medium">Dark Theme</p>
                  <p className="text-sm text-gray-400">Switch to light mode</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.darkTheme}
                  onChange={(e) => handleSettingChange('darkTheme', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Security Log */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/20 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">Account Security Log</h3>
          </div>
        </div>
        <div className="divide-y divide-slate-700/50">
          {logs.map((log) => (
            <div key={log.id} className="p-6 hover:bg-slate-700/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    log.action.includes('failed') ? 'bg-red-400' :
                    log.action.includes('successful') ? 'bg-green-400' :
                    'bg-cyan-400'
                  }`}></div>
                  <div>
                    <p className="text-white font-medium">{log.action}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <span>{log.timestamp}</span>
                      <span>•</span>
                      <span>{log.location}</span>
                      <span>•</span>
                      <span>IP: {log.ip}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;