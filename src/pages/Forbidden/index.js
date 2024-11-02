import React from 'react';
import { Button, Grid } from '@material-ui/core';
import illustration2 from '../../assets/images/illustrations/pack4/500.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';

const Forbidden = ({ title, description }) => {
    const history = useHistory();

    const handleGoHome = () => {
        history.push('/ui'); // Navigate to the homepage
    };

    return (
        <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
            <Grid
                container
                spacing={0}
                alignItems="center"
                justify="center"
            >
                <Grid item xs={10} style={{ textAlign: 'center' }}>
                    <div>
                        <img
                            src={illustration2}
                            className="w-50 mx-auto d-block mb-5 img-fluid"
                            alt="..."
                        />
                        <h1 className="display-1 mb-3 px-4 font-weight-bold">
                            {title}
                        </h1>
                        <h3 className="font-size-xxl line-height-sm font-weight-light d-block px-3 mb-3 text-black-50">
                            {description}
                        </h3>
                        <Button
                            className="btn-secondary px-5 font-size-sm font-weight-bold btn-animated-icon text-uppercase rounded shadow-sm-dark py-3 hover-scale-sm hover-scale-lg btn-pill mt-4 mx-4"
                            onClick={handleGoHome}
                        >
                            <span className="btn-wrapper--icon">
                                <FontAwesomeIcon icon={['fas', 'home']} />
                            </span>
                            <span className="btn-wrapper--label">
                                Go Home
                            </span>
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Forbidden;
