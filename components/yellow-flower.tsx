"use client"

import { useEffect, useState, type CSSProperties } from "react"

const PETAL_COUNT = 12
const BLOOM_MS = 1700
const MESSAGE_DELAY_MS = BLOOM_MS + 700
const EMBLEM_DELAY_MS = 1200

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
      className={`pointer-events-none absolute left-1/2 top-0 z-10 w-[85vw] max-w-sm -translate-x-1/2 -translate-y-[calc(100%+12px)] text-center transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ fontFamily: "var(--font-sans-invitation)" }}
    >
      <p className="text-lg font-medium leading-relaxed tracking-wide text-amber-950/80 sm:text-xl">
        Encontré una excusa para hacerte algo
      </p>
      <p className="animate-hint-float mt-4 text-sm font-medium tracking-widest text-amber-800/60">
        Ayúdala a florecer
      </p>
    </div>
  )
}

// Emblema familiar (public/family-embrace.svg), inlineado para poder controlar
// su color con currentColor/Tailwind — un <img src> no heredaría el color de la página.
function FamilyEmblem() {
  return (
    <svg viewBox="0 0 640 640" className="h-full w-full" aria-hidden="true" focusable="false">
      <path
        d="M0 0 C18.1 15.4 30.9 35.7 33.19 59.7 C34.03 72.15 32.41 84.47 30.43 96.73 C27.66 114.41 31.13 127.79 41.49 142.28 C43.69 145.2 46.04 147.98 48.4 150.76 C49.07 151.62 49.74 152.47 50.43 153.35 C59 163.85 71.91 171.69 82.98 179.32 C91.08 184.92 98.36 190.89 105.4 197.76 C106.04 198.34 106.68 198.92 107.34 199.51 C126.35 217.12 136.59 244.99 137.62 270.41 C138.66 310.35 122.26 347.19 95.08 375.95 C94.63 376.43 94.17 376.91 93.71 377.4 C92.52 378.64 91.34 379.9 90.16 381.16 C40.22 433.21 -45.14 448.39 -114.24 449.98 C-144.34 450.59 -174.72 450.86 -204.6 446.76 C-206.23 446.55 -206.23 446.55 -207.9 446.32 C-248.17 440.79 -289.8 427.47 -322.6 402.76 C-323.67 401.98 -324.74 401.19 -325.82 400.4 C-333.92 394.39 -341.32 387.75 -348.6 380.76 C-349.11 380.27 -349.63 379.79 -350.16 379.29 C-370.51 359.96 -390.31 332.92 -391.6 303.76 C-391.65 302.76 -391.7 301.76 -391.75 300.73 C-392.35 278.8 -385.52 258.84 -370.49 242.61 C-366.29 238.27 -361.81 234.83 -356.6 231.76 C-356.09 231.46 -355.59 231.16 -355.06 230.85 C-344.68 224.86 -333.51 221.11 -322.15 217.44 C-310.42 213.61 -298.57 209.28 -290.66 199.32 C-289.25 195.92 -289.38 193.43 -289.6 189.76 C-293.34 191.17 -296.82 192.88 -300.34 194.76 C-310.17 199.12 -322.49 199.59 -332.66 196.07 C-344.14 191.11 -352.27 184.2 -357.6 172.76 C-357.92 172.11 -358.24 171.46 -358.57 170.79 C-362.81 160.57 -361.81 147.53 -357.86 137.41 C-352.48 126.13 -345.13 118.57 -333.6 113.76 C-333.01 113.51 -332.43 113.27 -331.82 113.01 C-326.29 111.07 -320.37 111.59 -314.6 111.76 C-314.64 110.83 -314.69 109.9 -314.74 108.94 C-315.42 89.44 -307.24 72.89 -294.31 58.63 C-279.21 42.51 -259.45 32.52 -237.2 31.44 C-225.12 31.09 -214.11 32.1 -202.6 35.76 C-202.02 35.94 -201.44 36.12 -200.84 36.3 C-188.34 40.21 -177.55 47.41 -168.1 56.39 C-166.29 58.11 -164.47 59.74 -162.56 61.35 C-150.67 71.52 -143.61 83.96 -141.6 99.76 C-140.54 116.69 -142.44 128.57 -151.6 142.98 C-154.44 147.65 -155.4 151.31 -154.6 156.76 C-153.88 159.31 -153.88 159.31 -152.72 161.45 C-152.36 162.2 -152 162.96 -151.62 163.73 C-151.11 164.74 -151.11 164.74 -150.6 165.76 C-148.81 169.61 -148.04 172.5 -148.6 176.76 C-151.73 180.57 -156.97 180.92 -161.6 181.76 C-161.49 182.78 -161.49 182.78 -161.39 183.81 C-161.22 186.57 -161.16 189.03 -161.6 191.76 C-162.93 193.14 -162.93 193.14 -164.6 194.07 C-165.59 194.63 -166.58 195.19 -167.6 195.76 C-167.57 196.97 -167.57 196.97 -167.53 198.2 C-167.56 199.05 -167.58 199.89 -167.6 200.76 C-169.03 201.84 -169.03 201.84 -170.91 202.95 C-174.38 205.13 -175.2 206.8 -176.16 210.76 C-177.2 214.92 -178.15 217.53 -181.77 219.97 C-187.23 222.33 -192.16 221.42 -197.55 219.29 C-200.98 217.84 -204.34 216.27 -207.7 214.66 C-215.78 210.67 -215.78 210.67 -224.6 210.76 C-241.31 218.33 -254.27 238.45 -260.85 254.86 C-261.46 256.48 -262.03 258.12 -262.6 259.76 C-262.93 260.73 -263.27 261.7 -263.62 262.7 C-267.72 276.5 -266.25 290.35 -261.6 303.76 C-261.07 305.28 -261.07 305.28 -260.53 306.84 C-255.16 320.82 -246.76 332.87 -236.6 343.76 C-236 344.4 -235.4 345.04 -234.79 345.7 C-225.81 355.23 -216.43 363.41 -205.6 370.76 C-205.81 370.31 -206.02 369.86 -206.24 369.39 C-207.81 365.93 -208.99 363.13 -208.85 359.26 C-208.82 358.51 -208.8 357.75 -208.78 356.97 C-208.61 354.93 -208.33 352.96 -207.97 350.95 C-207.45 347.9 -207.45 347.9 -208.03 345.45 C-210.64 342.64 -213.88 342.24 -217.6 341.76 C-219.04 341.78 -220.47 341.82 -221.91 341.89 C-229.32 342.05 -237.13 338.98 -242.97 334.44 C-251.87 325.27 -255.87 313.87 -255.84 301.34 C-255.54 285.47 -247.83 271.66 -236.6 260.76 C-228.92 254.13 -219.99 249.46 -210.6 245.76 C-209.74 245.42 -208.89 245.08 -208 244.73 C-197.48 241.22 -182.78 240.49 -172.66 245.5 C-162.81 251.52 -155.63 258.38 -152.86 269.8 C-152.36 271.93 -151.89 274.05 -151.44 276.19 C-150.83 278.74 -150.83 278.74 -149.26 280.05 C-146.72 281.14 -144.13 281.64 -141.44 282.2 C-139.6 282.76 -139.6 282.76 -137.6 284.76 C-137.26 290.1 -137.26 290.1 -138.6 292.76 C-137.67 293.07 -137.67 293.07 -136.72 293.39 C-133.63 295.39 -133.39 297.2 -132.6 300.76 C-132.51 302.79 -132.54 304.79 -132.61 306.82 C-132.67 308.97 -132.67 308.97 -131.85 311.82 C-131.55 315.34 -132.04 316.95 -133.89 319.9 C-136.57 322.82 -139.87 324.84 -143.27 326.83 C-146.85 329 -148.73 331.02 -150.6 334.76 C-149.65 334.98 -148.71 335.2 -147.74 335.43 C-132.12 339.21 -121.82 345.42 -110.6 356.76 C-109.54 357.78 -109.54 357.78 -108.47 358.82 C-98.97 368.68 -95.33 381.71 -92.6 394.76 C-78.15 382.12 -63.57 366.9 -61.26 346.84 C-61.14 337.87 -62.74 328.71 -69.14 321.96 C-73.32 318.52 -78.31 316.86 -83.34 315.06 C-93.74 311.3 -101.56 305.86 -106.6 295.76 C-109.91 287.62 -112.82 278.42 -109.93 269.75 C-108.66 267.66 -107.8 266.84 -105.6 265.76 C-99.94 265.01 -94.41 265.5 -88.78 266.27 C-84.18 266.87 -79.61 266.98 -74.97 267.01 C-74.15 267.03 -73.33 267.05 -72.49 267.07 C-65.41 267.12 -61.15 265.48 -55.85 260.64 C-50.04 255.38 -43.3 256.26 -35.81 256.58 C-30.44 257.02 -25.57 258.74 -20.6 260.76 C-19.72 261.11 -18.83 261.46 -17.93 261.82 C-0.36 269.68 7.93 285.95 15.4 302.57 C19.27 311.12 23.15 319.61 27.78 327.77 C28.11 328.37 28.45 328.96 28.79 329.57 C30.54 332.72 30.54 332.72 33.4 334.76 C34.22 332.68 35.03 330.6 35.84 328.51 C36.07 327.93 36.3 327.34 36.54 326.73 C41.45 314.06 41.54 297.42 36.72 284.67 C36.28 283.71 35.85 282.75 35.4 281.76 C35.17 281.23 34.93 280.7 34.69 280.15 C27.4 264.1 15.52 253.3 -0.84 246.71 C-16.14 241.47 -30.61 245.97 -44.6 252.76 C-44.51 252.07 -44.43 251.38 -44.34 250.67 C-43.83 245.92 -43.46 241.88 -44.53 237.2 C-44.99 234.07 -44.79 233.06 -43.03 230.37 C-41.59 228.68 -40.14 227.01 -38.68 225.35 C-32.82 218.07 -32.15 209.99 -32.16 201.02 C-32.81 196.17 -34.4 192.96 -37.91 189.45 C-41.43 187.24 -44.12 186.27 -48.3 187.1 C-52.94 188.6 -56.88 191.11 -60.97 193.7 C-69.41 199.01 -77.3 203.3 -87.6 201.76 C-90.53 200.45 -90.53 200.45 -92.6 198.76 C-93.35 198.17 -93.35 198.17 -94.12 197.56 C-96.16 195.08 -96.58 192.38 -97.28 189.32 C-98.17 185.96 -98.9 183.36 -101.63 181.02 C-103.61 180.06 -105.47 179.31 -107.6 178.76 C-107.6 176.45 -107.6 174.14 -107.6 171.76 C-109.02 171.61 -109.02 171.61 -110.47 171.45 C-113.6 170.76 -113.6 170.76 -114.78 169.54 C-115.88 167.14 -115.79 165.21 -115.72 162.57 C-115.7 161.67 -115.69 160.77 -115.67 159.84 C-115.63 158.81 -115.63 158.81 -115.6 157.76 C-116.41 157.8 -117.21 157.83 -118.05 157.87 C-119.65 157.91 -119.65 157.91 -121.28 157.95 C-122.34 157.98 -123.4 158.02 -124.48 158.05 C-128.15 157.71 -129.87 157.26 -132.6 154.76 C-134.71 149 -133.1 143.66 -131.22 138.07 C-126.94 126.04 -126.94 126.04 -128.47 113.79 C-129.68 111.89 -130.98 110.11 -132.35 108.32 C-137.99 100.46 -142.72 92.26 -142.73 82.31 C-142.73 81.46 -142.73 80.62 -142.73 79.74 C-142.73 78.86 -142.73 77.98 -142.72 77.07 C-142.73 76.21 -142.73 75.35 -142.73 74.47 C-142.73 68.83 -142.34 63.34 -141.6 57.76 C-142.7 57.4 -142.7 57.4 -143.83 57.03 C-154.02 53.53 -158.83 49.5 -163.6 39.76 C-165.86 33.62 -165.71 28.14 -164.6 21.76 C-163.79 21.85 -163.79 21.85 -162.97 21.94 C-144.55 23 -127.86 11.51 -112.71 2.45 C-79.74 -17.22 -31.96 -25.79 0 0 Z M-30.6 299.76 C-29.6 302.76 -29.6 302.76 -29.6 302.76 Z M-31.6 302.76 C-37.21 318.64 -41.79 332.89 -34.57 349.07 C-31.14 355.2 -26.2 358.56 -19.6 360.76 C-11.27 361.45 -5.57 360.58 1.22 355.76 C3.72 353.55 3.72 353.55 5.4 350.76 C5.07 349.77 4.74 348.78 4.4 347.76 C3.99 348.16 3.58 348.56 3.15 348.97 C-2.17 353.85 -7.29 356.76 -14.6 357.2 C-20.32 356.95 -24.86 354.45 -28.91 350.51 C-32.87 344.06 -34.1 338.15 -33.97 330.64 C-33.96 329.4 -33.96 329.4 -33.96 328.14 C-33.83 321.69 -32.83 315.77 -31.16 309.55 C-30.61 306.8 -30.65 305.36 -31.6 302.76 Z M5.4 345.76 C6.4 347.76 6.4 347.76 6.4 347.76 Z "
        fill="currentColor"
        transform="translate(451.597412109375,103.238037109375)"
      />
    </svg>
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
          aria-label={bloomed ? "Flor florecida" : "Ayúdala a florecer"}
          className="group relative flex flex-col items-center outline-none"
        >
          <TapPrompt visible={!bloomed} />

          <div className="animate-sway relative flex flex-col items-center">
            {/* Flor */}
            <div className="relative z-10 h-56 w-56 sm:h-64 sm:w-64">
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
                {/* Textura de semillas, solo mientras el brote está cerrado */}
                {!bloomed && (
                  <div className="grid grid-cols-4 gap-[3px] opacity-70">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <span key={i} className="h-1 w-1 rounded-full bg-amber-200/60" />
                    ))}
                  </div>
                )}

                {/* Emblema familiar, revelado como un detalle oculto tras el florecimiento */}
                {bloomed && (
                  <div
                    className="animate-emblem-reveal h-[85%] w-[85%] text-amber-200"
                    style={{
                      animationDelay: `${EMBLEM_DELAY_MS}ms`,
                      filter: "drop-shadow(0 0 4px rgba(255, 226, 102, 0.25))",
                    }}
                  >
                    <FamilyEmblem />
                  </div>
                )}
              </div>
            </div>

            {/* Tallo largo, con una hoja asimétrica desde el inicio */}
            <div className="relative z-0 -mt-2 flex flex-col items-center">
              <div className="relative h-48 w-2 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-700">
                <span
                  className="absolute left-1/2 top-12 h-6 w-12 -translate-x-[15%] rounded-[100%] bg-emerald-500/90"
                  style={{ transform: "rotate(-30deg)" }}
                  aria-hidden="true"
                />

                {/* Segunda hoja, revelada como parte del florecimiento: lado opuesto,
                    más abajo, más pequeña y en un ángulo distinto para no verse simétrica */}
                {bloomed && (
                  <span
                    className="absolute left-1/2 top-20 h-4 w-8 -translate-x-[85%]"
                    style={{ transform: "rotate(50deg)" }}
                    aria-hidden="true"
                  >
                    <span
                      className="animate-leaf-unfurl block h-full w-full rounded-[100%] bg-emerald-600/90"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                )}
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
              todavía me gusta encontrar formas nuevas de decirte
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
