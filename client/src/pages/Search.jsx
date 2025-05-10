import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    searchAddress: "", 
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const searchAddressFromUrl = urlParams.get("searchAddress"); 
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      searchAddressFromUrl || 
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        searchAddress: searchAddressFromUrl || "", 
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
        offer: offerFromUrl === "true",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "all" || e.target.id === "rent" || e.target.id === "sale") {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (e.target.id === "searchAddress") { 
      setSidebardata({ ...sidebardata, searchAddress: e.target.value });
    }

    if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("searchAddress", sidebardata.searchAddress); 
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 8) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-72 h-72 bg-white opacity-10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative flex flex-col md:flex-row">
        <div className="p-7 bg-white bg-opacity-80 rounded-lg border-b-2 md:border-r-2 md:min-h-screen backdrop-blur-md shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap font-semibold text-gray-800">
                Search Listing:
              </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Search..."
                className="border rounded-lg p-3 w-full"
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
            </div>

            
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap font-semibold text-gray-800">
                Search Address:
              </label>
              <input
                type="text"
                id="searchAddress" 
                placeholder="Enter address..."
                className="border rounded-lg p-3 w-full"
                value={sidebardata.searchAddress}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <label className="font-semibold text-gray-800">Type:</label>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="all"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.type === "all"}
                />
                <span>Rent & Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.type === "rent"}
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.type === "sale"}
                />
                <span>Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.offer}
                />
                <span>Offer</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <label className="font-semibold text-gray-800">Amenities:</label>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.parking}
                />
                <span>Parking</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.furnished}
                />
                <span>Furnished</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-semibold text-gray-800">Sort:</label>
              <select
                onChange={handleChange}
                defaultValue={"created_at_desc"}
                id="sort_order"
                className="border rounded-lg p-3"
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>

            <button className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95 transition duration-300 ease-in-out">
              Search
            </button>
          </form>
        </div>

        <div className="flex-1 bg-white bg-opacity-80 backdrop-blur-md shadow-lg rounded-lg p-7">
          <h1 className="text-3xl font-semibold border-b p-3 text-gray-800 mt-5">
            Listing results:
          </h1>
          <div className="p-7 flex flex-wrap gap-4">
            {!loading && listings.length === 0 && (
              <p className="text-xl text-gray-800">No listing found!</p>
            )}
            {loading && (
              <p className="text-xl text-gray-800 text-center w-full">
                Loading...
              </p>
            )}

            {!loading &&
              listings &&
              listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}

            {showMore && (
              <button
                onClick={onShowMoreClick}
                className="bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg shadow-md hover:from-teal-500 hover:to-blue-600 transition-transform transform hover:scale-105 hover:underline p-7 text-center w-full"
              >
                Show more
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
