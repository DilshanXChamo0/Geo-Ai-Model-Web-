import React, { useEffect, useState } from 'react';

import { FiImage, FiSettings, FiDownload } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import './style.css';
import icon from '../resources/icon.jpg';

function Main() {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [numberOfImages, setNumberOfImages] = useState(1);
    const [resolution, setResolution] = useState('1024x1024');
    const { state } = useLocation();

    useEffect(() => {
        if (state) {
            setPrompt(state.prompt);
            setNumberOfImages(state.numberOfImages);
            setResolution(state.resolution);
        }
    }, [])

    const data = {
        prompt: prompt,
        numberOfImages: numberOfImages,
        resolution: resolution
    }

    return (
        <div className='main'>
            <div className="app">
                <header className="app-header">
                    <div className='second-header'>
                        <img src={icon} alt='Geo_Logo' style={{ width: '50px' }} />
                        <h1 className='kanit_500'>Hi, I'm Geo AI Model</h1>
                    </div>
                    <p className="subtitle">Premium Ai art generator known for stunning artistic outputs</p>
                </header>

                <main className="app-main">
                    <div className="prompt-section">
                        <h2>What will you imagine? <FiImage className="icon" /></h2>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the image you want to generate..."
                        />
                    </div>

                    <div className="settings-row">
                        <div className="setting">
                            <label><FiSettings className="icon" /> Number Of Images</label>
                            <div className="value-display">{numberOfImages}</div>
                            <input
                                type="range"
                                min="1"
                                max="8"
                                value={numberOfImages}
                                onChange={(e) => setNumberOfImages(e.target.value)}
                            />
                        </div>

                        <div className="setting">
                            <label><FiSettings className="icon" /> Resolution</label>
                            <div className="value-display">{resolution}</div>
                            <select
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                                className="resolution-select"
                            >
                                <option value="512x512">512 x 512</option>
                                <option value="1024x1024">1024 x 1024</option>
                                <option value="2048x2048">2048 x 2048</option>
                            </select>
                        </div>
                    </div>

                    <button
                        className="generate-button btn"
                        onClick={() => {
                            if (prompt && prompt.trim() !== '') {
                                navigate('/generate-images', { state: data });
                            }
                        }}
                        disabled={!prompt || prompt.trim() === ''}
                    >
                        Generate Image <FiDownload className="icon" />
                    </button>
                </main>
            </div>
        </div>
    );
}

export default Main;