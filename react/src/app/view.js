import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiDownload, FiX } from 'react-icons/fi';
import { FaArrowLeftLong } from "react-icons/fa6";

import axios from 'axios';
import icon from '../resources/icon.jpg';
import './style.css';

const View = () => {

    const [isGenerating, setIsGenerating] = useState(true);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { state } = useLocation();
    const effectRan = useRef(false);
    const navigate = useNavigate()

    const data = {
        prompt: state.prompt,
        numberOfImages: state.numberOfImages,
        resolution: state.resolution
    }

    const generateImages = async () => {

        setIsGenerating(true);
        setError(null);
        setImages([]);

        try {
            const response = await axios.post('http://localhost:5000/generate-image', {
                prompt: state.prompt,
                count: state.numberOfImages,
                resolution: state.resolution
            });

            if (!response.data.success || !response.data.images) {
                throw new Error(response.data.error || 'Invalid response from server');
            }

            setImages(response.data.images);

        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to generate images');
            console.error('Generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (effectRan.current) return;
        effectRan.current = true;
        generateImages();
    }, []);

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setSelectedImage(null);
            document.body.style.overflow = 'auto';
        }, 300);
    };

    return (
        <div className="generator-container">

            <div style={
                {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer'
                }
            }
                onClick={() => {
                    navigate('/main', { state: data })
                }}
            >
                <FaArrowLeftLong style={
                    {
                        backgroundColor: 'black',
                        color: 'white',
                        fontSize: '2.1rem',
                        padding: '10px',
                        borderRadius: '100%'
                    }
                } />
                Back
            </div>

            <header className="app-header">
                <div className='second-header'>
                    <img src={icon} alt='Geo_Logo' style={
                        {
                            width: '50px'
                        }
                    }
                    />
                    <h1 className='kanit_500'>Geo Ai model</h1>
                </div>
                <p className="subtitle">Premium Ai art generator known for stunning artistic outputs</p>
            </header>

            <main className="main-content">
                {isGenerating && (
                    <div className="generation-status">
                        <p>Image generation in progress – this will take just a few seconds</p>
                        <div className="skeleton-grid">
                            {Array.from({ length: state?.numberOfImages }).map((_, i) => (
                                <div key={i} className="skeleton-item">
                                    <div className="skeleton-shimmer"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}

                {images.length > 0 && (
                    <div className="image-results">
                        <div className="image-grid">
                            {images.map((imageUrl, index) => (
                                <div key={index} className="image-card">
                                    <div className="image-wrapper" onClick={() => openModal(imageUrl)}>
                                        <img
                                            src={imageUrl}
                                            alt={`Generated art ${index}`}
                                            className="generated-image"
                                        />
                                    </div>
                                    <button
                                        className="download-btn"
                                        onClick={() => window.open(imageUrl, '_blank')}
                                        aria-label="Download image"
                                    >
                                        <FiDownload className="download-icon" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!isGenerating && images.length === 0 && !error && (
                    <button
                        className="generate-button"
                        onClick={generateImages}
                    >
                        Generate Image
                    </button>
                )}

                {selectedImage && (
                    <div className={`image-modal ${isModalOpen ? 'modal-open' : 'modal-closing'}`}>
                        <div className="modal-overlay" onClick={closeModal}></div>
                        <div className="modal-content">
                            <button className="modal-close" onClick={closeModal}>
                                <FiX />
                            </button>
                            <img
                                src={selectedImage}
                                alt="Full size preview"
                                className="modal-image"
                            />
                        </div>
                    </div>
                )}
            </main>

            <footer className="footer">
                <p>© Developed by Dilshan | Freely Usable Model</p>
            </footer>
        </div>
    );
};

export default View;