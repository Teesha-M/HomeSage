import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from "cookie-parser";
import adminRouter from './routes/admin.route.js';
import userRoutes from './controllers/adminuser.controller.js';
import Listing from "./models/listing.model.js";
import listingsRouter from './controllers/adminlisting.controller.js';
import getListingsWithUserCount from './controllers/listing.controller.js'

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected to MongoDB!!');
  }).catch((err) => {
    console.log(err);
  })


const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000!!!");
  });

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing', listingRouter);
app.use('api/listing/get', getListingsWithUserCount)

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRouter);
app.use('/api/listings', listingsRouter);


app.patch('/api/listing/updateContactCount/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).send('Listing not found.');

    listing.contactCount += 1; 
    await listing.save();

    res.status(200).send('Contact count updated.');
  } catch (error) {
    res.status(500).send('Server error');
  }});


app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    console.log('Fetching user with ID:', userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Server error');
  }
});


app.get('api/user/listings/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const listings = await Listing.find({ userId });
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).send('Server error');
  }
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})

app.patch('/api/listing/updateContactCount/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body; 

  try {
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).send('Listing not found.');

    
    if (!listing.contactClickUsers.includes(userId)) {
      listing.contactCount += 1;
      listing.contactClickUsers.push(userId); 
      await listing.save();
    }

    res.status(200).send('Contact count updated.');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

