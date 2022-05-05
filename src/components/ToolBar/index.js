import React from 'react';

// import LeaveButton from '../LeaveButton';

import MuteAudioButton from '../MuteAudioButton';
import MuteVideoButton from '../MuteVideoButton';

import styles from './styles';

function ToolBar({
  session,
  handleVideoChange,
  handleAudioChange,
  hasVideo,
  hasAudio,
}) {
  const classes = styles();
  return (
    <div className={classes.toolbarContainer}>
      <MuteAudioButton
        classes={classes}
        handleAudioChange={handleAudioChange}
        hasAudio={hasAudio}
      />
      <MuteVideoButton
        classes={classes}
        handleVideoChange={handleVideoChange}
        hasVideo={hasVideo}
      />
    </div>
  );
}

export default ToolBar;
