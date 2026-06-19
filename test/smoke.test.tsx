import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

test("home renderiza o título", () => {
  render(<Home />);
  expect(screen.getByText("Páginas Low Ticket")).toBeInTheDocument();
});
