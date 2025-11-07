"use client"

import React from "react"

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  animate?: boolean
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  }
  return (
    <div className={`relative p-[4px] group ${containerClassName}`}>
      <div
        className={`absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl  transition duration-500 ${
          animate ? "will-change-transform" : ""
        }`}
        style={{
          background: `linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)`,
          backgroundSize: "400% 400%",
        }}
      />
      <div
        className={`absolute inset-0 rounded-3xl z-[1] ${
          animate ? "will-change-transform" : ""
        }`}
        style={{
          background: `linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)`,
          backgroundSize: "400% 400%",
        }}
      />

      <div className={`relative z-10 ${className}`}>{children}</div>
    </div>
  )
}
