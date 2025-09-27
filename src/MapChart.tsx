import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import type { GeoObject, Guess } from "./types";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapChartProps {
  onCountryClick: (geo: GeoObject) => void;
  guesses: Guess[];
  isFinished: boolean;
}

const MapChart: React.FC<MapChartProps> = ({
  onCountryClick,
  guesses,
  isFinished,
}) => {
  const getCountryColor = (geo: GeoObject): string => {
    // During the game, guessed countries are dimmed
    if (
      !isFinished &&
      guesses.findIndex((x) => x.name === geo.properties.name) >= 0
    ) {
      return "#222"; // dimmed while playing
    }
    const guess = guesses.find((g) => g.name === geo.properties.name);
    if (guess) {
      return guess.correct ? "#10b981" : "#ef4444"; // emerald / rose
    }
    return "#334155"; // slate-700 default
  };

  return (
    <div className="h-full w-full">
      <ComposableMap
        style={{ width: "100%", height: "100%" }}
        projectionConfig={{ scale: 200 }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const geoTyped = geo as unknown as GeoObject;
              const fill = getCountryColor(geoTyped);
              return (
                <Geography
                  key={geoTyped.rsmKey}
                  geography={geo}
                  onClick={() => onCountryClick(geoTyped)}
                  style={{
                    default: {
                      fill,
                      outline: "none",
                      transition: "fill 200ms ease",
                    },
                    hover: {
                      fill: isFinished ? fill : "#22d3ee", // cyan-400 on hover
                      outline: "none",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default MapChart;
