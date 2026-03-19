const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collabstr').then(async () => {
  const User = require('./models/User.js');
  const newPassword = await bcrypt.hash('password123', 10);
  
  const users = await User.find({ isVerified: true });
  console.log('Found verified users:', users.length);
  
  for (const user of users) {
    const match = await bcrypt.compare('password123', user.password);
    if (!match) {
      user.password = newPassword;
      await user.save();
      console.log('Updated password for:', user.email);
    }
  }
  
  console.log('Done!');
  process.exit();
});

// WARNING: RUN ONLY ONCE FOR PASSWORD FIX, THEN DELETE OR COMMENT OUT
