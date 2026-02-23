"use client"

import { MeshGradient } from "@paper-design/shaders-react"
import { useTheme } from "@/hooks/useTheme"

/**
 * Fixed MeshGradient shader background for Classic theme.
 * Renders behind all content across the full page with pointer-events: none.
 */
const ClassicMeshBackground = () => {
  const { isClassic } = useTheme()

  if (!isClassic) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <MeshGradient
        colors={["#d4c5a0", "#c9b896", "#e8dcc8", "#bfae8e"]}
        speed={0.12}
        distortion={0.4}
        swirl={0.15}
        grainOverlay={0.08}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
          opacity: 0.55,
        }}
      />
      {/* Soft vignette to maintain classic parchment feel */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, hsl(38 33% 93% / 0.5) 100%)",
        }}
      />
    </div>
  )
}

export default ClassicMeshBackground
