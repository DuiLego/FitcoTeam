
import React from 'react';
import { useSelector } from 'react-redux';

const alertStyle = {
    fontSize: '16px',
    position: 'fixed',
    right: '20px',
    top: '80px',
    zIndex: 5000
}

const Alert = () => {

    const alerts = useSelector(state => state.alert);

    return (<div style={alertStyle}>
        {
            alerts !== null && alerts.length > 0 && alerts.map(
            alert => (
                <div key={alert.id} className={`alert alert-${alert.alertType}`}>
                    {alert.msg}
                </div>
            ))
        }
    </div>)
}

export default Alert;
