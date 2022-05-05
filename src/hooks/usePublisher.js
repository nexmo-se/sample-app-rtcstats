import React, { useCallback, useRef, useState, useEffect } from 'react';
import OT from '@opentok/client';

export function usePublisher() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [pubInitialised, setPubInitialised] = useState(false);
  const publisherRef = useRef();

  const [ip, setIp] = useState(null);
  const [hasVPN, setHasVPN] = useState(null);
  const [connectionType, setConnectionType] = useState(null);
  const [protocol, setProtocol] = useState(null);
  const [srtpCipher, setSrtpCipher] = useState(null);
  let prevTimeStamp = useRef({});

  let prevBytesSent = useRef({});
  const [jitterAudio, setJitterAudio] = useState(null);
  const [jitterVideo, setJitterVideo] = useState(null);
  const [rtt, setRtt] = useState([]);
  const [audioPacketsLost, setAudioPacketsLost] = useState(null);
  const [simulcastDef, setSimulcastDef] = useState([]);

  const [simulcastLayers, setSimulcastLayers] = useState([]);

  const streamCreatedListener = React.useCallback(({ stream }) => {
    console.log(stream);
    setIsPublishing(true);
  }, []);

  const streamDestroyedListener = useCallback(({ stream }) => {
    publisherRef.current = null;
    setPubInitialised(false);
    setIsPublishing(false);
  }, []);

  const initPublisher = useCallback(
    (containerId, publisherOptions) => {
      console.log('UsePublisher - initPublisher');
      if (publisherRef.current) {
        console.log('UsePublisher - Already initiated');
        return;
      }
      if (!containerId) {
        console.log('UsePublisher - Container not available');
      }
      const finalPublisherOptions = Object.assign({}, publisherOptions, {
        insertMode: 'append',
        width: 680,
        // resolution: '1280x720',
        height: 640,
        style: {
          buttonDisplayMode: 'off',
          nameDisplayMode: 'on',
        },
        showControls: false,
      });
      console.log('usePublisher finalPublisherOptions', finalPublisherOptions);
      publisherRef.current = OT.initPublisher(
        containerId,
        finalPublisherOptions,
        (err) => {
          if (err) {
            console.log('[usePublisher]', err);
            publisherRef.current = null;
          }
          console.log('Publisher Created');
        }
      );

      setPubInitialised(true);

      publisherRef.current.on('streamCreated', streamCreatedListener);
      publisherRef.current.on('streamDestroyed', streamDestroyedListener);
    },
    [streamCreatedListener, streamDestroyedListener]
  );

  const getStats = useCallback(async () => {
    if (publisherRef.current) {
      try {
        const stats = await publisherRef.current.getRtcStatsReport();
        setSimulcastLayers([]);
        setSimulcastDef([]);
        setRtt([]);
        stats[0].rtcStatsReport.forEach((e) => {
          if (e.type === 'local-candidate') {
            if (e.networkType === 'vpn') setHasVPN(true);
            setConnectionType(e.networkType);
            if (e.candidateType === 'relay') {
              setProtocol(`TURN ${e.relayProtocol}`);
              setIp({ ip: e.ip, type: 'relay' });
            } else {
              setProtocol(e.protocol);
            }
          }

          if (e.type === 'transport') {
            setSrtpCipher(e.srtpCipher);
          }
          if (e.type === 'remote-inbound-rtp' && e.kind === 'video') {
            setJitterVideo(e.jitter);
            // const rtt = !isNaN(e.roundTripTime) ? e.roundTripTime : 0;
            const rttObject = {
              ssrc: e.ssrc,
              rtt: e.roundTripTime,
              jitter: e.jitter,
              packetLost: e.fractionLost,
            };
            setRtt((rtt) => [...rtt, rttObject]);
          }
          if (e.type === 'inbound-rtp' && e.kind === 'video') {
            setJitterVideo(e.jitter);
          }
          if (e.type === 'remote-inbound-rtp' && e.kind === 'audio') {
            setJitterAudio(e.jitter);
            setAudioPacketsLost(e.fractionLost);
          }

          if (
            e.type === 'outbound-rtp' &&
            e.kind === 'video' &&
            e.frameHeight &&
            e.frameWidth &&
            e.bytesSent
          ) {
            if (
              prevTimeStamp.current[e.ssrc] &&
              prevBytesSent.current[e.ssrc]
            ) {
              const timedif = e.timestamp - prevTimeStamp.current[e.ssrc];
              const bytesDif = e.bytesSent - prevBytesSent.current[e.ssrc];
              const bitSec = (8 * bytesDif) / timedif;

              const newLayers = {
                width: e.frameWidth,
                height: e.frameHeight,
                framesPerSecond: e.framesPerSecond,
                qualityLimitationReason: e.qualityLimitationReason,
                id: e.ssrc,
                bytes: bitSec,
                // rtt: result?.rtt ? result.rtt : 0,
              };

              // if (e.frameHeight && e.frameWidth) {
              setSimulcastLayers((simulcastLayers) => [
                ...simulcastLayers,
                newLayers,
              ]);
            }
            prevTimeStamp.current[e.ssrc] = e.timestamp;
            prevBytesSent.current[e.ssrc] = e.bytesSent;
          }

          // prevTimeStamp[e.ssrc] = e.timestamp;
          // }
        });

        /* setIsScreenSharing(true); */
      } catch (e) {
        console.log('[useRtcStats] -  error:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (rtt && simulcastLayers.length) {
      // console.log(simulcastDef);
      for (let layer of simulcastLayers) {
        for (let rttLayer of rtt) {
          if (layer.id === rttLayer.ssrc) {
            const obj = Object.assign(layer, {
              rtt: rttLayer.rtt,
              jitter: rttLayer.jitter,
              packetLost: rttLayer.packetLost,
            });
            // setSimulcastLayers(prev=>[])
            setSimulcastDef((simulcastDef) => [...simulcastDef, obj]);
          }
        }
      }
    }
  }, [rtt, simulcastLayers]);

  const destroyPublisher = useCallback(() => {
    if (!publisherRef.current) {
      return;
    }
    publisherRef.current.on('destroyed', () => {
      console.log('publisherRef.current Destroyed');
    });
    publisherRef.current.destroy();
  }, []);

  const publish = useCallback(
    ({ session, containerId, publisherOptions }) => {
      if (!publisherRef.current) {
        initPublisher(containerId, publisherOptions);
      }
      if (session && publisherRef.current && !isPublishing) {
        return new Promise((resolve, reject) => {
          session.publish(publisherRef.current, (err) => {
            if (err) {
              console.log('Publisher Error', err);
              setIsPublishing(false);
              reject(err);
            }
            console.log('Published');
            resolve(publisherRef.current);
          });
        });
      } else if (publisherRef.current) {
        // nothing to do
      }
    },
    [initPublisher, isPublishing]
  );

  useEffect(() => {
    if (isPublishing) {
      setInterval(() => {
        getStats();
      }, 3000);
    }
  }, [getStats, isPublishing]);

  const unpublish = useCallback(
    ({ session }) => {
      if (publisherRef.current && isPublishing) {
        session.unpublish(publisherRef.current);
        setIsPublishing(false);
        publisherRef.current = null;
      }
    },
    [isPublishing, publisherRef]
  );

  return {
    publisher: publisherRef.current,
    initPublisher,
    destroyPublisher,
    publish,
    pubInitialised,
    unpublish,
    ip,
    protocol,
    connectionType,
    srtpCipher,
    hasVPN,
    simulcastLayers,
    jitterVideo,
    jitterAudio,
    // rtt,
    simulcastDef,
    audioPacketsLost,
  };
}
