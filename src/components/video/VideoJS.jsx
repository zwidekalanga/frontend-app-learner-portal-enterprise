import { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import 'videojs-youtube';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { getLocale, getPrimaryLanguageSubtag } from '@edx/frontend-platform/i18n';
import { PLAYBACK_RATES } from './data/constants';
import { usePlayerOptions, useTranscripts } from './data';

window.videojs = videojs;
// eslint-disable-next-line import/no-extraneous-dependencies
require('videojs-vjstranscribe');

const VideoJS = ({ options, onReady, customOptions }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // Some language codes include full locales like es-419, which may not match the codes in the text tracks.
  // To ensure proper matching, we strip a locale down to that first subtag.
  const siteLanguage = getPrimaryLanguageSubtag(getLocale());

  const transcripts = useTranscripts({
    player: playerRef.current,
    customOptions,
    siteLanguage,
  });

  const playerOptions = usePlayerOptions({
    transcripts,
    options,
    customOptions,
  });

  const addTextTracks = useCallback(() => {
    const textTracks = Object.entries(transcripts.textTracks);
    textTracks.forEach(([lang, webVttFileUrl]) => {
      playerRef.current.addRemoteTextTrack({
        kind: 'subtitles',
        src: webVttFileUrl,
        srclang: lang,
        label: lang,
      }, false);
    });
  }, [transcripts.textTracks]);

  const handlePlayerReady = useCallback(() => {
    // Add remote text tracks
    addTextTracks();

    // Set playback rates
    if (customOptions?.showPlaybackMenu) {
      playerRef.current.playbackRates(PLAYBACK_RATES);
    }

    // Callback to parent component, if provided
    if (onReady) {
      onReady(playerRef.current);
    }
  }, [customOptions?.showPlaybackMenu, onReady, addTextTracks]);

  useEffect(() => {
    if (transcripts.isLoading) {
      // While async transcripts data is loading, don't initialize the player
      return;
    }

    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement('video-js');

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      playerRef.current = videojs(videoElement, playerOptions, handlePlayerReady);
    } else if (playerOptions?.sources[0]?.src !== playerRef?.current?.currentSrc()) {
      // Only update player if the source changes
      playerRef.current.autoplay(playerOptions.autoplay);
      playerRef.current.src(playerOptions.sources);

      // Re-add the text tracks if the player already exists
      addTextTracks();
    }
  }, [transcripts.isLoading, playerOptions, handlePlayerReady, addTextTracks]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const cleanup = () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
    return cleanup;
  }, []);

  return (
    <>
      <div data-vjs-player className="video-js-wrapper">
        <div ref={videoRef} />
      </div>
      {customOptions?.showTranscripts && <div id="vjs-transcribe" className="transcript-container" />}
    </>
  );
};

VideoJS.propTypes = {
  options: PropTypes.shape({
    autoplay: PropTypes.bool,
    controls: PropTypes.bool,
    responsive: PropTypes.bool,
    fluid: PropTypes.bool,
    sources: PropTypes.arrayOf(PropTypes.shape({
      src: PropTypes.string,
      type: PropTypes.string,
    })),
  }).isRequired,
  onReady: PropTypes.func,
  customOptions: PropTypes.shape({
    showPlaybackMenu: PropTypes.bool,
    showTranscripts: PropTypes.bool,
    transcriptUrls: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
};

VideoJS.defaultProps = {
  onReady: null,
};

export default VideoJS;
