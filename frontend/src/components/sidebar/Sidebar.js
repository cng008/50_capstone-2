import React from 'react';
import { useStateValue } from '../../StateProvider';
import { NavLink } from 'react-router-dom';
import SpotifyCloneApi from '../../common/api';
// import NewPlaylistForm from './NewPlaylistForm'; // for pop-out modal (not used)
import SidebarOption from './SidebarOption';
import SlidingPanel from './SlidingPane';
import './Sidebar.css';

import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import AddBoxIcon from '@material-ui/icons/AddBox';
import FavoriteIcon from '@material-ui/icons/Favorite';

/** Is rendered on every page (except login)
 *
 * - useStateValue: access globally stored state
 *
 *  */

const Sidebar = () => {
  const [{ playlists, token, user }, dispatch] = useStateValue();
  const playlistsCount = playlists[0]?.id;
  // const [showModal, setShowModal] = useState(false);

  // console.debug('Sidebar', 'playlists=', playlists, 'user=', user);

  /** Initialize default values for new playlist */
  const INITIAL_DATA = {
    name: `My Playlist #${playlistsCount + 1}`,
    description: '',
    username: user?.id || 'testuser',
    image:
      'https://assets.audiomack.com/jojo-1264/82a10a07eff76040ec325e3498c6d6c7.jpeg?type=song&width=280&height=280&max=true'
  };

  // const openModal = () => {
  //   setShowModal(true);
  // };
  // const closeModal = () => {
  // setShowModal(false);
  // };

  const createNewPlaylist = async evt => {
    evt.preventDefault();

    try {
      /** Makes a POST request to Api.js to create new playlist */
      await SpotifyCloneApi.newPlaylist(INITIAL_DATA);
      // Fetch updated list of playlists
      const updatedPlaylists = await SpotifyCloneApi.getPlaylists();
      dispatch({
        type: 'SET_PLAYLISTS',
        playlists: updatedPlaylists
      });
      // Redirect to newly-made playlist
      // history.push(`/playlists/${result.handle}`);
    } catch (err) {
      console.error(err);
      return;
    }
  };

  return (
    <div className="Sidebar">
      <SlidingPanel />
      <div className="Sidebar-nav">
        <img
          className="Sidebar-logo"
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
          alt="sidebar_logo"
        />
        <NavLink to="/">
          <SidebarOption title="Home" Icon={HomeIcon} />
        </NavLink>
        <NavLink to="/search">
          <SidebarOption title="Search" Icon={SearchIcon} />
        </NavLink>
        <NavLink to="/library">
          <SidebarOption title="Your Library" Icon={LibraryMusicIcon} />
        </NavLink>
        <br />
        <button onClick={createNewPlaylist}>
          <SidebarOption title="Create Playlist" Icon={AddBoxIcon} />
        </button>
        <SidebarOption
          title="Liked Songs"
          Icon={FavoriteIcon}
          img="https://community.spotify.com/t5/image/serverpage/image-id/104727iC92B541DB372FBC7/image-size/large?v=v2&px=999"
        />
      </div>

      {/* extract items value from returned playlist object and map over playlist names 
      usees optional chaining*/}
      <div className="Sidebar-playlists">
        {playlists?.map(playlist => (
          <NavLink to={`/playlists/${playlist.handle}`} key={playlist.id}>
            <SidebarOption title={playlist.name} />
          </NavLink>
        ))}
        {token && (
          <NavLink to={`/playlist/discover`}>
            <SidebarOption title="Discover Weekly" />
          </NavLink>
        )}
      </div>
      {/* {showModal ? (
        <div>
          <NewPlaylistForm closeModal={closeModal} />
        </div>
      ) : null} */}
    </div>
  );
};

export default Sidebar;
