import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="bg-white p-5 border border-gray-200 rounded-lg max-w-lg mx-auto mt-8 shadow-sm">
          <p className="text-gray-800 mb-4">
            Reach out to  <span className="font-medium text-indigo-600">{landlord.username}</span>{' '}
            for{' '}
            <span className="font-medium text-indigo-600">{listing.name}</span>
          </p>

          <textarea
            name="message"
            id="message"
            rows="3"
            value={message}
            onChange={onChange}
            placeholder="Write your message..."
            className="w-full border border-gray-300 p-3 rounded-md mb-3 focus:ring focus:ring-indigo-300 focus:border-indigo-500"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="block bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-500 transition ease-in-out duration-150"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
