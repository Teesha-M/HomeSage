import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const searchAddress = req.query.searchAddress || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      address: { $regex: searchAddress, $options: "i" },
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
const fetchListings = async () => {
  try {
    const res = await axios.get("/api/listings", {
      headers: {
        Authorization: `Bearer ${eoifkjefeu6193611986}`, 
      },
    });
    setListings(res.data);
  } catch (err) {
    console.error("Error fetching listings:", err);
  }
};

import express from "express";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find(); 
    res.json(listings);
  } catch (err) {
    console.error("Error fetching listings:", err); 
    res
      .status(500)
      .json({
        message: "Server error while fetching listings",
        error: err.message,
      });
  }
});

export const getListingsWithUserCount = async (req, res) => {
  try {
    const listings = await Listing.find().populate("userRef", "username");

    const usersWithListingCount = await User.find().lean();

    const listingsByUser = usersWithListingCount.map((user) => {
      const userListingCount = listings.filter((listing) =>
        listing.userRef._id.equals(user._id)
      ).length;
      return { ...user, listingCount: userListingCount };
    });

    res.status(200).json({
      listings,
      usersWithListingCount: listingsByUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
