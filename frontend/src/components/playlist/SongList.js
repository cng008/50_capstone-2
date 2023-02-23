import React from 'react';
import { useStateValue } from '../../StateProvider';
import Song from './Song';
import './SongList.css';

import AccessTimeIcon from '@material-ui/icons/AccessTime';

/** View Playlist with songs related to playlist.
 *
 * - useStateValue: access globally stored state
 *
 * App -> Routes -> Playlist -> SongList -> Song
 */

const SongList = ({ songs, sortOption, removeSong }) => {
  const [{ trackData }, dispatch] = useStateValue();

  /** re-orders songs based on sortOption */
  const sortedData = () => {
    switch (sortOption) {
      case 'name':
        return songs.sort((a, b) => a.name.localeCompare(b.name));
      case 'artist':
        return songs.sort((a, b) => a.artist_name.localeCompare(b.artist_name));
      case 'album':
        return songs.sort((a, b) => a.album_name.localeCompare(b.album_name));
      case 'added_at':
        return songs.sort((a, b) => a.added_at.localeCompare(b.added_at));
      case 'duration':
        return songs.sort((a, b) => a.duration_ms - b.duration_ms);
      default:
        return songs;
    }
  };

  /** "PLAYS" SONG IN FOOTER
   * Sets the current song and updates the playing state and player timeline
   */
  const setSong = track => {
    dispatch({
      type: 'SET_SONG',
      trackData: track
    });
    dispatch({
      type: 'SET_PLAYING',
      isPlaying: true
    });
    dispatch({
      type: 'SET_PLAYER_TIMELINE',
      playerTime: 0
    });
  };

  return (
    <div className="Playlist-songList">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>TITLE</th>
            <th>ALBUM</th>
            <th>DATE ADDED</th>
            <th>
              <AccessTimeIcon />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData().map((track, id) => (
            <tr
              key={track.id}
              className={track.id === trackData?.id ? 'SongList-current' : ''}
              onClick={() => {
                setSong(track);
              }}
            >
              <Song track={track} id={id} removeSong={removeSong} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SongList;
