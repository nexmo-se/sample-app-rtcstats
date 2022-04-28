import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from './styles';
import { useEffect, useState } from 'react';
import { getIpInfo, reverseLookup } from '../../api/ipData';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function InfoCard({
  connectionType,
  ip,
  protocol,
  srtpCipher,
  hasVPN,
  simulcastLayers,
}) {
  const [ipData, setIpData] = useState(null);

  // useEffect(() => {
  //   reverseLookup(ip.ip)
  //     .then(({ data }) => {
  //       setIpData(data.regionName);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [ip]);

  useEffect(() => {
    console.log(simulcastLayers);
  }, [simulcastLayers]);

  const classes = styles();
  return (
    <Card sx={{ maxHeight: 250 }}>
      <CardContent className={classes.root} component="div">
        {/* {ipData && (
          <Typography
            sx={{ fontSize: 14 }}
            component="div"
            color="text.secondary"
            gutterBottom
          >
            {ip.type === 'direct' && `Media Server IP: ${ip.ip}`}
            {ip.type === 'relay' && `Media Relayed through ${ipData}`}
          </Typography>
        )} */}
        <Typography
          sx={{ fontSize: 14 }}
          component="div"
          color="text.secondary"
          gutterBottom
        >
          Connection type : {connectionType.toUpperCase()}
        </Typography>
        <Typography
          sx={{ fontSize: 14 }}
          component="div"
          color="text.secondary"
          gutterBottom
        >
          Protocol : {protocol.toUpperCase()}
        </Typography>
        <Typography
          sx={{ fontSize: 14 }}
          component="div"
          color="text.secondary"
          gutterBottom
        >
          SRTP Cipher : {srtpCipher}
        </Typography>
        {hasVPN && (
          <Typography
            sx={{ fontSize: 14 }}
            component="div"
            color="text.secondary"
            gutterBottom
          >
            VPN : {hasVPN ? 'Yes' : 'No'}
          </Typography>
        )}
        {simulcastLayers &&
          simulcastLayers.map((e) => (
            <Typography
              sx={{ fontSize: 14 }}
              component="div"
              color="text.secondary"
              gutterBottom
            >
              Resolution : {`${e.width}x${e.height}`}
            </Typography>
          ))}
        {/* {simulcastLayers && simulcastLayers.map(e => (
        <Typography sx={{ fontSize: 14 }}
            component="div"
            color="text.secondary"
            gutterBottom>{e.frameWidth}
            </Typography>
        } */}
      </CardContent>
    </Card>
  );
}
