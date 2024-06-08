import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeChanger from '../ThemeChanger';
import axios from 'axios';

const AuthHeader = () => {
  const router = useRouter();
  const [theme, setTheme] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:4000/buser/search?name=${query}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'cupcake';
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);
    document.body.classList.add(`theme-${storedTheme}`);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.classList.remove(`theme-${theme}`);
    document.body.classList.add(`theme-${newTheme}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/signin');
  };

  return (
    <div className="navbar bg-gray-700">
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
              {searchResults.map((user) => (
                <div key={user.id} className="p-2 hover:bg-gray-100 cursor-pointer">
                  {user.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0">
          <li><a>Dashboard</a></li>
          <li>
            <details>
              <summary>Settings</summary>
              <ul className="p-2 bg-base-100">
                <li><Link href="/EditProfile">Edit Profile</Link></li>
                <li><Link href="/ChangePassword">Change Password</Link></li>
                <li>
                  <ThemeChanger theme={theme} onThemeChange={handleThemeChange} />
                </li>
              </ul>
            </details>
          </li>
          <li>
            <button className="btn btn-error" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AuthHeader;