import { Container, Spinner } from "react-bootstrap";
import ListItem from "../components/ListItem";

const List = ({ list, setMainVideo, language, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>{language === 'hi' ? 'वीडियो लोड हो रहे हैं...' : 'Loading videos...'}</p>
      </div>
    );
  }

  if (!list || list.length === 0) {
    return (
      <div className="text-center mt-4">
        <p>{language === 'hi' ? 'कोई वीडियो नहीं मिला' : 'No videos found'}</p>
      </div>
    );
  }

  return (
    <Container className="video-list">
      {list.map(item => (
        <ListItem 
          key={item.id.videoId} 
          videoDetail={item} 
          setMainVideo={setMainVideo} 
        />
      ))}
    </Container>
  );
};

export default List