import React, { useCallback, useRef, useState, useEffect } from 'react';
import OT from '@opentok/client';

export function usePublisher() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [pubInitialised, setPubInitialised] = useState(false);
  const publisherRef = useRef();

  const [ip, setIp] = useState(null);
  const [hasVPN, setHasVPN] = useState(null);
  const [connectionType, setConnectionType] = useState(null);
  const [stats, setStats] = useState(null);
  const [protocol, setProtocol] = useState(null);
  const [srtpCipher, setSrtpCipher] = useState(null);
  const [successfulLocalCandidate, setSuccessfulLocalCandidate] =
    useState(null);
  const [successfulRemoteCandidate, setSuccessfulRemoteCandidate] =
    useState(null);

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
      console.log(publisherRef.current);
      try {
        const stats = await publisherRef.current.getRtcStatsReport();
        setStats(stats);
        stats[0].rtcStatsReport.forEach((e) => {
          if (e.type === 'candidate-pair') {
            if (e.state === 'succeeded') {
              setSuccessfulLocalCandidate(e.localCandidateId);
              setSuccessfulRemoteCandidate(e.remoteCandidateId);
            }
          }
          if (
            e.type === 'remote-candidate' &&
            successfulRemoteCandidate === e.id
          ) {
            // if (successfulRemoteCandidate === e.id) {
            setIp({ ip: e.ip, type: 'direct' });
            // }
          }
          if (e.type === 'local-candidate') {
            if (e.networkType === 'vpn') setHasVPN(true);
            if (successfulLocalCandidate === e.id) {
              // if (successfulLocalCandidate === e.id) {
              setConnectionType(e.networkType);
              if (e.candidateType === 'relay') {
                setProtocol(`TURN ${e.relayProtocol}`);
                setIp({ ip: e.ip, type: 'relay' });
              } else {
                setProtocol(e.protocol);
              }
              // }
            }
          }

          if (e.type === 'transport') {
            setSrtpCipher(e.srtpCipher);
          }
        });

        /* setIsScreenSharing(true); */
      } catch (e) {
        console.log('[useRtcStats] -  error:', e);
      }
    }
  }, [successfulLocalCandidate, successfulRemoteCandidate]);

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
    getStats();
  }, [
    getStats,
    isPublishing,
    successfulLocalCandidate,
    successfulRemoteCandidate,
  ]);

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
  };
}