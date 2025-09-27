import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import type { GeoObject } from "./types";
import MapChart from "./MapChart";
import { useDispatch, useSelector } from "react-redux";
import { current, selectedCountries, type AppDispatch } from "./store/store";
import { selectCountry } from "./store/WorldSlice";
import { selectCountry as currentSelectCountry } from "./store/CurrentSlice";

function App() {
  const currentState = useSelector(current);
  const [inputValue, setInputValue] = useState<string>("");
  // const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const worldChallengeState = useSelector(selectedCountries);

  const dispatch = useDispatch<AppDispatch>();

  // Create a ref for the dialog element
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Effect to open/close the dialog when a country is selected
  useEffect(() => {
    if (currentState.selectedCountry) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [currentState.selectedCountry]);

  const handleCountryClick = (geo: GeoObject) => {
    if (
      worldChallengeState.selectedCountries.some(
        (g) => g.name === geo.properties.name
      ) ||
      isFinished
    ) {
      return;
    }

    dispatch(currentSelectCountry(geo));
  };

  const handleSubmitGuess = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentState.selectedCountry) return;

    const isCorrect =
      inputValue.trim().toLowerCase() ===
      currentState.selectedCountry.properties.name.toLowerCase();

    const newGuess = {
      name: currentState.selectedCountry.properties.name,
      correct: isCorrect,
    };

    //TODO: Put redux logic here
    dispatch(selectCountry(newGuess));

    // setGuesses([...worldChallengeState.selectedCountries, newGuess]);

    setInputValue("");
    dispatch(currentSelectCountry(null)); // This will trigger the useEffect to close the dialog
  };

  const handleFinishGame = () => {
    setIsFinished(true);
  };

  const handleCloseDialog = () => {
    dispatch(currentSelectCountry(null)); // Ensure state is cleared if dialog is closed (e.g., with ESC key)
  };

  const score = worldChallengeState.selectedCountries.filter(
    (g) => g.correct
  ).length;

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="game-title">Guess the Country!</h1>
        {!isFinished && (
          <button onClick={handleFinishGame} className="finish-button">
            Finish Game
          </button>
        )}
      </header>

      <main className="game-content">
        <p>Score: {score}</p>
        <div className="map-container">
          <MapChart
            onCountryClick={handleCountryClick}
            guesses={worldChallengeState.selectedCountries}
            isFinished={isFinished}
          />
        </div>
        {isFinished && (
          <div className="results-overlay">
            <h2>Game Over!</h2>
            <p>
              Your final score is: {score} out of{" "}
              {worldChallengeState.selectedCountries.length}
            </p>
          </div>
        )}
      </main>

      <dialog
        ref={dialogRef}
        onClose={handleCloseDialog}
        className="guess-dialog"
      >
        <form onSubmit={handleSubmitGuess}>
          <h3>Enter the name for the selected country:</h3>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
          <div className="dialog-buttons">
            <button type="button" onClick={handleCloseDialog}>
              Cancel
            </button>
            <button type="submit">Submit Guess</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

export default App;
