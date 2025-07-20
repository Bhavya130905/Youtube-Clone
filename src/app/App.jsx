import React, { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import MainVideo from "../components/MainVideo";
import List from "../components/List";
import SearchBar from "../components/SearchBar";
import VoiceCommand from "../components/VoiceCommand";
import '../app/App.css';
import {  useSearchVideosQuery, useVideoDetailsQuery, useChannelDetailsQuery, useCommentsQuery} from "../api/youtubeApiSlice";

const App = () => {
  const [searchValue, setSearchValue] = useState("harrypotter");
  const [mainVideo, setMainVideo] = useState(null);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [searchLanguage, setSearchLanguage] = useState('en');
  const [commandHistory, setCommandHistory] = useState([]);
  const playerRef = useRef(null);

  // Search query
  const {data: searchData, isLoading: isSearchLoading} = useSearchVideosQuery(
    { 
      query: currentVideoId ? '' : searchValue,
      language: searchLanguage,
      relatedToVideoId: currentVideoId
    },
    {
      skip: !searchValue && !currentVideoId
    }
  );

  // Video details
  const videoId = mainVideo?.id?.videoId;
  const { 
    data: videoStats, 
    isLoading: isVideoLoading 
  } = useVideoDetailsQuery(videoId, { skip: !videoId });

  // Channel details
  const channelId = mainVideo?.snippet?.channelId;
  const { 
    data: channelStats, 
    isLoading: isChannelLoading 
  } = useChannelDetailsQuery(channelId, { skip: !channelId });

  // Comments
  const { 
    data: commentsData, 
    isLoading: isCommentsLoading 
  } = useCommentsQuery(videoId, { skip: !videoId });

  // Set main video when search results load
  useEffect(() => {
    if (searchData?.items?.length > 0) {
      setMainVideo(searchData.items[0]);
    }
  }, [searchData]);

  // Add to command history
  const addToCommandHistory = (command) => {
    setCommandHistory(prev => [
      ...prev,
      {
        text: command,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Handle voice search
  const handleVoiceSearch = (query, language) => {
    setSearchValue(query);
    setSearchLanguage(language === 'hi-IN' ? 'hi' : 'en');
    setCurrentVideoId(null);
  };

  // Handle video selection
  const handleVideoSelect = (video) => {
    setMainVideo(video);
    setCurrentVideoId(video.id.videoId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container className="app-container">
      {/* Header Section */}
        <div>
          <SearchBar 
            onSearch={(value) => {
              setSearchValue(value);
              setSearchLanguage('en');
              setCurrentVideoId(null);
            }} 
          />
          <VoiceCommand 
            onSearch={handleVoiceSearch} 
          />
        </div>

      {/* Command History */}
      {commandHistory.length > 0 && (
        <div className="command-display">
          <h5>Recent Commands:</h5>
          {commandHistory.slice(-3).reverse().map((cmd, i) => (
            <div key={i} className="command-item">
              <div className="command-text">"{cmd.text}"</div>
              <div className="command-timestamp">{cmd.timestamp}</div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Video Player Section */}
        <div className="video-player-container">
          <MainVideo
            mainVideo={mainVideo}
            playerRef={playerRef}
            language={searchLanguage}
            stats={videoStats?.items?.[0]}
            channel={channelStats?.items?.[0]}
            comments={commentsData?.items || []}
          />
        </div>

        {/* Video List Section */}
        <div className="video-list-container">
          <h5>{currentVideoId ? 'Related Videos' : 'Search Results'}</h5>
          <List
          list={searchData?.items || []}
          setMainVideo={handleVideoSelect}
          language={searchLanguage}
          isLoading={isSearchLoading}/>
        </div>
      </div>
    </Container>
  )
}

export default App