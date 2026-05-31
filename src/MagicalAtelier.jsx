import React, { useEffect, useMemo, useRef, useState } from "react";

const PALETTE = [
  "#f7a8c8",
  "#e96aa6",
  "#ffe9a8",
  "#c7a6ff",
  "#8f6bd9",
  "#fff1f7",
  "#6d5877",
];

const COLORS = {
  pinkSoft: "#ffd9ea",
  pink: "#f7a8c8",
  pinkStrong: "#e96aa6",
  cream: "#fff7df",
  butter: "#ffe9a8",
  lilac: "#c7a6ff",
  lilacStrong: "#8f6bd9",
  text: "#6d5877",
  textDark: "#5a4666",
  whiteGlass: "rgba(255,255,255,0.76)",
  border: "rgba(233, 106, 166, 0.18)",
  shadowPink: "rgba(249, 168, 212, 0.22)",
  shadowGold: "rgba(253, 230, 138, 0.18)",
};

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildFingerprint(strokes) {
  let sum = 0;

  strokes.forEach((stroke, i) => {
    sum += stroke.points.length * (i + 3);
    sum += Math.floor(stroke.size * 19);
    sum += stroke.color.charCodeAt(1) || 0;

    for (let j = 0; j < stroke.points.length; j += 3) {
      const p = stroke.points[j];
      if (!p) continue;
      sum += Math.floor((p.x + p.y) * (j + 1));
    }
  });

  const part1 = (sum % 65535).toString(16).toUpperCase().padStart(4, "0");
  const part2 = ((sum * 13) % 46656).toString(36).toUpperCase().padStart(3, "0");
  return `${part1}-${part2}`;
}

