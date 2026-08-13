import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

test("renders the home page with brand name", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  expect(screen.getAllByText(/BookStore/i).length).toBeGreaterThan(0);
});
