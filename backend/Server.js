const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    "https://cleanlydemo.netlify.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const User = require('./models/User');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const cleanerRoutes = require('./routes/cleanerRoutes');
const { JWT_SECRET } = require('./middleware/auth');

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI).then(async () => {
    console.log('MongoDB Connected Successfully');
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));

app.post('/api/auth/register', async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({success: false, message: 'Email and Password required.'})
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({sucess: false, message: 'Email and Pass already exists.'})
        }

        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ email, password: hashedPassword });
            await newUser.save();

            res.status(201).json({ success: true, message: 'Account created successfully'});
        };
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({ email });
        if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({id: user.id, role: user.role}, JWT_SECRET, {expiresIn: '24h'});

        res.json({success: true, token, user:{id: user.id, email: user.email, role: user.role}});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
});

app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/cleaners', cleanerRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

