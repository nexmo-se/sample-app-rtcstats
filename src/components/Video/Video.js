import { useEffect, useRef } from 'react';
import styles from './styles';
import { apiKey, token, sessionId } from '../../config';

import { usePublisher } from '../../hooks/usePublisher';
import { useSession } from '../../hooks/useSession';
import InfoCard from '../InfoCard/InfoCard';
import LoadingPage from '../LoadingPage';
import { Button } from '@material-ui/core';

const Video = () => {
  const classes = styles();
  const videoContainer = useRef();
  const { session, createSession, connected } = useSession({
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
    hasVPN,
    simulcastLayers,
    jitterAudio,
    jitterVideo,
    rtt,
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
    <>
      <div
        id="video-container"
        className={classes.streams}
        ref={videoContainer}
      >
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
          />
        )}
      </div>

      {/* <LoadingPage/> */}
    </>
  );
};

export default Video;
