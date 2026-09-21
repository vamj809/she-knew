"use client"

import { useState, type CSSProperties } from "react"

const PETAL_COUNT = 12

// Un pétalo individual de la flor, posicionado en círculo alrededor del centro.
function Petal({ index, bloomed }: { index: number; bloomed: boolean }) {
  const angle = (360 / PETAL_COUNT) * index
  return (
    <div
      className="absolute left-1/2 top-1/2 h-1/2 w-[22%] origin-bottom"
      style={{
        transform: `translate(-50%, -100%) rotate(${angle}deg) scale(${bloomed ? 1 : 0.12})`,
        opacity: bloomed ? 1 : 0,
        transition: `transform 900ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 45}ms, opacity 700ms ease ${
          index * 45
        }ms`,
      }}
    >
      <div
        className="h-full w-full rounded-full"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 20%, #fff6c9 0%, #ffe266 38%, #f5b820 78%, #e59b0c 100%)",
          boxShadow: "inset 0 -6px 12px rgba(200,120,0,0.25)",
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// Pétalos que caen lentamente de fondo, efecto ambiental continuo.
function FallingPetals() {
  const petals = Array.from({ length: 10 })
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((_, i) => {
        const left = (i * 47 + 13) % 100
        const width = 10 + ((i * 5) % 10)
        const duration = 10 + ((i * 4) % 12)
        const delay = -((i * 1.7) % duration)
        const drift = (i % 2 === 0 ? 1 : -1) * (20 + ((i * 6) % 30))
        return (
          <span
            key={i}
            className="animate-leaf-fall absolute -top-10 block rounded-[60%_40%_60%_40%]"
            style={
              {
                left: `${left}%`,
                width,
                height: width * 0.7,
                background:
                  i % 2 === 0
                    ? "linear-gradient(135deg, #ffe266, #f5b820)"
                    : "linear-gradient(135deg, #ffd84d, #e59b0c)",
                opacity: 0.55,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                "--drift": `${drift}px`,
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
}

// Invitación flotante a tocar la flor, visible mientras no ha florecido.
function FloatingHint({ visible }: { visible: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute left-1/2 top-[10%] z-10 -translate-x-1/2 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="animate-hint-float inline-block rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-amber-800 shadow-sm backdrop-blur">
        Toca la flor 🌼
      </span>
    </div>
  )
}

// Partículas de polen que flotan hacia arriba cuando la flor está abierta.
function Pollen() {
  const bits = Array.from({ length: 14 })
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {bits.map((_, i) => {
        const left = (i * 37) % 100
        const size = 4 + ((i * 7) % 8)
        const duration = 5 + ((i * 3) % 6)
        const delay = (i * 0.6) % 5
        return (
          <span
            key={i}
            className="animate-float-up absolute bottom-8 rounded-full"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              background: i % 3 === 0 ? "#fff6c9" : "#ffd84d",
              boxShadow: "0 0 8px rgba(255,216,77,0.8)",
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        )
      })}
    </div>
  )
}

export function YellowFlower() {
  const [bloomed, setBloomed] = useState(false)

  return (
    <main
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-between overflow-hidden px-6 py-10"
      style={{
        background:
          "linear-gradient(180deg, #fffdf5 0%, #fff2c4 45%, #ffe4a3 75%, #f7cf8f 100%)",
      }}
    >
      <FallingPetals />
      <FloatingHint visible={!bloomed} />

      {/* Encabezado */}
      <header className="z-10 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-700/80">
          Día de la flor amarilla
        </p>
        <h1 className="mt-2 text-balance font-serif text-2xl font-semibold text-amber-900">
          Una flor amarilla para ti
        </h1>
      </header>

      {/* Escena de la flor */}
      <section className="relative z-10 flex flex-1 items-center justify-center">
        {bloomed && <Pollen />}

        <button
          type="button"
          onClick={() => setBloomed(true)}
          aria-label={bloomed ? "Flor florecida" : "Toca para hacer florecer la flor y ver el mensaje"}
          className="group relative flex flex-col items-center outline-none"
        >
          <div className="animate-sway relative flex flex-col items-center">
            {/* Flor */}
            <div className="relative h-56 w-56 sm:h-64 sm:w-64">
              {/* Halo brillante */}
              <div
                className={`animate-glow absolute inset-0 rounded-full blur-2xl transition-opacity duration-700 ${
                  bloomed ? "opacity-100" : "opacity-0"
                }`}
                style={{ background: "radial-gradient(circle, #ffe266 0%, transparent 65%)" }}
                aria-hidden="true"
              />

              {/* Pétalos */}
              <div className="absolute inset-0">
                {Array.from({ length: PETAL_COUNT }).map((_, i) => (
                  <Petal key={i} index={i} bloomed={bloomed} />
                ))}
              </div>

              {/* Centro */}
              <div
                className={`animate-breathe absolute left-1/2 top-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-700 ${
                  bloomed ? "scale-100" : "scale-90"
                }`}
                style={{
                  background:
                    "radial-gradient(circle at 40% 35%, #b9711a 0%, #8a4f10 70%, #6d3d0a 100%)",
                  boxShadow: "inset 0 3px 10px rgba(0,0,0,0.35), 0 2px 8px rgba(120,70,0,0.4)",
                }}
                aria-hidden="true"
              >
                {/* Textura de semillas */}
                <div className="grid grid-cols-4 gap-[3px] opacity-70">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <span key={i} className="h-1 w-1 rounded-full bg-amber-200/60" />
                  ))}
                </div>
              </div>
            </div>

            {/* Tallo y hojas */}
            <div className="relative -mt-2 flex flex-col items-center">
              <div className="relative h-40 w-2 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-700">
                <span
                  className="absolute left-1/2 top-8 h-8 w-14 -translate-x-[10%] rounded-[100%] bg-emerald-500"
                  style={{ transform: "rotate(-35deg)" }}
                  aria-hidden="true"
                />
                <span
                  className="absolute left-1/2 top-16 h-8 w-14 -translate-x-[90%] rounded-[100%] bg-emerald-600"
                  style={{ transform: "rotate(35deg)" }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </button>
      </section>

      {/* Mensaje */}
      <footer className="z-10 flex w-full max-w-sm flex-col items-center text-center">
        {bloomed && (
          <div className="animate-rise-in max-w-xs">
            {/* Placeholder — reemplazar con el mensaje real */}
            <p className="text-pretty font-serif text-lg leading-relaxed text-amber-900 [text-shadow:0_2px_16px_rgba(255,253,245,0.9)]">
              En el día de la flor amarilla, esta es para ti.
            </p>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-amber-800/90 [text-shadow:0_2px_16px_rgba(255,253,245,0.9)]">
              No es de plástico ni se marchita: florece cada vez que la miras y lleva todo lo que siento por ti 💛
            </p>
          </div>
        )}

        <p className="mt-6 text-xs text-amber-700/60">Hecho con cariño para ti</p>
      </footer>
    </main>
  )
}
