import { useEffect, useRef } from 'react';
import styles from './styles';
import { apiKey, token, sessionId } from '../../config';

import { usePublisher } from '../../hooks/usePublisher';
import { useSession } from '../../hooks/useSession';
import InfoCard from '../InfoCard/InfoCard';

const Video = () => {
  const classes = styles();
  const videoContainer = useRef();
  const {
    session,
    createSession,
    connected,
    bytesReceived,
    subscriberFps,
    subscriberRes,
    haveSubscriberStats,
  } = useSession({
    container: videoContainer,
  });

  const {
    publish,
    pubInitialised,
    ip,
    connectionType,
    protocol,
    srtpCipher,
    simulcastLayers,
    jitterAudio,
    jitterVideo,
    rtt,
    audioPacketsLost,
    simulcastDef,
  } = usePublisher();

  useEffect(() => {
    if (apiKey && sessionId && token) {
      createSession({ apiKey, sessionId, token });
    }
  }, [createSession]);

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
            // hasVPN={hasVPN}
            simulcastLayers={simulcastLayers}
            jitterAudio={jitterAudio}
            jitterVideo={jitterVideo}
            rtt={rtt}
            audioPacketsLost={audioPacketsLost}
            bytesReceived={bytesReceived}
            subscriberFps={subscriberFps}
            subscriberRes={subscriberRes}
            simulcastDef={simulcastDef}
            haveSubscriberStats={haveSubscriberStats}
          />
        )}
      </div>
    </div>
  );
};

export default Video;
