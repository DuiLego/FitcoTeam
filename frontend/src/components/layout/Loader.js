
import React from 'react';
import { useSelector } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner';

const Loader = () => {
    const loader = useSelector(state => state.loader);

    return (
        loader && 
            <div className="loader_container">
                <div className="text-center">
                    <img className="d-inline-block my-4" alt="logo" width="120" src={process.env.REACT_APP_PUBLIC_ROUTE + '/assets/images/image.png'}/>
                    <div className="animation_container">
                        <ThreeDots 
                            height="70" 
                            width="70" 
                            radius="9"
                            color="#00cdc1" 
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{ display: 'block' }}
                            visible={true}
                        />
                    </div>
                </div>
            </div>
    )
}

export default Loader;
