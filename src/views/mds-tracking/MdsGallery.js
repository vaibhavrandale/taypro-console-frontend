import React, { useRef, useState } from "react";
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCarousel,
  CCarouselItem,
  CCarouselCaption,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const MdsGallery = () => {
  const videoRefs = useRef([]);

  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    {
      type: "video",
      src: "https://res.cloudinary.com/decyim6cd/video/upload/v1770296447/1_fq23v1.mp4",
      label: "Robot Climbing on Row",
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/decyim6cd/video/upload/v1770355200/2_gpetyz.mp4",
      label: "MDS Moving from 1 Row to Another",
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1630765931044-8aca18d1b2bb?q=80&w=1489&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      label: "MDS View 1",
    },
    {
      type: "image",
      src: "https://plus.unsplash.com/premium_photo-1679437976844-c1a402a72c4a?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      label: "MDS View 2",
    },
  ];
  const handleSlideChange = (index) => {
    setActiveIndex(index);

    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  const handleClose = () => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    setVisible(false);
  };

  return (
    <>
      {/* Open Modal Button */}
      <CButton color="primary" size="sm" onClick={() => setVisible(true)}>
        Gallery
      </CButton>

      {/* Modal */}
      <CModal
        size="xl"
        visible={visible}
        onClose={handleClose}
        alignment="center"
      >
        <CModalHeader
          closeButton={false}
          className="d-flex justify-content-between align-items-center"
        >
          <CModalTitle>MDS Gallery</CModalTitle>
          <button
            type="button"
            className="border-0 ms-auto py-0 px-1"
            onClick={handleClose}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="xl" />
          </button>
        </CModalHeader>

        <CModalBody>
          <CCarousel
            controls
            indicators
            dark
            transition="crossfade"
            interval={items[activeIndex]?.type === "video" ? false : 3000}
            onSlide={handleSlideChange}
          >
            {items.map((item, index) => (
              <CCarouselItem key={index}>
                {item.type === "video" ? (
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={item.src}
                    controls
                    style={{
                      width: "100%",
                      maxHeight: "450px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    className="d-block w-100"
                    src={item.src}
                    alt={item.label}
                    style={{
                      maxHeight: "450px",
                      objectFit: "contain",
                    }}
                  />
                )}

                <CCarouselCaption className="d-none d-md-block">
                  <h5>{item.label}</h5>
                </CCarouselCaption>
              </CCarouselItem>
            ))}
          </CCarousel>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={handleClose}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default MdsGallery;
