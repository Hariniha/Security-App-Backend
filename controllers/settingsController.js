const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne({ userId: req.params.userId });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveSettings = async (req, res) => {
  try {
    // Check if settings exist
    const existing = await Settings.findOne({ userId: req.params.userId });
    let settings;
    if (existing) {
      settings = await Settings.findOneAndUpdate(
        { userId: req.params.userId },
        req.body,
        { new: true }
      );
      res.status(200).json(settings);
    } else {
      settings = new Settings({ ...req.body, userId: req.params.userId });
      await settings.save();
      res.status(201).json(settings);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
