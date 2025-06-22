import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/get-user', {
          withCredentials: true,
        });

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          console.error(res.data.message);
        }
      } catch (err) {
        console.error('Error fetching user data:', err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="p-4">Loading account details...</div>;

  if (!user) return <div className="p-4 text-danger">Failed to load user info.</div>;

  return (
    <div className="container bg-white shadow rounded-4 p-5 mt-4" style={{ maxWidth: '600px' }}>
      <h3 className="mb-4 fw-bold">My Account</h3>
      <ul className="list-group">
        <li className="list-group-item"><strong>User ID:</strong> {user.id}</li>
        <li className="list-group-item"><strong>First Name:</strong> {user.firstname}</li>
        <li className="list-group-item"><strong>Last Name:</strong> {user.lastname}</li>
        <li className="list-group-item">
          <strong>Verified:</strong>{' '}
          <span className={user.isAccountVerified ? 'text-success' : 'text-danger'}>
            {user.isAccountVerified ? 'Yes' : 'No'}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Account;
