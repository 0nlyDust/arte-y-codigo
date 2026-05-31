import React, { useMemo, useRef, useState } from "react";
import "./App.css";

import ducksImg from "./assets/ducks.png";
import dashboardImg from "./assets/Dashboard.png";
import dashboardPreviewImg from "./assets/dashboard-user.png";
import roomImg from "./assets/render-habitacion.png";
import wumpusImg from "./assets/Wumpus.png";
import bookImg from "./assets/retro-icons/libro.svg";
import cardImg from "./assets/retro-icons/tarjeta.svg";
import computerImg from "./assets/retro-icons/ordenador.svg";
import folderImg from "./assets/retro-icons/carpeta.svg";
import disksImg from "./assets/retro-icons/discos.svg";

const icons = {
  computer: computerImg,
  card: cardImg,
  folder: folderImg,
  disks: disksImg,
  book: bookImg,
};

const projects = [
  {
    title: "Hunt the Wumpus",
    description: "Agente inteligente que busca el oro mientras evita peligros.",
    image: wumpusImg,
    url: "https://github.com/0nlyDust/Wumpus",
    tags: ["IA", "JavaScript", "Lógica"],
  },
  {
    title: "Duck Pond",
    description: "Juego relajante con patitos, personalización y estética amable.",
    image: ducksImg,
    url: "https://github.com/0nlyDust/Ducks/tree/main",
    tags: ["Juego", "UI", "Creatividad"],
  },
  {
    title: "Covid-19 Dashboard",
    description: "Dashboard interactivo para visualizar datos de COVID-19.",
    image: dashboardImg,
    url: "https://github.com/0nlyDust/Covid_Dashboard_",
    tags: ["Datos", "Dashboard", "Visualización"],
  },
  {
    title: "3D Room",
    description: "Habitación 3D low poly creada en Blender.",
    image: roomImg,
    url: "#",
    tags: ["Blender", "3D", "Arte digital"],
  },
];

const initialWindows = {
  computer: {
    title: "mi_ordenador.exe",
    icon: icons.computer,
    x: 250,
    y: 72,
    width: 760,
    height: 470,
    open: true,
    minimized: false,
    maximized: false,
  },
  about: {
    title: "tarjeta.txt",
    icon: icons.card,
    x: 170,
    y: 190,
    width: 340,
    height: 270,
    open: false,
    minimized: false,
    maximized: false,
  },
  projects: {
    title: "carpeta_proyectos",
    icon: icons.folder,
    x: 430,
    y: 120,
    width: 680,
    height: 480,
    open: false,
    minimized: false,
    maximized: false,
  },
  disks: {
    title: "discos.exe",
    icon: icons.disks,
    x: 520,
    y: 250,
    width: 370,
    height: 260,
    open: false,
    minimized: false,
    maximized: false,
  },
  book: {
    title: "libro_skills.ini",
    icon: icons.book,
    x: 720,
    y: 180,
    width: 360,
    height: 290,
    open: false,
    minimized: false,
    maximized: false,
  },
};

const desktopIcons = [
  { id: "computer", label: "Mi ordenador", icon: icons.computer },
  { id: "about", label: "Tarjeta", icon: icons.card },
  { id: "projects", label: "Carpeta", icon: icons.folder },
  { id: "disks", label: "Discos", icon: icons.disks },
  { id: "book", label: "Libro", icon: icons.book },
];

