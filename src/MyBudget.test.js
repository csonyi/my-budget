import { render, screen } from "@testing-library/react";
import MyBudget from "./MyBudget";

test("renders learn react link", () => {
  render(<MyBudget />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
