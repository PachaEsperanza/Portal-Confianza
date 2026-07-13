import { useNavigate } from "react-router-dom";

declare const __BASE_PATH__: string;

export default function Home() {
  const navigate = useNavigate();
  const basePath = typeof __BASE_PATH__ !== 'undefined' ? __BASE_PATH__ : '/';

  return (
    <div className="relative min-h-screen w-full flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={`${basePath}images/coments.jpg`.replace('//', '/')}
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ display: 'block' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/25 via-stone-900/20 to-stone-950/35" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-3">
          <img
            src={`${basePath}images/hoja.png`.replace('//', '/')}
            alt="Logo"
            className="h-10 w-auto"
          />
          <div className="hidden sm:flex flex-col items-start">
            <span
              className="uppercase leading-none"
              style={{
                color: '#5C1422',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 950,
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                WebkitTextStroke: '0.3px #5C1422',
                filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.85)) drop-shadow(0 0 14px rgba(255,255,255,0.45))',
              }}
            >
              Portal Miembros de la Familia
            </span>
            <span
              className="leading-none mt-0.5 uppercase"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 100,
                color: '#5C1422',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
              }}
            >
              PΛCHΛ ESPERANZA
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-start justify-center px-6 md:px-16 text-left">
        <div className="max-w-3xl">
          <div className="animate-fade-in-up flex items-center justify-start gap-4 mb-4 flex-wrap">
            <div className="flex flex-col items-start">
              <div className="flex items-end gap-1">
                <span style={{
                  display: 'block',
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: 'clamp(2.6rem,7vw,5.7rem)',
                  fontWeight: 100,
                  letterSpacing: '0.3em',
                  lineHeight: 1,
                  color: '#FF1E1E',
                  textShadow: '0 2px 10px rgba(0,0,0,0.55)',
                }}>PΛCHΛ</span>
                <img
                  src={`${typeof __BASE_PATH__ !== 'undefined' ? __BASE_PATH__ : '/'}images/hoja.png`}
                  alt="Hoja"
                  style={{
                    height: 'clamp(3.5rem, 8vw, 6.5rem)',
                    width: 'auto',
                    marginLeft: '-0.75rem',
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
                  }}
                />
              </div>
              <span style={{
                display: 'block',
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: 'clamp(0.75rem,1.9vw,1.55rem)',
                fontWeight: 100,
                letterSpacing: '0.55em',
                color: '#FF1E1E',
                textShadow: '0 2px 8px rgba(0,0,0,0.55)',
                textTransform: 'uppercase',
                marginTop: '0.15em',
                lineHeight: 1,
              }}>ESPERANZA</span>
            </div>
          </div>
          <p
            className="animate-fade-in-up delay-200 text-left"
            style={{
              color: '#FFD700',
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(0.8rem, 1.9vw, 1.2rem)',
              letterSpacing: '0.04em',
              textShadow: '0 1px 6px rgba(0,0,0,0.5)',
            }}
          >
            Bienvenido a esta gran familia
          </p>
          <p className="animate-fade-in-up delay-300 mt-8 max-w-lg leading-relaxed text-white text-left" style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 'clamp(0.85rem, 1.8vw, 1rem)', fontWeight: 400 }}>
            Ingrese a su página personal para revisar su información de manera segura y privada.
          </p>
        </div>
        <div className="animate-fade-in-scale delay-400 mt-12 w-full flex justify-center">
          <button
            onClick={() => navigate("/auth")}
            className="relative inline-flex items-center gap-3 text-white px-12 py-4 cursor-pointer overflow-hidden whitespace-nowrap transition-all duration-300 hover:scale-105"
            style={{
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #4a0d1a 0%, #7A1D2E 40%, #9f1239 60%, #4a0d1a 100%)',
              boxShadow: '0 0 32px rgba(122,29,46,0.7), 0 0 64px rgba(122,29,46,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.12)',
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          >
            <span className="relative z-10 font-serif font-bold tracking-[0.2em] uppercase text-sm" style={{ color: '#f5d0a9' }}>Acceder al Portal</span>
            <i className="ri-arrow-right-line text-base relative z-10" style={{ color: '#f5d0a9' }} />
          </button>
        </div>
      </main>

    </div>
  );
}