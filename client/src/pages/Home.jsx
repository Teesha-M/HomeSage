import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { motion } from "framer-motion";
import "mapbox-gl/dist/mapbox-gl.css"; 
import mapboxgl from "mapbox-gl"; 
import { map } from "leaflet";
import logo from '../assets/homesage-high-resolution-logo-transparent (4).png';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [visitedListings, setVisitedListings] = useState([]);
  const [listings, setListings] = useState([]);
  const mapContainerRef = useRef(null); 

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=6");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=6");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=6");
        const data = await res.json();
        setSaleListings(data);
        fetchVisitedListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchVisitedListings = async () => {
      try {
        const res = await fetch("/api/listing/get?sort=contactCount&limit=6");
        const data = await res.json();
        setVisitedListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listing/get"); 
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia2lsb21pa2UiLCJhIjoiY20yN2FndGhtMWFpdjJpc2dicnkxZjlpYiJ9.xEUjg1FueJBs9v4KvE0DwA";
    if (!listings.length) return;

    const map = new mapboxgl.Map({
      container: "map", 
      style: "mapbox://styles/mapbox/streets-v11", 
      center: [72.8777, 19.076], 
      zoom: 12, 
    });

    
    listings.forEach((listing, index) => {
      setTimeout(async () => {
        const coords = await geocodeAddress(listing.address);
        if (coords) {
         
          const marker = new mapboxgl.Marker()
            .setLngLat([coords.lng, coords.lat])
            .addTo(map);

          
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="text-align: center; border: 1px solid #e0e0e0; border-radius: 10px; padding: 15px; background-color: #fff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: transform 0.3s;">
  <img 
    src="${listing.imageUrls[0]}" 
    alt="${listing.name}" 
    style="width: 100px; height: auto; border-radius: 10px; margin-bottom: 10px; border: 2px solid #007bff; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);" 
  />
  <h3 style="margin: 5px 0; font-size: 1.2rem; font-weight: bold; color: #333;">${
    listing.name
  }</h3>
  <p style="margin: 0; font-size: 0.9rem; color: green; font-weight: bold;">For: ${
    listing.type
  }</p>
  <p style="margin: 0; font-size: 1rem; color: #007bff; font-weight: bold;">Price: ₹${Number(
    listing.discountPrice
  ).toLocaleString()}</p>
</div>
        `);

          
          marker.setPopup(popup);

          
          marker.getElement().addEventListener("mouseenter", () => {
            popup.addTo(map);
          });

          marker.getElement().addEventListener("mouseleave", () => {
            popup.remove(); 
          });

          marker.getElement().addEventListener("click", () => {
           
            window.location.href = `/listing/${listing._id}`;
          });
        }
      }, index * 500); 
    });
    return () => map.remove(); 
  }, [listings]);

  
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        console.log(`Geocoded: ${address} -> (${lat}, ${lng})`);
        return { lng, lat };
      } else {
        console.warn(`No coordinates found for: ${address}`);
        return null;
      }
    } catch (error) {
      console.error(`Error geocoding ${address}:`, error);
      return null;
    }
  };

  const addMarkerWithOffset = (coords, title, address) => {
    const offset = Math.random() * 0.001; 
    new mapboxgl.Marker()
      .setLngLat([coords.lng + offset, coords.lat + offset])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setText(`${title} - ${address}`)
      )
      .addTo(map);
  };

  const bounds = new mapboxgl.LngLatBounds();

  listings.forEach(async (listing) => {
    const coords = await geocodeAddress(listing.address);
    if (coords) {
      new mapboxgl.Marker()
        .setLngLat([coords.lng, coords.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setText(
            `${listing.title} - ${listing.address}`
          )
        )
        .addTo(map);

      bounds.extend([coords.lng, coords.lat]);
    }
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute top-24 right-48 z-10">
  <Link to="/">
    <img
      src={logo}
      alt="HOMESAGE Logo"
      className="h-96 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      style={{
        
        padding: "10px", 
      }}
    />
  </Link>
</div>

     
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 opacity-80"></div>
        <div className="absolute inset-0 bg-[url('/path-to-your-pattern.svg')] bg-cover bg-fixed mix-blend-multiply opacity-50"></div>
        
        <motion.div
          className="absolute inset-0"
          animate={{ y: ["-10%", "10%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 200 200"
            preserveAspectRatio="none"
          >
            <circle cx="100" cy="100" r="60" fill="#fff" opacity="0.2" />
            <circle cx="150" cy="50" r="40" fill="#fff" opacity="0.15" />
            <circle cx="50" cy="150" r="50" fill="#fff" opacity="0.1" />
          </svg>
        </motion.div>
      </div>

      
      <div >
      <div className="relative z-10 flex flex-col items-center gap-8 py-20 px-6 max-w-7xl mx-auto ml-14 text-center text-white">
  <motion.h1
    className="text-7xl lg:text-9xl font-extrabold tracking-tight leading-tight"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    style={{
      textShadow: "4px 4px 12px rgba(0, 0, 0, 0.7)",
    }}
    whileHover={{ textShadow: "8px 8px 20px rgba(0, 0, 0, 0.9)" }}
  >
    Discover Your <span className="text-blue-300">Dream Home</span>
  </motion.h1>
  <motion.p
    className="text-lg sm:text-4xl max-w-3xl"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.5 }}
  >
    Explore a curated selection of properties to find the perfect fit for
    you and your family.
  </motion.p>
  
</div>
<div className="relative z-10 flex flex-col items-center gap-8 py-10 px-6 max-w-7xl mx-auto ml-96 text-center text-white">
<motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.8, delay: 1 }}
    whileHover={{ scale: 1.1 }}
  >
    <Link
      to="/search"
      className="inline-block text-lg sm:text-4xl bg-blue-600 text-white hover:bg-blue-700 rounded-full px-8 py-1 font-semibold shadow-xl transition-transform transform hover:scale-110"
    >
      Start Your Search
    </Link>
  </motion.div>
  </div>
  </div>

  


  {offerListings.length > 0 && (
        <Swiper
          navigation
          className="relative z-10 max-w-7xl mx-auto mb-16 rounded-lg overflow-hidden shadow-xl"
        >
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              
            
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.title}
                  className="w-full h-[500px] object-contain" 
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

   
      <div className="relative z-10 max-w-[90%] mx-auto px-6 py-16"> 

        {offerListings.length > 0 && (
          <EnhancedListingSection
            title="Latest Offers"
            listings={offerListings}
            link="/search?offer=true"
            linkText="Explore more offers"
            borderColor="border-yellow-400"
            buttonColor="from-yellow-500 to-yellow-700"
            textColor="text-white"
            shadowColor="text-shadow-md"
          />
        )}

        {rentListings.length > 0 && (
          <EnhancedListingSection
            title="Trending Rentals"
            listings={rentListings}
            link="/search?type=rent"
            linkText="Explore more rentals"
            borderColor="border-green-400"
            buttonColor="from-green-500 to-green-700"
            textColor="text-white"
            shadowColor="text-shadow-md"
          />
        )}

        {saleListings.length > 0 && (
          <EnhancedListingSection
            title="Properties for Sale"
            listings={saleListings}
            link="/search?type=sale"
            linkText="Explore more sales"
            borderColor="border-cyan-300"
            buttonColor="from-cyan-300 to-cyan-600"
            textColor="text-white"
            shadowColor="text-shadow-md"
          />
        )}

        {visitedListings.length > 0 && (
          <EnhancedListingSection
            title="Most Visited Properties"
            listings={visitedListings}
            link="/search?sort=contactCount"
            linkText="Explore more popular Properties"
            borderColor="border-yellow-400"
            buttonColor="from-yellow-500 to-yellow-700"
            textColor="text-white"
            shadowColor="text-shadow-md"
          />
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-5xl font-extrabold text-gray-900 text-center mb-6">
            Search By Location
          </h2>
          <div className="flex justify-center">
            {" "}
           
            <div
              id="map"
              style={{
                width: "300%",
                height: "600px", 
                border: "5px solid #007bff",
                borderRadius: "15px", 
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 8px 30px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0, 0, 0, 0.1)";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
function EnhancedListingSection({title,listings,link,linkText,borderColor,buttonColor,textColor,shadowColor,onContactClick,})
 {
  return (
    <motion.div
      className={`mb-16 border-4 ${borderColor} p-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h2
          className={`text-3xl font-semibold ${textColor}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            textShadow: shadowColor,
          }}
        >
          {title}
        </motion.h2>
        <Link
          className={`text-lg bg-gradient-to-r ${buttonColor} text-white font-bold rounded-lg px-6 py-3 shadow-md transition-transform transform hover:scale-105 hover:shadow-xl`}
          to={link}
        >
          {linkText}
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {listings.map((listing) => (
          <motion.div
            key={listing._id}
            className="shadow-xl transform hover:scale-105 transition-transform duration-300 bg-white rounded-lg overflow-hidden"
            whileHover={{ scale: 1.05, rotate: 1 }}
          >
            <ListingItem listing={listing} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