function ComputerContent({ openWindow }) {
  return (
    <div className="window-content computer-content">
      <div className="paint-menu">File&nbsp;&nbsp;Edit&nbsp;&nbsp;View&nbsp;&nbsp;Image&nbsp;&nbsp;Colors&nbsp;&nbsp;Help</div>
      <div className="computer-grid">
        <section className="intro-panel">
          <p className="window-label">Portfolio responsive</p>
          <h1>Proyectos con alma digital.</h1>
          <p>
            Soy <strong>María</strong>, graduada en Ingeniería Informática. Me gusta unir
            programación, dibujo y diseño para crear experiencias web interactivas.
          </p>
          <div className="button-row">
            <button type="button" className="retro-button" onClick={() => openWindow("projects")}>Abrir carpeta</button>
            <button type="button" className="retro-button" onClick={() => openWindow("about")}>Ver tarjeta</button>
            <button type="button" className="retro-button" onClick={() => openWindow("book")}>Skills</button>
          </div>
        </section>

        <section className="paint-box" aria-label="Ilustración estilo Paint">
          <div className="paint-tools">
            {['✎', '□', '○', 'A', '⌁', '▱', '◢', '✣'].map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="paint-canvas">
            <img src={dashboardPreviewImg} alt="Vista previa del dashboard clouds" className="dashboard-preview" />
          </div>
          <div className="paint-palette">{Array.from({ length: 18 }).map((_, i) => <span key={i} />)}</div>
        </section>
      </div>
    </div>
  );
}

function AboutContent() {
  return (
    <div className="window-content padded scroll-inside">
      <p><strong>Hola, soy María.</strong></p>
      <p>
        Estudiante de Ingeniería Informática. Me gusta unir programación, dibujo y diseño
        para crear experiencias web interactivas con personalidad.
      </p>
      <p>
        Creo que el código también puede ser arte: una forma de construir mundos,
        resolver problemas y expresar ideas visuales.
      </p>
    </div>
  );
}

function ProjectsContent() {
  return (
    <div className="window-content padded scroll-inside">
      <p className="window-label">Explorador de archivos</p>
      <h2>Proyectos destacados</h2>
      <div className="project-list">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
            <img src={project.image} alt={project.title} />
            <div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <a href={project.url} target="_blank" rel="noreferrer">Abrir proyecto</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function DisksContent() {
  return (
    <div className="window-content padded scroll-inside">
      <p className="window-label">Contacto</p>
      <div className="contact-list">
        <a href="mailto:maria.mgy004@gmail.com">maria.mgy004@gmail.com</a>
        <a href="https://github.com/0nlyDust" target="_blank" rel="noreferrer">GitHub / 0nlyDust</a>
        <a href="https://linkedin.com/in/maria-molina-goyena-104aba30b" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </div>
  );
}

function BookContent() {
  const skills = ["React", "Vite", "JavaScript", "CSS", "Canvas API", "GitHub Pages", "Diseño UI", "Blender"];
  return (
    <div className="window-content padded scroll-inside">
      <p className="window-label">Skills</p>
      <div className="skill-list">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
    </div>
  );
}

function Window({ id, data, zIndex, openWindow, onFocus, onClose, onMinimize, onMaximize, onMove }) {
  const dragRef = useRef(null);

  const content = {
    computer: <ComputerContent openWindow={openWindow} />,
    about: <AboutContent />,
    projects: <ProjectsContent />,
    disks: <DisksContent />,
    book: <BookContent />,
  }[id];

  const startDrag = (event) => {
    if (event.button !== 0 || data.maximized) return;
    event.preventDefault();
    onFocus(id);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: data.x,
      originY: data.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const drag = (event) => {
    const state = dragRef.current;
    if (!state || state.pointerId !== event.pointerId) return;
    onMove(id, state.originX + event.clientX - state.startX, state.originY + event.clientY - state.startY);
  };

  const stopDrag = (event) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  };

  const stopButtonEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <section
      className={`retro-window ${data.maximized ? "is-maximized" : ""}`}
      style={data.maximized ? { zIndex } : { left: data.x, top: data.y, width: data.width, height: data.height, zIndex }}
      onPointerDown={() => onFocus(id)}
    >
      <header
        className="titlebar"
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onDoubleClick={(event) => { event.stopPropagation(); onMaximize(id); }}
      >
        <div className="titlebar-title">
          <img src={data.icon} alt="" />
          <span>{data.title}</span>
        </div>
        <div className="window-buttons" onPointerDown={stopButtonEvent} onDoubleClick={(event) => event.stopPropagation()}>
          <button type="button" aria-label="Minimizar" onClick={(event) => { stopButtonEvent(event); onMinimize(id); }}>_</button>
          <button type="button" aria-label="Maximizar" onClick={(event) => { stopButtonEvent(event); onMaximize(id); }}>□</button>
          <button type="button" aria-label="Cerrar" onClick={(event) => { stopButtonEvent(event); onClose(id); }}>×</button>
        </div>
      </header>
      {content}
    </section>
  );
}

export default function App() {
  const [windows, setWindows] = useState(initialWindows);
  const [zOrder, setZOrder] = useState(["computer", "about", "projects", "disks", "book"]);
  const [startOpen, setStartOpen] = useState(false);
  const clock = useMemo(() => "8:52 PM", []);

  const focusWindow = (id) => {
    setZOrder((current) => [...current.filter((item) => item !== id), id]);
  };

  const openWindow = (id) => {
    setWindows((current) => ({
      ...current,
      [id]: { ...current[id], open: true, minimized: false },
    }));
    focusWindow(id);
    setStartOpen(false);
  };

  const closeWindow = (id) => {
    setWindows((current) => ({
      ...current,
      [id]: { ...current[id], open: false, minimized: false, maximized: false },
    }));
  };

  const minimizeWindow = (id) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], minimized: true } }));
  };

  const maximizeWindow = (id) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], minimized: false, maximized: !current[id].maximized } }));
    focusWindow(id);
  };

  const moveWindow = (id, x, y) => {
    setWindows((current) => {
      const win = current[id];
      const maxX = Math.max(105, window.innerWidth - win.width - 12);
      const maxY = Math.max(8, window.innerHeight - win.height - 58);
      return {
        ...current,
        [id]: {
          ...win,
          x: Math.min(Math.max(106, x), maxX),
          y: Math.min(Math.max(8, y), maxY),
        },
      };
    });
  };

  const visibleWindows = zOrder.filter((id) => windows[id].open && !windows[id].minimized);
  const taskbarWindows = Object.entries(windows).filter(([, win]) => win.open);

  return (
    <main className="desktop-shell">
      <aside className="desktop-icons" aria-label="Iconos del escritorio">
        {desktopIcons.map((icon) => (
          <button className="desktop-icon" type="button" key={icon.id} onClick={() => openWindow(icon.id)}>
            <img src={icon.icon} alt="" />
            <span>{icon.label}</span>
          </button>
        ))}
      </aside>

      <section className="desktop-logo" aria-hidden="true">
        <span>Microsoft</span>
        <strong>Windows 98</strong>
        <em>Portfolio Edition</em>
      </section>

      <section className="windows-layer" aria-label="Ventanas del escritorio">
        {visibleWindows.map((id) => (
          <Window
            key={id}
            id={id}
            data={windows[id]}
            zIndex={10 + zOrder.indexOf(id)}
            openWindow={openWindow}
            onFocus={focusWindow}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onMove={moveWindow}
          />
        ))}
      </section>

      <nav className="taskbar" aria-label="Barra de tareas">
        <button type="button" className="start-button" onClick={() => setStartOpen((value) => !value)}>
          <img src={icons.computer} alt="" /> Start
        </button>

        {startOpen && (
          <div className="start-menu">
            <div className="start-menu-side">Portfolio 98</div>
            <div className="start-menu-options">
              {desktopIcons.map((icon) => (
                <button type="button" key={icon.id} onClick={() => openWindow(icon.id)}>
                  <img src={icon.icon} alt="" /> {icon.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="quick-icons" aria-hidden="true">
          <img src={icons.card} alt="" />
          <img src={icons.folder} alt="" />
          <img src={icons.disks} alt="" />
          <img src={icons.book} alt="" />
        </div>

        <div className="taskbar-items">
          {taskbarWindows.map(([id, win]) => (
            <button type="button" key={id} className={win.minimized ? "is-minimized" : ""} onClick={() => openWindow(id)}>
              <img src={win.icon} alt="" />
              <span>{win.title}</span>
            </button>
          ))}
        </div>

        <div className="tray" aria-hidden="true">
          <img src={icons.disks} alt="" />
        </div>
        <time className="clock">{clock}</time>
      </nav>
    </main>
  );
}
