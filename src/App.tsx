import React, { useEffect, useMemo, useRef, useState } from "react";
import type { GeoObject } from "./types";
import MapChart from "./MapChart";
import { useDispatch, useSelector } from "react-redux";
import { current, selectedCountries, type AppDispatch } from "./store/store";
import { resetWorld, selectCountry } from "./store/WorldSlice";
import {
  selectCountry as currentSelectCountry,
  resetCurrent,
} from "./store/CurrentSlice";

function App() {
  const currentState = useSelector(current);
  const worldChallengeState = useSelector(selectedCountries);
  const dispatch = useDispatch<AppDispatch>();

  const [inputValue, setInputValue] = useState<string>("");
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  // Dialog refs
  const guessDialogRef = useRef<HTMLDialogElement>(null);
  const resultsDialogRef = useRef<HTMLDialogElement>(null);

  // Open/close the guess dialog when a country is selected
  useEffect(() => {
    if (currentState.selectedCountry) {
      guessDialogRef.current?.showModal();
    } else {
      guessDialogRef.current?.close();
    }
  }, [currentState.selectedCountry]);

  // Open results dialog when game is finished
  useEffect(() => {
    if (isFinished) {
      setEndTime(Date.now());
      resultsDialogRef.current?.showModal();
    } else {
      resultsDialogRef.current?.close();
    }
  }, [isFinished]);

  // Keyboard shortcut: toggle info panel with "?"
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "?") setShowInfo((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleCountryClick = (geo: GeoObject) => {
    if (
      worldChallengeState.selectedCountries.some(
        (g) => g.name === geo.properties.name
      ) ||
      isFinished
    )
      return;

    if (!startTime) setStartTime(Date.now());
    dispatch(currentSelectCountry(geo));
  };

  const handleSubmitGuess: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!currentState.selectedCountry) return;

    const isCorrect =
      inputValue.trim().toLowerCase() ===
      currentState.selectedCountry.properties.name.toLowerCase();

    const newGuess = {
      name: currentState.selectedCountry.properties.name,
      correct: isCorrect,
    };

    dispatch(selectCountry(newGuess));
    setInputValue("");
    dispatch(currentSelectCountry(null)); // closes the guess dialog
  };

  const handleFinishGame = () => {
    if (isFinished) return;
    setIsFinished(true);
  };

  const handleCloseGuessDialog = () => {
    dispatch(currentSelectCountry(null));
  };

  const handleRestart = () => {
    // Soft restart UI bits; actual game state reset should be done in Redux if needed
    setIsFinished(false);
    setInputValue("");
    setShowInfo(false);
    setStartTime(null);
    setEndTime(null);
    // Optional: dispatch a Redux action to reset guesses (if you have one)
    dispatch(resetCurrent());
    dispatch(resetWorld());
  };

  const guesses = worldChallengeState.selectedCountries;
  const score = useMemo(
    () => guesses.filter((g) => g.correct).length,
    [guesses]
  );

  const total = guesses.length;
  const durationSec = useMemo(() => {
    if (!startTime || !endTime) return null;
    return Math.max(1, Math.round((endTime - startTime) / 1000));
  }, [startTime, endTime]);

  return (
    <div className="flex h-screen flex-col bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-950 to-black px-4 sm:px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-white/10 ring-1 ring-white/15 shadow-md" />
          <h1 className="font-display text-xl sm:text-2xl tracking-wide text-white/90">
            Guess the <span className="text-fuchsia-400">Country</span>!
          </h1>
        </div>

        {!isFinished ? (
          <button
            onClick={handleFinishGame}
            className="ml-auto inline-flex items-center justify-center rounded-2xl border border-white/15 bg-rose-600/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-900/40 transition active:scale-[0.99] hover:bg-rose-600"
          >
            Finish Game
          </button>
        ) : (
          <button
            onClick={handleRestart}
            className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-900/30 hover:bg-sky-600/90"
          >
            Play Again
          </button>
        )}
      </header>

      {/* Main: full-height map area */}
      <main className="relative flex-1">
        {/* Map fills all remaining space below header */}
        <div className="absolute inset-0">
          <div className="h-full w-full">
            <MapChart
              onCountryClick={handleCountryClick}
              guesses={guesses}
              isFinished={isFinished}
            />
          </div>
        </div>

        {/* Floating Help/Hints button */}
        <button
          onClick={() => setShowInfo((v) => !v)}
          aria-label="Open Help"
          className="group fixed bottom-5 right-5 z-30 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-xl transition hover:scale-105 hover:bg-white/15"
          title="Hints & Controls (?)"
        >
          <span className="text-lg font-semibold group-hover:rotate-12 transition">
            ?
          </span>
        </button>

        {/* Slide-in Info Panel */}
        <aside
          className={`fixed right-0 top-0 z-20 h-full w-[92%] max-w-md transform border-l border-white/10 bg-slate-900/95 backdrop-blur transition-transform duration-300 ${
            showInfo ? "translate-x-0" : "translate-x-full"
          }`}
          aria-hidden={!showInfo}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="font-display text-lg text-white/90">
              Hints & Controls
            </h2>
            <button
              onClick={() => setShowInfo(false)}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
            >
              Close
            </button>
          </div>
          <div className="space-y-5 px-5 py-5 text-sm leading-6 text-slate-300">
            <p>
              Click a country on the map. A prompt appears — type the country
              name and submit.
            </p>
            <ul className="list-disc pl-5">
              <li>
                <kbd className="kbd">?</kbd> toggles this panel
              </li>
              <li>Hover highlights available picks</li>
              <li>Already-guessed areas are dimmed during the round</li>
            </ul>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-2 font-semibold text-white">Tips</h3>
              <ul className="list-disc pl-5">
                <li>
                  Use common English names (e.g., “United States of America”)
                </li>
                <li>Spelling matters</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-600/10 via-sky-500/10 to-emerald-500/10 p-4">
              <h3 className="mb-2 font-semibold text-white">Goal</h3>
              <p>
                Identify as many highlighted countries as possible before you
                hit <em>Finish Game</em>.
              </p>
            </div>

            {startTime && !isFinished && (
              <div className="text-xs text-slate-400">
                Timer running… it stops when you finish.
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* Guess Dialog */}
      <dialog
        ref={guessDialogRef}
        onClose={handleCloseGuessDialog}
        className="modal"
      >
        <form onSubmit={handleSubmitGuess} className="space-y-4">
          <h3 className="font-bold text-lg text-white/90">
            What country is this?
          </h3>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
            placeholder="Type country name"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white placeholder:text-slate-400 focus:border-fuchsia-400/50 outline-none transition"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseGuessDialog}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-900/30 hover:bg-fuchsia-600/90 transition"
            >
              Submit Guess
            </button>
          </div>
        </form>
      </dialog>

      {/* Results Dialog (shown when finished) */}
      <dialog ref={resultsDialogRef} className="modal">
        <div className="space-y-4">
          <h2 className="font-display text-xl text-white">Game Over!</h2>
          <p className="text-slate-300">
            Your final score is{" "}
            <span className="font-semibold text-emerald-400">{score}</span> out
            of <span className="text-white/90">{total}</span>.
          </p>
          {durationSec && (
            <p className="text-slate-400 text-sm">Time taken: {durationSec}s</p>
          )}

          {/* Simple breakdown */}
          <div className="max-h-56 overflow-auto rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
            <ul className="space-y-2">
              {guesses.map((g) => (
                <li
                  key={g.name}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  <span className="truncate">{g.name}</span>
                  <span
                    className={`ml-3 inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                      g.correct
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-rose-500/15 text-rose-300"
                    }`}
                  >
                    {g.correct ? "Correct" : "Wrong"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => resultsDialogRef.current?.close()}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              Close
            </button>
            <button
              onClick={handleRestart}
              className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-900/30 hover:bg-sky-600/90"
            >
              Play Again
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default App;
