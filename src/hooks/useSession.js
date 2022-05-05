import React, { useState, useRef, useCallback } from 'react';
import OT from '@opentok/client';
import LM from 'opentok-layout-js';

export function useSession({ container }) {
  const [connected, setConnected] = useState(false);
  const [streams, setStreams] = useState([]);
  const sessionRef = useRef(null);
  const [subscriber, setSubscriber] = useState(null);
  const addStream = ({ stream }) => {
    setStreams((prev) => [...prev, stream]);
  };
  const [bytesReceived, setBytesReceived] = useState(null);
  let prevTimeStamp = useRef(null);
  let prevBytes = useRef(null);
  const [subscriberFps, setSubscriberFps] = useState(null);
  const [subscriberRes, setSubscriberRes] = useState(null);
  const [subscriberPacketLost, setSubscriberPacketLost] = useState(null);
  const layout = useRef(null);
  const resizeTimeout = useRef(null);
  const [haveSubscriberStats, setHaveSubscriberStats] = useState(false);

  const removeStream = ({ stream }) => {
    setStreams((prev) =>
      prev.filter((prevStream) => prevStream.id !== stream.id)
    );
  };

  const subscribe = React.useCallback(
    (stream, options = {}) => {
      if (sessionRef.current && container.current) {
        const finalOptions = Object.assign({}, options, {
          insertMode: 'append',
          width: '100%',
          height: '100%',
          style: {
            buttonDisplayMode: 'off',
            nameDisplayMode: 'on',
          },
          showControls: false,
        });
        const subscriber = sessionRef.current.subscribe(
          stream,
          container.current.id,
          finalOptions
        );
        setSubscriber(subscriber);
      }
    },
    [container]
  );

  const onStreamCreated = useCallback(
    (event) => {
      subscribe(event.stream);
      layout.current.layout();
      addStream({ stream: event.stream });
    },
    [subscribe]
  );

  const onStreamDestroyed = useCallback((event) => {
    layout.current.layout();
    setSubscriber(null);
    removeStream({ stream: event.stream });
  }, []);

  const getStats = useCallback(async () => {
    if (subscriber) {
      try {
        const stats = await subscriber.getRtcStatsReport();
        console.log(stats);
        setHaveSubscriberStats(true);

        // setStats(stats);

        stats.forEach((e) => {
          if (
            e.type === 'inbound-rtp' &&
            e.kind === 'video'
            //  &&
            // prevTimeStamp.current &&
            // prevBytes.current
          ) {
            setSubscriberPacketLost(e.fractionLost);
            setSubscriberFps(e.framesPerSecond);
            setSubscriberRes(`${e.frameWidth}X${e.frameHeight}`);
            if (prevTimeStamp.current && prevBytes.current) {
              const timeDiff = e.timestamp - prevTimeStamp.current;
              const bytesDiff = e.bytesReceived - prevBytes.current;
              const bitSec = (8 * bytesDiff) / timeDiff;
              setBytesReceived(bitSec);
            }
            prevTimeStamp.current = e.timestamp;
            prevBytes.current = e.bytesReceived;
            // console.log(bitSec);
          }
        });
      } catch (e) {
        setHaveSubscriberStats(false);
        console.log('[useRtcStats] -  error:', e);
      }
    }
  }, [subscriber]);

  React.useEffect(() => {
    if (container.current) {
      const element = document.getElementById(container.current.id);
      if (element) {
        layout.current = LM(element, {
          // fixedRatio: true,
          // bigFirst: false,
          bigFixedRatio: true,
          maxRatio: 3 / 2,
          minRatio: 9 / 16,
          bigAlignItems: 'left',
          ignoreClass: 'OT_ignore',
        });

        layout.current.layout();

        window.onresize = function () {
          clearTimeout(resizeTimeout);
          resizeTimeout.current = setTimeout(function () {
            layout.current.layout();
          }, 20);
        };
      }
    }
  }, [container]);

  React.useEffect(() => {
    console.log('useEffect hook ran');
    if (subscriber) {
      setInterval(() => {
        getStats();
      }, 3000);
    } else {
      console.log(`useEffecthook -  no subscriber ${subscriber}`);
    }
  }, [subscriber, getStats]);

  const createSession = useCallback(
    ({ apiKey, sessionId, token }) => {
      if (!apiKey) {
        throw new Error('Missing apiKey');
      }

      if (!sessionId) {
        throw new Error('Missing sessionId');
      }

      if (!token) {
        throw new Error('Missing token');
      }

      sessionRef.current = OT.initSession(apiKey, sessionId, {
        // iceConfig: {
        //   includeServers: 'all',
        //   transportPolicy: 'relay',
        //   customServers: [
        //     {
        //       urls: [],
        //     },
        //   ],
        // },
      });
      const eventHandlers = {
        streamCreated: onStreamCreated,
        streamDestroyed: onStreamDestroyed,
      };
      sessionRef.current.on(eventHandlers);
      return new Promise((resolve, reject) => {
        sessionRef.current.connect(token, (err) => {
          if (!sessionRef.current) {
            // Either this session has been disconnected or OTSession
            // has been unmounted so don't invoke any callbacks
            return;
          }
          if (err) {
            reject(err);
          } else if (!err) {
            console.log('Session Connected!');
            setConnected(true);
            resolve(sessionRef.current);
          }
        });
      });
    },
    [onStreamCreated, onStreamDestroyed]
  );

  const destroySession = React.useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.on('disconnected', () => {
        sessionRef.current = null;
      });
      sessionRef.current.disconnect();
    }
  }, []);

  return {
    session: sessionRef,
    connected,
    createSession,
    destroySession,
    streams,
    bytesReceived,
    subscriberFps,
    subscriberRes,
    haveSubscriberStats,
    subscriberPacketLost,
  };
}
