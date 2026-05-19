import React from "react";

const OfferBadge = ({
  percentage,
  text,
  size = 180,
  bgColor = "#1BD14F",
  foldColor = "#d62828",
}) => {
  const spikes = 28;
  const outerRadius = 50;
  const innerRadius = 42;

  const points = [];

  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI * i) / spikes;

    const radius = i % 2 === 0 ? outerRadius : innerRadius;

    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);

    points.push(`${x}% ${y}%`);
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
    >
      {/* Main Star Burst */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${bgColor}, #ffcc33)`,
          clipPath: `polygon(${points.join(",")})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: "bold",
          position: "relative",
          boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            fontSize: size * 0.23,
            lineHeight: 1,
          }}
        >
          {percentage}
        </div>

        <div
          style={{
            fontSize: size * 0.16,
            // textTransform: "lowercase",
            color: "#b71c1c",
            marginTop: 4,
          }}
        >
          {text}
        </div>

        {/* Fold Corner */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            width: size * 0.28,
            height: size * 0.28,
            background: `linear-gradient(135deg, ${foldColor}, #8b0000)`,
            borderTopRightRadius: "100%",
            transform: "rotate(-8deg)",
            boxShadow: "inset -5px -5px 10px rgba(0,0,0,0.25)",
          }}
        />
      </div>
    </div>
  );
};

export default OfferBadge;
