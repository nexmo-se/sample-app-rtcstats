import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './styles';
import { apiKey, token, sessionId } from '../../config';

import { usePublisher } from '../../hooks/usePublisher';
import { useSession } from '../../hooks/useSession';
import InfoCard from '../InfoCard/InfoCard';
import ToolBar from '../ToolBar';

const Video = () => {
  const classes = styles();
  const videoContainer = useRef();
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);
  const {
    session,
    createSession,
    connected,
    bytesReceived,
    subscriberFps,
    subscriberRes,
    haveSubscriberStats,
    subscriberPacketLost,
  } = useSession({
    container: videoContainer,
  });

  const {
    publisher,
    publish,
    pubInitialised,
    ip,
    connectionType,
    protocol,
    srtpCipher,
    jitterAudio,
    rtt,
    audioPacketsLost,
    simulcastDef,
  } = usePublisher();

  useEffect(() => {
    if (apiKey && sessionId && token) {
      createSession({ apiKey, sessionId, token });
    }
  }, [createSession]);

  const handleAudioChange = useCallback(() => {
    if (hasAudio) {
      publisher.publishAudio(false);
      setHasAudio(false);
    } else {
      publisher.publishAudio(true);
      setHasAudio(true);
    }
  }, [hasAudio, publisher]);

  const handleVideoChange = useCallback(() => {
    if (hasVideo) {
      publisher.publishVideo(false);
      setHasVideo(false);
    } else {
      publisher.publishVideo(true);
      setHasVideo(true);
    }
  }, [hasVideo, publisher]);

  useEffect(() => {
    if (
      session.current &&
      connected &&
      !pubInitialised &&
      videoContainer.current
    ) {
      // todo It might be better to change state of this component.
      publish({
        session: session.current,
        containerId: videoContainer.current.id,
      });
    }
  }, [publish, session, connected, pubInitialised]);

  return (
    <>
      <div className="main">
        <div
          id="video-container"
          className={classes.streams}
          ref={videoContainer}
        ></div>
        <div id="infoCard" className={classes.infoCard}>
          {connectionType && protocol && (
            <InfoCard
              srtpCipher={srtpCipher}
              protocol={protocol}
              ip={ip}
              connectionType={connectionType}
              // simulcastLayers={simulcastLayers}
              jitterAudio={jitterAudio}
              // jitterVideo={jitterVideo}
              rtt={rtt}
              audioPacketsLost={audioPacketsLost}
              bytesReceived={bytesReceived}
              subscriberFps={subscriberFps}
              subscriberRes={subscriberRes}
              simulcastDef={simulcastDef}
              haveSubscriberStats={haveSubscriberStats}
              subscriberPacketLost={subscriberPacketLost}
            />
          )}
        </div>
      </div>
      <ToolBar
        handleAudioChange={handleAudioChange}
        handleVideoChange={handleVideoChange}
        session={session.current}
        hasAudio={hasAudio}
        hasVideo={hasVideo}
      />
    </>
  );
};

export default Video;
