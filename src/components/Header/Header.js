import React, { useContext, useEffect, useRef, useState } from 'react';
import useStyles from './style';

export default function Header() {
  const classes = useStyles();
  return (
    <div className={classes.toolbar}>
      <img
        src={process.env.PUBLIC_URL + '/Vonage.png'}
        className="vonage-logo"
        alt="vonage-logo"
        style={{ height: 50 }}
      />
      <h3 className={classes.text}>RTCStats sample app</h3>
    </div>
  );
}

// export default Navbar
