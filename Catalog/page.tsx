"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

const CatalogPage = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', priceBDT: '', description: '', itemCode: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCatalogItems();
  }, []);

  const fetchCatalogItems = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:4000/buser/catalog/3/items', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setItems(response.data);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching catalog items.');
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post('http://localhost:4000/buser/item', newItem, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setItems([...items, response.data]);
      setNewItem({ name: '', priceBDT: '', description: '', itemCode: '' });
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while adding the item.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:4000/buser/item/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setItems(items.filter((item) => item.id !== itemId));
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while deleting the item.');
    }
  };

  return (
    <AuthLayout>
      <div className="p-4 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Catalog</h1>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <form onSubmit={handleAddItem} className="mb-4">
            <div className="grid md:grid-cols-4 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newItem.name}
                onChange={handleChange}
                className="input input-bordered w-full bg-white text-black shadow-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="number"
                name="priceBDT"
                placeholder="Price BDT"
                value={newItem.priceBDT}
                onChange={handleChange}
                className="input input-bordered w-full bg-white text-black shadow-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newItem.description}
                onChange={handleChange}
                className="input input-bordered w-full bg-white text-black shadow-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="text"
                name="itemCode"
                placeholder="Item Code"
                value={newItem.itemCode}
                onChange={handleChange}
                className="input input-bordered w-full bg-white text-black shadow-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button type="submit" className="btn btn-primary mt-4">
              Add Item
            </button>
          </form>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="card w-full bg-base-100 shadow-xl">
                <figure>
                  <img
                    src={item.imageUrl || ''}
                    alt={item.name}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    {item.name}
                    <div className="badge badge-secondary">BDT {item.priceBDT}</div>
                  </h2>
                  <p>{item.description}</p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">{item.itemCode}</div>
                    <button className="btn btn-error" onClick={() => handleDeleteItem(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default CatalogPage;