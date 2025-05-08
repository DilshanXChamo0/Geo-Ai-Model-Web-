import React, { useEffect } from 'react';
import icon from '../resources/icon.jpg';
import './style.css';

const splash = () => {

    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = '/main';
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
            gap: '10px'
        }}>
            <img src={icon} alt="logo" width={60} />
            <h1 className='kanit_500' style={{
                paddingBottom: '10px',
                fontWeight: 500
            }}>Geo Ai</h1>
            <footer className="footer">
                <p>© Developed by Dilshan | Freely Usable Model</p>
            </footer>
        </div>
    )

}

export default splash