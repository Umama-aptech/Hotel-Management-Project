const Setting = require('../models/Setting');

const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne({});
    // Create defaults if they don't exist yet
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { 
      taxRate, 
      hotelName, 
      hotelEmail,
      hotelAddress,
      hotelPhone,
      cancellationPolicy, 
      baseRoomPriceMultiplier 
    } = req.body;
    
    let settings = await Setting.findOne({});
    if (!settings) {
      settings = new Setting();
    }

    if (taxRate !== undefined) settings.taxRate = taxRate;
    if (hotelName !== undefined) settings.hotelName = hotelName;
    if (hotelEmail !== undefined) settings.hotelEmail = hotelEmail;
    if (hotelAddress !== undefined) settings.hotelAddress = hotelAddress;
    if (hotelPhone !== undefined) settings.hotelPhone = hotelPhone;
    if (cancellationPolicy !== undefined) settings.cancellationPolicy = cancellationPolicy;
    if (baseRoomPriceMultiplier !== undefined) settings.baseRoomPriceMultiplier = baseRoomPriceMultiplier;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
