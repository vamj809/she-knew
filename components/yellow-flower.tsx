"use client"

import { useEffect, useState, type CSSProperties } from "react"

const PETAL_COUNT = 12
const BLOOM_MS = 1700
const MESSAGE_DELAY_MS = BLOOM_MS + 700

// Ruido pseudoaleatorio determinista (mismo resultado en servidor y cliente).
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

// Un pétalo individual de la flor, posicionado en círculo alrededor del centro.
function Petal({ index, bloomed }: { index: number; bloomed: boolean }) {
  const angle = (360 / PETAL_COUNT) * index
  return (
    <div
      className="absolute left-1/2 top-1/2 h-1/2 w-[22%] origin-bottom"
      style={{
        transform: `translate(-50%, -100%) rotate(${angle}deg) scale(${bloomed ? 1 : 0.12})`,
        opacity: bloomed ? 1 : 0,
        transition: `transform 1500ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 70}ms, opacity 1200ms ease ${
          index * 70
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

// Pétalos que caen de fondo. Antes de florecer la escena se mantiene casi
// inmóvil; después del florecimiento aumentan en número, tamaño y variedad.
function FallingPetals({ dense }: { dense: boolean }) {
  const count = dense ? 16 : 0
  const petals = Array.from({ length: count })
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((_, i) => {
        const r1 = pseudoRandom(i * 3 + 1)
        const r2 = pseudoRandom(i * 3 + 2)
        const r3 = pseudoRandom(i * 3 + 3)
        const r4 = pseudoRandom(i * 5 + 7)
        const r5 = pseudoRandom(i * 7 + 11)
        const r6 = pseudoRandom(i * 11 + 4)
        const r7 = pseudoRandom(i * 13 + 9)

        const isForeground = r1 > 0.78
        const width = isForeground ? 22 + r2 * 8 : 10 + r2 * 8
        const left = r3 * 100
        const duration = 11 + r4 * 9
        const delay = -(r5 * duration)
        const drift = (r6 > 0.5 ? 1 : -1) * (18 + r7 * 55)
        const rotation = 140 + pseudoRandom(i * 17 + 5) * 200
        const peak = isForeground ? 0.72 : 0.38 + r2 * 0.22

        return (
          <span
            key={i}
            className={`animate-leaf-fall absolute -top-10 block rounded-[60%_40%_60%_40%] ${
              isForeground ? "" : "blur-[0.4px]"
            }`}
            style={
              {
                left: `${left}%`,
                width,
                height: width * 0.72,
                background: isForeground
                  ? "linear-gradient(135deg, #ffd84d, #e08d0c)"
                  : i % 2 === 0
                    ? "linear-gradient(135deg, #fff3c9, #ffe266)"
                    : "linear-gradient(135deg, #ffe266, #ffd84d)",
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                "--drift": `${drift}px`,
                "--rotate": `${rotation}deg`,
                "--peak": peak,
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
}

// Invitación previa al florecimiento: una frase íntima y el gesto que se pide.
// Vive fuera del contenedor con animate-sway para no moverse de lado a lado con la flor.
function TapPrompt({ visible }: { visible: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute left-1/2 top-6 z-10 w-[80vw] max-w-xs -translate-x-1/2 text-center transition-opacity duration-700 sm:top-8 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <p className="text-xs font-medium tracking-wide text-amber-800/70">
        Encontré una excusa para hacerte algo.
      </p>
      <p className="animate-hint-float mt-2 text-base font-semibold tracking-wide text-amber-900 sm:text-lg">
        Hazla florecer.
      </p>
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
  const [messageVisible, setMessageVisible] = useState(false)

  useEffect(() => {
    if (!bloomed) return
    const timer = setTimeout(() => setMessageVisible(true), MESSAGE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [bloomed])

  return (
    <main
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-between overflow-hidden px-6 py-10"
      style={{
        background:
          "linear-gradient(180deg, #fffdf5 0%, #fff2c4 45%, #ffe4a3 75%, #f7cf8f 100%)",
      }}
    >
      <FallingPetals dense={bloomed} />

      {/* Encabezado — reservado desde el inicio, visible solo tras florecer */}
      <header className="z-10 text-center">
        <p
          className="text-xs font-medium uppercase tracking-[0.3em] text-amber-700/70 transition-opacity duration-700"
          style={{
            opacity: bloomed ? 1 : 0,
            transitionDelay: bloomed ? `${BLOOM_MS}ms` : "0ms",
          }}
        >
          21 de septiembre
        </p>
      </header>

      {/* Escena de la flor */}
      <section className="relative z-10 flex flex-1 items-center justify-center">
        {bloomed && <Pollen />}

        <button
          type="button"
          onClick={() => setBloomed(true)}
          aria-label={bloomed ? "Flor florecida" : "Toca para hacerla florecer"}
          className="group relative flex flex-col items-center outline-none"
        >
          <TapPrompt visible={!bloomed} />

          <div className="animate-sway relative flex flex-col items-center">
            {/* Flor */}
            <div className="relative h-56 w-56 sm:h-64 sm:w-64">
              {/* Halo brillante */}
              <div
                className={`animate-glow absolute inset-0 rounded-full blur-2xl transition-opacity delay-100 duration-1000 ${
                  bloomed ? "opacity-100" : "opacity-0"
                }`}
                style={{ background: "radial-gradient(circle, #ffe266 0%, transparent 65%)" }}
                aria-hidden="true"
              />

              {/* Cuello que conecta el centro con el tallo */}
              <div
                className="absolute left-1/2 top-1/2 h-1/2 w-2 -translate-x-1/2 rounded-full bg-emerald-500"
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
                className={`animate-breathe absolute left-1/2 top-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform delay-150 duration-1000 ${
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

            {/* Tallo largo, con una sola hoja asimétrica */}
            <div className="relative -mt-2 flex flex-col items-center">
              <div className="relative h-48 w-2 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-700">
                <span
                  className="absolute left-1/2 top-12 h-6 w-12 -translate-x-[15%] rounded-[100%] bg-emerald-500/90"
                  style={{ transform: "rotate(-30deg)" }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </button>
      </section>

      {/* Mensaje */}
      <footer className="z-10 flex w-full max-w-sm flex-col items-center text-center">
        {messageVisible && (
          <div className="max-w-xs" style={{ fontFamily: "var(--font-serif-display)" }}>
            <p className="animate-rise-in text-pretty text-xl leading-relaxed text-amber-950 [text-shadow:0_1px_3px_rgba(255,253,245,0.7)] sm:text-2xl">
              No quería simplemente mandarte una flor amarilla.
            </p>
            <p
              className="animate-rise-in mt-3 text-pretty text-xl font-medium leading-relaxed text-amber-950 [text-shadow:0_1px_3px_rgba(255,253,245,0.7)] sm:text-2xl"
              style={{ animationDelay: "260ms" }}
            >
              Quería hacerte una.
            </p>
            <p
              className="animate-rise-in mt-5 text-pretty text-lg leading-relaxed text-amber-900/90 [text-shadow:0_1px_3px_rgba(255,253,245,0.7)]"
              style={{ animationDelay: "520ms" }}
            >
              Porque después de tantos años,
              <br />
              todavía me gusta encontrar pequeñas formas de decirte
              <br />
              que pienso en ti.
            </p>
            <p
              className="animate-rise-in mt-5 text-pretty text-lg italic leading-relaxed text-amber-900/80 [text-shadow:0_1px_3px_rgba(255,253,245,0.7)]"
              style={{ animationDelay: "780ms" }}
            >
              Esta es la de hoy.
            </p>
            <p
              className="animate-rise-in mt-5 text-pretty text-xl font-medium leading-relaxed text-amber-950 [text-shadow:0_1px_3px_rgba(255,253,245,0.7)] sm:text-2xl"
              style={{ animationDelay: "1040ms" }}
            >
              Feliz día de las flores amarillas, mi amor.
            </p>
          </div>
        )}

        <p className="mt-6 text-xs tracking-widest text-amber-700/40">21 · 09 · 2026</p>
      </footer>
    </main>
  )
}
