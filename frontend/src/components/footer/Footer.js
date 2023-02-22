import React, { useContext, useEffect } from 'react';
import UserContext from '../../UserContext';
import { useStateValue } from '../../StateProvider';
import Slider from './Slider';
import './Footer.css';

import ExplicitIcon from '@material-ui/icons/Explicit';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import RepeatIcon from '@material-ui/icons/Repeat';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import { Grid } from '@material-ui/core';

/** Is rendered on every page (except login)
 *
 * - useStateValue: access globally stored state
 * - useContext: common data that can be accessed throughout the component hierarchy without passing the props down manually to each level
 *
 *  */

const Footer = () => {
  const [
    { isPlaying, isShuffling, isRepeated, volume, trackData, playerTime },
    dispatch
  ] = useStateValue();
  const { getSongDuration } = useContext(UserContext);

  // console.debug( 'Footer', 'isPlaying=', isPlaying,'volume=',volume, 'trackData=', trackData, 'playerTime=', playerTime );

  /** SET PLAY/PAUSE/SHUFFLE/REPEAT GLOBALLY */
  const togglePause = () => {
    if (isPlaying && !trackData) {
      alert(
        "Pick a song first to start playing! \n **Doesn't actually play sound**"
      );
    }
    if (playerTime > trackData?.duration_ms) {
      dispatch({
        type: 'SET_PLAYER_TIMELINE',
        playerTime: 0
      });
      dispatch({
        type: 'SET_PLAYING',
        isPlaying: true
      });
    }
    dispatch({
      type: 'SET_PLAYING',
      isPlaying: !isPlaying
    });
  };
  const toggleShuffle = () => {
    dispatch({
      type: 'SET_SHUFFLING',
      isShuffling: !isShuffling
    });
  };
  const toggleRepeat = () => {
    dispatch({
      type: 'SET_REPEATED',
      isRepeated: !isRepeated
    });
  };

  /** SAVE SONG TIME GLOBALLY */
  const handleTimeline = evt => {
    dispatch({
      type: 'SET_PLAYER_TIMELINE',
      playerTime: parseInt(evt.target.value)
    });
  };

  /** SETS VOLUME GLOBALLY
   * Saves volume before setting to 0
   * allows input to toggle mute/unmute by saving volume to sessionStorage
   */
  const handleVolume = evt => {
    dispatch({
      type: 'SET_VOLUME',
      volume: parseInt(evt.target.value)
    });
    sessionStorage.setItem('unMuteVariable', JSON.stringify(evt.target.value));
  };

  const handleMute = () => {
    dispatch({
      type: 'SET_VOLUME',
      volume: 0
    });
  };

  const unMute = () => {
    const volumeLevelBeforeMute = parseInt(
      JSON.parse(sessionStorage.getItem('unMuteVariable'))
    );
    dispatch({
      type: 'SET_VOLUME',
      volume: volumeLevelBeforeMute
    });
  };

  /** song time increments when isPlaying is true
   * timer stops when playerTime exceeds max song duration
   */
  useEffect(() => {
    let timerId;
    if (isPlaying) {
      timerId = setInterval(() => {
        if (playerTime < trackData?.duration_ms) {
          dispatch({
            type: 'SET_PLAYER_TIMELINE',
            playerTime: playerTime + 1000
          });
        } else {
          togglePause();
          clearInterval(timerId);
        }
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isPlaying, playerTime, dispatch, togglePause, trackData?.duration_ms]);

  return (
    <div className="Footer">
      <div className="Footer-left">
        {trackData ? (
          <img className="Footer-albumLogo" src={trackData.image} alt="" />
        ) : null}
        <div className="Footer-songInfo">
          <h4>{trackData?.name}</h4>
          <p>
            <span>
              {trackData?.explicit && <ExplicitIcon fontSize="small" />}{' '}
            </span>
            {trackData?.artist_name}
          </p>
        </div>
      </div>

      <div className="Footer-center">
        <div className="Footer-center-controls">
          <ShuffleIcon
            className={isShuffling ? 'Footer-green' : ''}
            onClick={toggleShuffle}
          />
          <SkipPreviousIcon fontSize="large" className="Footer-icon" />
          {isPlaying ? (
            <PauseCircleFilledIcon
              className="Footer-icon"
              onClick={togglePause}
            />
          ) : (
            <PlayCircleFilledIcon
              className="Footer-icon"
              onClick={togglePause}
            />
          )}
          <SkipNextIcon fontSize="large" className="Footer-icon" />
          <RepeatIcon
            className={isRepeated ? 'Footer-green' : ''}
            onClick={toggleRepeat}
          />
        </div>
        <div className="Footer-control-timeline">
          <div>
            <span>{trackData && getSongDuration(playerTime)}</span>
          </div>
          <div className="Footer-control-slider">
            <Slider
              value={playerTime}
              minValue={0}
              maxValue={trackData?.duration_ms}
              handleChange={handleTimeline}
            />
          </div>
          <div>
            <span>{trackData && getSongDuration(trackData?.duration_ms)}</span>
          </div>
        </div>
      </div>

      <div className="Footer-right">
        {/* Material UI grid */}
        <Grid container spacing={2}>
          <Grid item>
            <PlaylistPlayIcon />
          </Grid>
          <Grid item>
            {volume === 0 ? (
              <VolumeOffIcon onClick={unMute} />
            ) : (
              <VolumeDownIcon onClick={handleMute} />
            )}
          </Grid>
          <Grid item xs className="progressBar">
            <Slider
              value={volume}
              minValue={0}
              maxValue={100}
              handleChange={handleVolume}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Footer;
