import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaParking,
  FaShare,
  FaMapMarkerAlt
} from 'react-icons/fa';
import Contact from '../components/Contact';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css'; // Ensure Leaflet CSS is imported
import { geocodeAddress } from '../utils/geocode';
import ListingMap from '../components/ListingMap';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [contactCount, setContactCount] = useState(0);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const geolocation = listing?.geolocation || { lat: 0, lng: 0 };
  const defaultPosition = [51.505, -0.09];
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (listing && listing.address) {
        const coords = await geocodeAddress(listing.address);
        console.log('Fetched coordinates:', coords); // Log coordinates for debugging
        setCoordinates(coords);
      }
    };
  
    fetchCoordinates();
  }, [listing]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch data from the API.");
        }
        const data = await res.json();

        console.log('API Response:', data); // Log the API response

        if (!data || typeof data !== 'object' || data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        if (typeof data.name !== 'string' || !Array.isArray(data.imageUrls) || typeof data.address !== 'string') {
          throw new Error("Invalid data format received from the API.");
        }

        setListing(data);
        setContactCount(data.contactCount); // Set initial contact count
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error("Error fetching listing:", error.message);
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleContactClick = async () => {
    setContact(true);

    try {
      const res = await fetch(`/api/listing/updateContactCount/${listing._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser._id }) // Send the user ID
      });
      const data = await res.json();
      if (data.success) {
        setContactCount((prevCount) => prevCount + 1); // Update contact count on success
      }
    } catch (error) {
      console.error("Error updating contact count:", error);
    }
  };



  return (
    <main className="p-16 relative min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 overflow-hidden">
    {/* Background SVG Art */}
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1440 320">
      <path fill="#D1FAE5" d="M0,64L1440,128L1440,320L0,320Z" opacity="0.5"></path>
    </svg>
    <svg className="absolute bottom-0 right-0 w-full h-full pointer-events-none" viewBox="0 0 1440 320">
      <path fill="#E5E7EB" d="M0,128L1440,256L1440,320L0,320Z" opacity="0.5"></path>
    </svg>
  
  {/* Background Effect */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 opacity-30"></div>
  <div className="absolute inset-0 bg-radial-gradient from-gray-400 to-transparent opacity-20"></div>

  {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
  {error && <p className="text-center my-7 text-2xl text-red-600">Something went wrong!</p>}

  {listing && !loading && !error && (
    <div className="relative max-w-6xl mx-auto p-10 bg-white rounded-lg shadow-2xl z-10 backdrop-blur-md">
      <Swiper navigation>
        {listing.imageUrls.map((url) => (
          <SwiperSlide key={url}>
            <div
              className="h-[600px] bg-cover bg-center"
              style={{ backgroundImage: `url(${url})` }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute top-2 right-3 z-10 bg-cyan-300 rounded-full p-4 shadow-lg cursor-pointer">
        <FaShare
          className="text-gray-600"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
        />
      </div>

      {copied && (
        <p className="absolute top-16 right-5 z-10 bg-white rounded-md p-2 shadow-lg">
          Link copied!
        </p>
      )}

      <div className="flex flex-col gap-6">
        <p className="text-2xl font-semibold">
          {listing.name} - ₹ {' '}
          {listing.offer
            ? listing.discountPrice.toLocaleString('en-IN')
            : listing.regularPrice.toLocaleString('en-IN')}
          {listing.type === 'rent' && ' / month'}
        </p>
        <p className="flex items-center gap-2 text-gray-600 text-sm">
          <FaMapMarkerAlt className="text-green-700" />
          {listing.address}
        </p>
        <div className="flex gap-4 mb-4">
  <p className={`w-full max-w-[200px] text-center p-2 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out ${listing.type === 'rent' ? 'bg-green-600 text-white font-bold scale-105' : 'bg-blue-600 text-white font-bold scale-105'}`}>
    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
  </p>
    {listing.offer && (
    <p className="w-full max-w-[200px] text-center p-2 rounded-lg shadow-lg bg-red-500 text-white font-bold transform transition-transform duration-300 ease-in-out scale-105">
      ₹ {(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-IN')} OFF
    </p>
  )}
</div>

        <p className="text-gray-800">
          <span className="font-semibold text-black">Description - </span>
          {listing.description}
        </p>

        <ul className="text-green-800 font-semibold text-sm flex flex-wrap items-center gap-4">
          <li className="flex items-center gap-1">
            <FaBed className="text-2xl" />
            {listing.bedrooms > 1
              ? `${listing.bedrooms} beds `
              : `${listing.bedrooms} bed `}
          </li>
          <li className="flex items-center gap-1">
            <FaBath className="text-2xl" />
            {listing.bathrooms > 1
              ? `${listing.bathrooms} baths `
              : `${listing.bathrooms} bath `}
          </li>
          <li className="flex items-center gap-1">
            <FaParking className="text-2xl" />
            {listing.parking ? 'Parking spot' : 'No Parking'}
          </li>
          <li className="flex items-center gap-1">
            <FaChair className="text-2xl" />
            {listing.furnished ? 'Furnished' : 'Unfurnished'}
          </li>
        </ul>

        <div className="mt-4 p-3 bg-blue-200 rounded-md shadow-md w-full max-w-md">
          <p className="text-blue-900 font-semibold text-lg">
            {contactCount} {contactCount === 1 ? 'person has' : 'people have'} shown interest in this property.
          </p>
        </div>

        {currentUser && listing.userRef !== currentUser._id && !contact && (
          <button
            onClick={handleContactClick}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50"
          >
            Contact Owner
          </button>
        )}

        {contact && <Contact listing={listing} />}
      </div>

      <div className="p-6 w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
      {coordinates ? (
        <ListingMap coordinates={coordinates} />
      ) : (
        <p>Loading map...</p>
      )}
      </div>
    </div>
  )}
</main>

  );
}
