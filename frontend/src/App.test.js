import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      text: () => Promise.resolve("[]"),
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders smart task manager heading", async () => {
  render(<App />);
  const headingElement = await screen.findByText(/smart task manager/i);
  expect(headingElement).toBeInTheDocument();
});
