import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

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
  simulcastDef,
  haveSubscriberStats,
  subscriberPacketLost,
}) {
  const classes = styles();
  return (
    <Card sx={{ maxHeight: 750 }}>
      <CardContent className={classes.root} component="div">
        <Typography
          sx={{ fontSize: 18 }}
          component="h1"
          color="text.primary"
          gutterBottom
        >
          Publisher stats
        </Typography>
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
          Jitter Audio : {jitterAudio?.toFixed(4)}
        </Typography>
        <Typography
          sx={{ fontSize: 14 }}
          component="div"
          color="text.secondary"
          gutterBottom
        >
          Audio Packet Lost : {`${audioPacketsLost * 100} %`}
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
        {simulcastLayers &&
          simulcastLayers.map((e, index) => (
            <Typography
              key={index}
              sx={{ fontSize: 14 }}
              component="div"
              color="text.secondary"
              gutterBottom
            >
              Simulcast Layer
              <ul>
                <li>Resolution : {`${e.width}x${e.height}`}</li>
                <li>Quality limitation : {e.qualityLimitationReason}</li>
                <li>FPS: {e.framesPerSecond}</li>
                <li>Bitrate Kbps: {Math.round(e.bytes)}</li>
                <li>Packet Lost (%): {e.packetLost}</li>
                <li>Rtt: {e.rtt}</li>
                <li>Jitter: {e.jitter?.toFixed(4)}</li>
              </ul>
              <Divider />
            </Typography>
          ))}
        {haveSubscriberStats && (
          <Typography
            sx={{ fontSize: 18 }}
            component="h1"
            color="text.primary"
            gutterBottom
          >
            Subscriber stats
          </Typography>
        )}
        {subscriberFps && haveSubscriberStats && (
          <Typography
            sx={{ fontSize: 14 }}
            component="div"
            color="text.secondary"
            gutterBottom
          >
            Subscriber FPS : {subscriberFps}
          </Typography>
        )}
        {subscriberRes && haveSubscriberStats && (
          <Typography
            sx={{ fontSize: 14 }}
            component="div"
            color="text.secondary"
            gutterBottom
          >
            Subscriber Resolution : {subscriberRes}
          </Typography>
        )}
        {bytesReceived && haveSubscriberStats && (
          <Typography
            sx={{ fontSize: 14 }}
            component="div"
            color="text.secondary"
            gutterBottom
          >
            Download BW (Kbps) : {bytesReceived}
          </Typography>
        )}
        {subscriberPacketLost && haveSubscriberStats && (
          <Typography
            sx={{ fontSize: 14 }}
            component="div"
            color="text.secondary"
            gutterBottom
          >
            Packet Lost (%) : {subscriberPacketLost}
          </Typography>
        )}
        subscriberPacketLost
      </CardContent>
    </Card>
  );
}
