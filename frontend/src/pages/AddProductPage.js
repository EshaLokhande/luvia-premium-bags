import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('stock', stock);
            formData.append('image', image);

            await axios.post('http://localhost:5000/api/products', formData, {
                headers: {
                    Authorization : `Bearer ${user.token}`
                }
            })
            navigate('/admin');
        } catch (error) {
            setError('Error adding product');
        } finally {
            setLoading(false);
        }
    }

    
return (
    <div className='min-h-screen bg-gray-50'>
        <div className='max-w-lg mx-auto px-6 py-12'>

            <h1>ADD PRODUCT</h1>

            {/* error box */}
            {error && <div>{error}</div>}

            <form onSubmit={handleSubmit}>

                {/* name input */}
                <input
                    type='text'
                    placeholder='Product name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                {/* description */}
                <textarea
                    placeholder='Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                {/* price */}
                <input
                    type='number'
                    placeholder='Price'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                {/* category - dropdown! */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value=''>Select category</option>
                    <option value='Tote'>Tote</option>
                    <option value='Clutch'>Clutch</option>
                    <option value='Sling'>Sling</option>
                    <option value='Shopper'>Shopper</option>
                    <option value='Crossbody'>Crossbody</option>
                </select>

                {/* stock */}
                <input
                    type='number'
                    placeholder='Stock'
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                />

                {/* image upload */}
                <input
                    type='file'
                    onChange={(e) => setImage(e.target.files[0])}
                    // hint: files[0] = first file
                    accept='image/*'
                // accept only images!
                />

                {/* submit button */}
                <button type='submit' disabled={loading}>
                    {loading ? 'Adding...' : 'ADD PRODUCT'}
                </button>

            </form>
        </div>
    </div>
);


}