export default function MagicalAtelier() {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const currentStrokeRef = useRef(null);

  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState(PALETTE[0]);
  const [size, setSize] = useState(6);
  const [strokes, setStrokes] = useState([]);
  const [sealed, setSealed] = useState(false);
  const [fingerprint, setFingerprint] = useState("WAITING-SOUL");
  const [isMobile, setIsMobile] = useState(false);

  const backgroundGradient = useMemo(
    () => ({
      top: "#fffaf3",
      bottom: "#ffe6f1",
    }),
    []
  );

  useEffect(() => {
    const updateDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;

      const ctx = canvas.getContext("2d");
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawScene();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [strokes, sealed, isMobile]);

  useEffect(() => {
    drawScene();
    setFingerprint(strokes.length ? buildFingerprint(strokes) : "WAITING-SOUL");
  }, [strokes, sealed]);

  const getCanvasCoords = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (event.touches && event.touches.length > 0) {
      const touch = event.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    if (event.changedTouches && event.changedTouches.length > 0) {
      const touch = event.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event) => {
    if (sealed) return;
    if (event.cancelable) event.preventDefault();

    drawingRef.current = true;
    const pos = getCanvasCoords(event);

    currentStrokeRef.current = {
      tool,
      color,
      size,
      points: [pos],
    };

    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
  };

  const drawMove = (event) => {
    if (!drawingRef.current || !currentStrokeRef.current || sealed) return;
    if (event.cancelable) event.preventDefault();

    const pos = getCanvasCoords(event);
    currentStrokeRef.current.points.push(pos);
    drawScene(currentStrokeRef.current);
  };

  const stopDrawing = (event) => {
    if (event?.cancelable) event.preventDefault();
    if (!drawingRef.current || !currentStrokeRef.current) return;

    drawingRef.current = false;

    if (currentStrokeRef.current.points.length > 0) {
      setStrokes((prev) => [...prev, currentStrokeRef.current]);
    }

    currentStrokeRef.current = null;
  };

  const undoLast = () => {
    if (sealed) return;
    setStrokes((prev) => prev.slice(0, -1));
  };

  const resetAll = () => {
    setSealed(false);
    setStrokes([]);
    setFingerprint("WAITING-SOUL");
  };

  const sealArtwork = () => {
    setSealed(true);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `digital-print-${fingerprint}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const drawScene = (previewStroke = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, backgroundGradient.top);
    grad.addColorStop(1, backgroundGradient.bottom);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 14; i += 1) {
      const x = (Math.sin(i * 17 + 1.8) * 0.5 + 0.5) * width;
      const y = (Math.cos(i * 31 + 1.4) * 0.5 + 0.5) * height;
      const radius = 26 + ((i * 37) % 70);

      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, "rgba(255,255,255,0.34)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    strokes.forEach((stroke) => drawStroke(ctx, stroke));
    if (previewStroke) drawStroke(ctx, previewStroke);

    if (sealed) {
      drawSeal(ctx, width, height);
    }
  };

  const drawStroke = (ctx, stroke) => {
    if (!stroke.points.length) return;

    if (stroke.tool === "eraser") {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      drawSmoothLine(ctx, stroke.points, stroke.size * 2, "rgba(0,0,0,1)", 0);
      ctx.restore();
      return;
    }

    if (stroke.tool === "stars") {
      stroke.points.forEach((point, index) => {
        if (index % 2 !== 0) return;
        drawStar(
          ctx,
          point.x,
          point.y,
          5,
          stroke.size * randomBetween(1.3, 2.1),
          stroke.size * randomBetween(0.5, 1),
          hexToRgba(stroke.color, 0.9)
        );
      });
      return;
    }

    if (stroke.tool === "glow") {
      drawSmoothLine(ctx, stroke.points, stroke.size, stroke.color, 18);
      return;
    }

    drawSmoothLine(ctx, stroke.points, stroke.size, stroke.color, 0);
  };

  const drawSmoothLine = (ctx, points, lineWidth, strokeColor, blur) => {
    if (!points.length) return;

    if (points.length < 2) {
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, lineWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();
      return;
    }

    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowBlur = blur;
    ctx.shadowColor = strokeColor;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 1; i += 1) {
      const midX = (points[i].x + points[i + 1].x) / 2;
      const midY = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }

    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
    ctx.restore();
  };

  const drawStar = (ctx, x, y, spikes, outerRadius, innerRadius, fill) => {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);

    for (let i = 0; i < spikes; i += 1) {
      ctx.lineTo(
        x + Math.cos(rot) * outerRadius,
        y + Math.sin(rot) * outerRadius
      );
      rot += step;
      ctx.lineTo(
        x + Math.cos(rot) * innerRadius,
        y + Math.sin(rot) * innerRadius
      );
      rot += step;
    }

    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.shadowBlur = 12;
    ctx.shadowColor = fill;
    ctx.fill();
    ctx.restore();
  };

  const drawSeal = (ctx, width, height) => {
    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, 70 + i * 18, 0, Math.PI * 2);
      ctx.strokeStyle =
        i % 2 === 0
          ? "rgba(233,106,166,0.22)"
          : "rgba(255,233,168,0.38)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.fillStyle = COLORS.pinkStrong;
    ctx.font = '600 16px "Trebuchet MS", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(`Sealed print · ${fingerprint}`, cx, height - 26);
    ctx.textAlign = "start";
  };

  return (
    <section style={styles.section}>
      <div style={styles.shell}>
        <div style={styles.top}>
          <div>
            <p style={styles.eyebrow}>Art + code</p>
            <h2 style={styles.title}>Digital Print</h2>
            <p style={styles.text}>
              A tiny dreamy atelier where you can draw, try tools and seal a
              unique piece.
            </p>
          </div>

          <div style={styles.badges}>
            <span style={styles.badge}>✨ interactive</span>
            <span style={styles.badge}>🖱️ mouse</span>
            <span style={styles.badge}>📱 touch</span>
            <span style={styles.badge}>💗 unique piece</span>
          </div>
        </div>

        <div
          style={{
            ...styles.workspace,
            gridTemplateColumns: isMobile ? "1fr" : "280px 1fr",
          }}
        >
          <aside style={styles.sidebar}>
            <div style={styles.panel}>
              <h3 style={styles.panelTitle}>Tools</h3>

              <div style={styles.toolGrid}>
                <button
                  style={tool === "brush" ? styles.toolActive : styles.tool}
                  onClick={() => setTool("brush")}
                >
                  Brush
                </button>
                <button
                  style={tool === "glow" ? styles.toolActive : styles.tool}
                  onClick={() => setTool("glow")}
                >
                  Glow
                </button>
                <button
                  style={tool === "stars" ? styles.toolActive : styles.tool}
                  onClick={() => setTool("stars")}
                >
                  Stars
                </button>
                <button
                  style={tool === "eraser" ? styles.toolActive : styles.tool}
                  onClick={() => setTool("eraser")}
                >
                  Eraser
                </button>
              </div>
            </div>

            <div style={styles.panel}>
              <h3 style={styles.panelTitle}>Colors</h3>
              <div style={styles.colors}>
                {PALETTE.map((swatch) => (
                  <button
                    key={swatch}
                    onClick={() => setColor(swatch)}
                    style={{
                      ...styles.colorSwatch,
                      background: swatch,
                      outline: color === swatch ? "3px solid #e96aa6" : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={styles.panel}>
              <h3 style={styles.panelTitle}>Size</h3>
              <input
                type="range"
                min="2"
                max="24"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                style={styles.range}
              />
              <p style={styles.smallText}>{size}px</p>
            </div>

            <div style={styles.panel}>
              <h3 style={styles.panelTitle}>Fingerprint</h3>
              <p style={styles.fingerprint}>{fingerprint}</p>
            </div>
          </aside>

          <div style={styles.canvasArea}>
            <div style={styles.canvasTop}>
              <div style={styles.cloud}>
                Move the mouse or your finger to draw. Use stars, glow or a soft brush.
              </div>

              <div style={styles.actions}>
                <button style={styles.primaryBtn} onClick={sealArtwork}>
                  Seal artwork
                </button>
                <button style={styles.softBtn} onClick={undoLast}>
                  Undo
                </button>
                <button style={styles.softBtn} onClick={resetAll}>
                  Reset
                </button>
                <button style={styles.softBtn} onClick={downloadCanvas}>
                  Download PNG
                </button>
              </div>
            </div>

            <div style={styles.canvasShell}>
              <canvas
                ref={canvasRef}
                style={{
                  ...styles.canvas,
                  height: isMobile ? "420px" : "560px",
                }}
                onMouseDown={startDrawing}
                onMouseMove={drawMove}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={drawMove}
                onTouchEnd={stopDrawing}
                onTouchCancel={stopDrawing}
              />
            </div>

            <p style={styles.note}>
              Tip: try a beautiful word, a soft shape and a stars brush before
              sealing the piece.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    width: "100%",
    padding: "18px 0",
  },

  shell: {
    width: "min(1200px, 100%)",
    margin: "0 auto",
    background: "rgba(255,255,255,0.58)",
    border: "2px solid rgba(255, 214, 234, 0.75)",
    borderRadius: "26px",
    padding: "20px",
    backdropFilter: "blur(16px)",
    boxShadow:
      "0 16px 38px rgba(249, 168, 212, 0.18), 0 6px 18px rgba(255, 233, 168, 0.16)",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },

  eyebrow: {
    margin: 0,
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: COLORS.lilacStrong,
    fontFamily: '"Trebuchet MS", sans-serif',
    fontWeight: 700,
  },

  title: {
    margin: "8px 0 10px",
    color: COLORS.pinkStrong,
    fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
    lineHeight: 1.2,
    fontFamily: '"Press Start 2P", "VT323", monospace',
  },

  text: {
    margin: 0,
    color: COLORS.text,
    lineHeight: 1.7,
    maxWidth: "700px",
    fontFamily: '"Trebuchet MS", sans-serif',
  },

  badges: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  badge: {
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(255,255,255,0.22)",
    color: COLORS.pinkStrong,
    fontFamily: '"Trebuchet MS", sans-serif',
    fontSize: "13px",
    fontWeight: 700,
  },

  workspace: {
    display: "grid",
    gap: "20px",
  },

  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  panel: {
    background: "rgba(255,255,255,0.58)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "20px",
    padding: "16px",
    boxShadow: "0 8px 22px rgba(249,168,212,0.10)",
  },

  panelTitle: {
    margin: "0 0 12px",
    color: COLORS.pinkStrong,
    fontSize: "18px",
    fontFamily: '"Trebuchet MS", sans-serif',
    fontWeight: 700,
  },

  toolGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },

  tool: {
    padding: "10px 12px",
    borderRadius: "14px",
    border: "1px solid rgba(233,106,166,0.14)",
    background: "rgba(255,255,255,0.76)",
    color: COLORS.pinkStrong,
    cursor: "pointer",
    fontWeight: 700,
    fontFamily: '"Trebuchet MS", sans-serif',
  },

  toolActive: {
    padding: "10px 12px",
    borderRadius: "14px",
    border: "1px solid rgba(233,106,166,0.14)",
    background: "linear-gradient(135deg,#f7a8c8,#ffe9a8)",
    color: COLORS.textDark,
    cursor: "pointer",
    fontWeight: 700,
    fontFamily: '"Trebuchet MS", sans-serif',
  },

  colors: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  colorSwatch: {
    width: "34px",
    height: "34px",
    borderRadius: "999px",
    border: "2px solid white",
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(109,88,119,0.10)",
  },

  range: {
    width: "100%",
    accentColor: "#e96aa6",
  },

  smallText: {
    margin: "8px 0 0",
    color: COLORS.text,
    fontFamily: '"Trebuchet MS", sans-serif',
  },

  fingerprint: {
    margin: 0,
    fontFamily: '"Trebuchet MS", sans-serif',
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: COLORS.lilacStrong,
    wordBreak: "break-word",
  },

  canvasArea: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  canvasTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  cloud: {
    background: "rgba(255,255,255,0.92)",
    color: COLORS.textDark,
    padding: "12px 16px",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(249,168,212,0.10)",
    fontFamily: '"Trebuchet MS", sans-serif',
    lineHeight: 1.5,
    border: "1px solid rgba(255,214,234,0.65)",
  },

  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    padding: "10px 16px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg,#f7a8c8,#ffe9a8)",
    color: COLORS.textDark,
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 8px 18px rgba(249,168,212,0.18)",
    fontFamily: '"Trebuchet MS", sans-serif',
  },

  softBtn: {
    padding: "10px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(233,106,166,0.14)",
    background: "rgba(255,255,255,0.78)",
    color: COLORS.pinkStrong,
    cursor: "pointer",
    fontWeight: 700,
    fontFamily: '"Trebuchet MS", sans-serif',
  },

  canvasShell: {
    position: "relative",
    borderRadius: "24px",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.7), transparent 20%), radial-gradient(circle at 80% 20%, rgba(255,214,235,0.4), transparent 25%), linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,233,168,0.22))",
    border: "1px solid rgba(255,255,255,0.28)",
    minHeight: "420px",
  },

  canvas: {
    display: "block",
    width: "100%",
    touchAction: "none",
  },

  note: {
    margin: 0,
    color: COLORS.text,
    fontFamily: '"Trebuchet MS", sans-serif',
    lineHeight: 1.6,
  },
};