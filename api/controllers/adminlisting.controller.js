import express from 'express';
import Listing from '../models/listing.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().populate('user');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




router.delete('/:id', async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
