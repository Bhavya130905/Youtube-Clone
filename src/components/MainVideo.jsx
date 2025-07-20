import { Container } from "react-bootstrap";
import PropTypes from 'prop-types';

const MainVideo = ({ mainVideo, stats, channel, comments = [] }) => {
  if (!mainVideo || !stats || !channel) return <h1>Loading...</h1>;

  const videoSrc = `https://www.youtube.com/embed/${mainVideo?.id?.videoId || ''}`;

  return (
    <Container>
      <iframe
        src={videoSrc}
        width="100%"
        height={400}
        title={mainVideo.snippet?.title || "YouTube Video"}
        allowFullScreen
        style={{ borderRadius: 12, border: 0, marginBottom: 14 }}
      />
      <h4>{mainVideo.snippet?.title}</h4>
      <p>
        <strong>Channel:</strong> {channel.snippet?.title || "Unknown"} <br />
        <strong>Subscribers:</strong>{" "}
          {channel.statistics?.subscriberCount 
            ? parseInt(channel.statistics.subscriberCount).toLocaleString() 
            : "N/A"} <br />
        <strong>Likes:</strong>{" "}
          {stats.statistics?.likeCount
            ? parseInt(stats.statistics.likeCount).toLocaleString()
            : "N/A"} <br />
        <strong>Views:</strong>{" "}
          {stats.statistics?.viewCount
            ? parseInt(stats.statistics.viewCount).toLocaleString()
            : "N/A"}
      </p>
      <p style={{ whiteSpace: "pre-wrap" }}>
        {stats.snippet?.description || ""}
      </p>
      <hr />
      <h6>Top Comments:</h6>
      {(!comments || comments.length === 0) && <div>No comments found.</div>}
      {comments.map((c) => {
        const comment = c.snippet?.topLevelComment?.snippet;
        if (!comment) return null;
        return (
          <div key={c.id} style={{ marginBottom: "1em" }}>
            <strong>{comment.authorDisplayName}:</strong>
            <div dangerouslySetInnerHTML={{ __html: comment.textDisplay }} />
          </div>
        );
      })}
    </Container>
  );
};


MainVideo.propTypes = {
  mainVideo: PropTypes.object,
  stats: PropTypes.object,
  channel: PropTypes.object,
  comments: PropTypes.array,
  language: PropTypes.oneOf(['en', 'hi'])
};

export default MainVideo