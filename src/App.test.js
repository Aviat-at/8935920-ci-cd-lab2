// src/App.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("App Component (Real API)", () => {
  test("fetches and displays news articles from NewsAPI", async () => {
    // 1) Render the actual App, which triggers the live fetch
    render(<App />);

    // 2) Confirm the MUI CircularProgress spinner appears initially
    const spinner = screen.getByRole("progressbar");
    expect(spinner).toBeInTheDocument();

    // 3) Wait until fetch completes and the spinner disappears
    await waitFor(() => {
      const noSpinner = screen.queryByRole("progressbar");
      expect(noSpinner).toBeNull();
    });

    // 4) Check for the "Read More" text which appears in each article card
    const readMoreLinks = screen.queryAllByText(/read more/i);
    expect(readMoreLinks.length).toBeGreaterThan(0);
  });       
});
