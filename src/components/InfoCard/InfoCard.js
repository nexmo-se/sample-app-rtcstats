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
  jitterAudio,
  jitterVideo,
  rtt,
  audioPacketsLost,
  bytesReceived,
  subscriberRes,
  subscriberFps,
}) {
  // useEffect(() => {
  //   reverseLookup(ip.ip)
  //     .then(({ data }) => {
  //       setIpData(data.regionName);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [ip]);

  const classes = styles();
  return (
    <Card sx={{ maxHeight: 750 }}>
      <CardContent className={classes.root} component="div">
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
          Jitter Audio : {jitterAudio}
        </Typography>
        <Typography
          sx={{ fontSize: 14 }}
          component="div"
          color="text.secondary"
          gutterBottom
        >
          Audio Packet Lost : {`${audioPacketsLost * 100} %`}
        </Typography>
        <Typography
          sx={{ fontSize: 14 }}
          component="div"
          color="text.secondary"
          gutterBottom
        >
          Round trip time : {rtt}
        </Typography>
        <Typography
          sx={{ fontSize: 14 }}
          component="div"
          color="text.secondary"
          gutterBottom
        >
          Jitter Video : {jitterVideo}
        </Typography>
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
        {/*
        <Typography
          sx={{ fontSize: 14 }}
          component="div"
          color="text.secondary"
          gutterBottom
        >
          Protocol : {protocol.toUpperCase()}
        </Typography>
        
        {hasVPN && (
          <Typography
            sx={{ fontSize: 14 }}
            component="div"
            color="text.secondary"
            gutterBottom
          >
            VPN : {hasVPN ? 'Yes' : 'No'}
          </Typography> */}
        {/* )} */}
        {/* <Typography
          sx={{ fontSize: 14 }}
          component="div"
          color="text.secondary"
          gutterBottom
        >
          SRTP Cipher : {srtpCipher}
        </Typography> */}
        {subscriberFps && (
          <Typography
            sx={{ fontSize: 14 }}
            component="div"
            color="text.secondary"
            gutterBottom
          >
            Subscriber FPS : {subscriberFps}
          </Typography>
        )}
        {subscriberRes && (
          <Typography
            sx={{ fontSize: 14 }}
            component="div"
            color="text.secondary"
            gutterBottom
          >
            Subscriber Resolution : {subscriberRes}
          </Typography>
        )}

        {bytesReceived && (
          <Typography
            sx={{ fontSize: 14 }}
            component="div"
            color="text.secondary"
            gutterBottom
          >
            Download BW (Kbps) : {bytesReceived}
          </Typography>
        )}
        {simulcastLayers &&
          simulcastLayers.map((e, index) => (
            <Typography
              key={index}
              sx={{ fontSize: 14 }}
              component="div"
              color="text.secondary"
              gutterBottom
            >
              <ul>
                <li>Resolution : {`${e.width}x${e.height}`}</li>
                <li>Quality limitation : {e.qualityLimitationReason}</li>
                <li>FPS: {e.framesPerSecond}</li>
                <li>Bitrate Kbps: {Math.round(e.bytes)}</li>
              </ul>
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
