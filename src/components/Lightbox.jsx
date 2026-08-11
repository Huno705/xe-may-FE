import { useCallback, useEffect, useRef, useState } from "react";
import "./Lightbox.css";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

export default function Lightbox({ images, startIndex = 0, alt = "", onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const dragState = useRef(null);
  const imageRef = useRef(null);

  const total = images.length;

  const resetView = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const goTo = useCallback(
    (next) => {
      setIndex(((next % total) + total) % total);
      resetView();
    },
    [total, resetView]
  );

  const zoomBy = useCallback((delta) => {
    setZoom((z) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(z + delta).toFixed(2)));
      if (next === MIN_ZOOM) setOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goTo(index + 1);
      else if (e.key === "ArrowLeft") goTo(index - 1);
      else if (e.key === "+" || e.key === "=") zoomBy(ZOOM_STEP);
      else if (e.key === "-") zoomBy(-ZOOM_STEP);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goTo, zoomBy, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const onWheel = (e) => {
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
  };

  const onPointerDown = (e) => {
    if (zoom <= 1) return;
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    imageRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragState.current) return;
    const { startX, startY, originX, originY } = dragState.current;
    setOffset({
      x: originX + (e.clientX - startX),
      y: originY + (e.clientY - startY),
    });
  };

  const onPointerUp = (e) => {
    dragState.current = null;
    imageRef.current?.releasePointerCapture?.(e.pointerId);
  };

  const canPan = zoom > 1;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Xem ảnh">
      <div className="lightbox__backdrop" onClick={onClose} />

      <div className="lightbox__toolbar">
        <span className="lightbox__counter mono">
          {index + 1} / {total}
        </span>
        <div className="lightbox__tools">
          <button
            type="button"
            className="lightbox__btn"
            onClick={() => zoomBy(-ZOOM_STEP)}
            disabled={zoom <= MIN_ZOOM}
            aria-label="Thu nhỏ"
          >
            −
          </button>
          <span className="lightbox__zoom mono">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="lightbox__btn"
            onClick={() => zoomBy(ZOOM_STEP)}
            disabled={zoom >= MAX_ZOOM}
            aria-label="Phóng to"
          >
            +
          </button>
          <button
            type="button"
            className="lightbox__btn"
            onClick={resetView}
            disabled={zoom === 1 && offset.x === 0 && offset.y === 0}
            aria-label="Đặt lại"
          >
            ⤢
          </button>
          <button
            type="button"
            className="lightbox__btn lightbox__btn--close"
            onClick={onClose}
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="lightbox__stage" onWheel={onWheel}>
        <img
          ref={imageRef}
          className="lightbox__image"
          src={images[index]}
          alt={alt ? `${alt} - ảnh ${index + 1}` : `ảnh ${index + 1}`}
          draggable={false}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            cursor: canPan ? (dragState.current ? "grabbing" : "grab") : "auto",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={() => (zoom > 1 ? resetView() : zoomBy(ZOOM_STEP * 2))}
        />
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={() => goTo(index - 1)}
            aria-label="Ảnh trước"
          >
            ‹
          </button>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={() => goTo(index + 1)}
            aria-label="Ảnh tiếp theo"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
