const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class SettingsApi {
  /**
   * Get user settings
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} User settings
   */
  static async getSettings(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  }

  /**
   * Save user settings
   * @param {string} userId - The user ID
   * @param {Object} settings - Settings object to save
   * @returns {Promise<Object>} Updated settings
   */
  static async saveSettings(userId, settings) {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }
}

export default SettingsApi;