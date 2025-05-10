import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-xl transform hover:scale-105 transition-transform duration-300 rounded-lg overflow-hidden w-10 sm:w-[500px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0] || ''}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="p-4 flex flex-col gap-3">
          <p className="truncate text-lg font-bold text-gray-900">
            {listing.name}
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MdLocationOn className="h-5 w-5 text-green-600" />
            <p className="truncate">{listing.address}</p>
          </div>
          <p className="text-gray-700 line-clamp-2">{listing.description}</p>
          <p className="text-lg font-semibold text-blue-600 mt-3">
            ₹{listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className="flex text-gray-900 gap-6 mt-2 text-sm">
            <div className="font-bold">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Beds`
                : `${listing.bedrooms} Bed`}
            </div>
            <div className="font-bold">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Baths`
                : `${listing.bathrooms} Bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
