import { useEffect, useRef, useState } from "react";
import "./styles.css";

export default function App() {
  const [showModal, setShowModal] = useState(false);

  const modalRef = useRef(null);
  const headerRef = useRef(null);

  const pullDownToCloseModal = ({ modalHeader, modal, closeModal }) => {
    const modalHeight = modal?.offsetHeight || 200;
    const modalHeaderHeight = modalHeader?.offsetHeight || 50;
    let touchDown = false;
    let firstTouchPos = 0;
    let firstTouchTime = 0;

    modalHeader.addEventListener("touchstart", (e) => {
      touchDown = true;
      firstTouchPos = e.touches[0].pageY;
      firstTouchTime = new Date().getTime();
    });

    modalHeader.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (touchDown) {
        const diff = e.touches[0].pageY - firstTouchPos;
        if (modal) modal.style.bottom = `-${diff}px`;
        if (diff > modalHeight - modalHeaderHeight) {
          closeModal();
          touchDown = false;
        }
      }
    });

    modalHeader.addEventListener("touchend", (e) => {
      if (!touchDown) return;
      const timeDiff = new Date().getTime() - firstTouchTime;
      const distanceDiff = e.changedTouches[0].pageY - firstTouchPos;

      if (
        (timeDiff * distanceDiff < 40000 &&
          timeDiff < 500 &&
          distanceDiff > 30) ||
        distanceDiff > modalHeight / 2 - modalHeight / 10
      ) {
        closeModal();
      }
      if (modal) modal.style.bottom = "0";

      touchDown = false;
    });
  };

  useEffect(() => {
    if (headerRef.current && modalRef.current) {
      pullDownToCloseModal({
        modalHeader: headerRef.current,
        modal: modalRef.current,
        closeModal: () => {
          setShowModal(false);
        }
      });
    }
  }, [showModal]);

  return (
    <div className="App">
      <h2>Pull down to close modal</h2>
      <br />
      <span>
        Only works on mobile devices and web browsers mobile dimensions
      </span>
      {!showModal && (
        <div onClick={() => setShowModal(true)} className="showModalBtn">
          Show Modal
        </div>
      )}
      {showModal && (
        <div className="modal" ref={modalRef}>
          <div className="modalHeader" ref={headerRef}>
            Modal Header
          </div>
          <div className="modalBody">Modal Body</div>
        </div>
      )}
    </div>
  );
}
