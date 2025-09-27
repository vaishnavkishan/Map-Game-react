// The structure of the geography object provided by react-simple-maps
export interface GeoObject {
  rsmKey: string;
  properties: {
    name: string;
    // Add other properties you might need from your TopoJSON file
  };
}

// The structure for each guess the user makes
export interface Guess {
  name: string;
  correct: boolean;
}