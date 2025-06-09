const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
  postBoxNo: { type: String, required: true },
  addlNo: { type: String, required: true },
  buildingNo: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
  vatNumber: { type: String, required: true },
  crn: { type: String, required: true },
  logo: { type: String }, // image path or URL

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
}, { timestamps: true });

// Password hashing middleware
companySchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
companySchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Company', companySchema);