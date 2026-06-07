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
            src="https://public.readdy.ai/ai/img_res/c99949a7-105a-4e7e-b54f-999d11a6f167.png"
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
              className="leading-none mt-0.5"
              style={{
                color: '#5C1422',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: '0.65rem',
                letterSpacing: '0.05em',
                WebkitTextStroke: '0.25px #5C1422',
                filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.7))',
              }}
            >
              Comparto tu Esperanza
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="animate-fade-in-up flex items-center justify-center gap-4 mb-4 flex-wrap">
            <img
              src={`${typeof __BASE_PATH__ !== 'undefined' ? __BASE_PATH__ : '/'}images/hoja.png`}
              alt="Hoja"
              style={{
                height: 'clamp(2.5rem, 6vw, 4.5rem)',
                width: 'auto',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
              }}
            />
            <h1
              className="uppercase leading-[0.95]"
              style={{
                color: '#E8C93A',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 950,
                fontSize: 'clamp(2rem, 5vw, 3.6rem)',
                letterSpacing: '-0.01em',
                WebkitTextStroke: '0.8px #D4AF20',
                filter: 'drop-shadow(0 0 22px rgba(232,201,58,0.65)) drop-shadow(0 2px 10px rgba(0,0,0,0.7))',
                margin: 0,
                textShadow: '0 0 40px rgba(232,201,58,0.4)',
              }}
            >
              COMPARTO <em style={{ fontStyle: 'italic', textTransform: 'lowercase', fontSize: '0.72em', fontWeight: 800, letterSpacing: '0.01em', verticalAlign: 'middle' }}>tu</em> ESPERANZA
            </h1>
          </div>
          <p
            className="animate-fade-in-up delay-200"
            style={{
              color: '#CC0000',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 950,
              fontStyle: 'italic',
              fontSize: 'clamp(1.2rem, 2.8vw, 1.9rem)',
              letterSpacing: '0.04em',
              textShadow: '0 1px 6px rgba(0,0,0,0.5)',
            }}
          >
            Bienvenido a esta gran familia
          </p>
          <p className="animate-fade-in-up delay-300 mt-8 max-w-lg mx-auto leading-relaxed text-white" style={{ fontFamily: 'Arial, sans-serif', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontWeight: 400 }}>
            Ingrese a su página personal para revisar su información de manera segura y privada.
          </p>
          <div className="animate-fade-in-scale delay-400 mt-12">
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
              <span className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: '9999px' }}>
                <span
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    background: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
                    animation: "shine 2.5s ease-in-out infinite",
                    transform: "skewX(-20deg)",
                  }}
                />
              </span>
              <span className="relative z-10 font-serif font-bold tracking-[0.2em] uppercase text-sm" style={{ color: '#f5d0a9' }}>Acceder al Portal</span>
              <i className="ri-arrow-right-line text-base relative z-10" style={{ color: '#f5d0a9' }} />
            </button>
          </div>
        </div>
      </main>

    </div>
  );
}