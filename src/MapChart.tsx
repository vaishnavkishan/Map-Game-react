import React from "react";
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import type { GeoObject, Guess } from './types';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Define the props for this component
interface MapChartProps {
  onCountryClick: (geo: GeoObject) => void;
  guesses: Guess[];
  isFinished: boolean;
}

const MapChart: React.FC<MapChartProps> = ({ onCountryClick, guesses, isFinished }) => {

  const getCountryColor = (geo: GeoObject): string => {
    if (!isFinished && guesses.findIndex(x=>x.name === geo.properties.name) >= 0) {
      return "#000"; // Default color during the game
    }
    const guess = guesses.find((g) => g.name === geo.properties.name);
    if (guess) {
      return guess.correct ? "#4CAF50" : "#F44336"; // Green for correct, Red for incorrect
    }
    return "#D6D6DA"; // Default for unguessed countries
  };

  return (
    <ComposableMap>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            // Cast the geo object to your defined type for type safety
            const geoTyped = geo as unknown as GeoObject;
            return (
              <Geography
                key={geoTyped.rsmKey}
                geography={geo}
                onClick={() => onCountryClick(geoTyped)}
                style={{
                  default: { fill: getCountryColor(geoTyped), outline: "none" },
                  hover: { fill: isFinished ? getCountryColor(geoTyped) : "#F53", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;