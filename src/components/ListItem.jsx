import { Row, Col, Image } from "react-bootstrap";
import PropTypes from "prop-types";

const ListItem = ({ videoDetail, setMainVideo }) => {
  const handleClick = () => {
    setMainVideo(videoDetail);
  };

  return (
    <div
      className="video-item mb-3"
      onClick={handleClick}
      tabIndex={0}
      role="button"
      style={{ cursor: "pointer" }}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <Row>
        <Col sm={6}>
          <Image
            src={videoDetail.snippet?.thumbnails?.medium?.url || ""}
            alt={videoDetail.snippet?.title || "Video thumbnail"}
            className="w-100 video-thumbnail"
            fluid
            thumbnail
          />
        </Col>
        <Col sm={5}>
          <div className="video-info">
            <strong className="video-title">{videoDetail.snippet?.title}</strong>
            <p className="text-muted channel-name mt-1">
              {videoDetail.snippet?.channelTitle}
            </p>
          </div>
        </Col>
      </Row>
    </div>
  )
}

ListItem.propTypes = {videoDetail: PropTypes.object.isRequired, setMainVideo: PropTypes.func.isRequired}

export default ListItem