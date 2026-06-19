import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

test("Button como link quando há href", () => {
  render(<Button href="https://checkout.x">Comprar agora</Button>);
  const el = screen.getByRole("link", { name: "Comprar agora" });
  expect(el).toHaveAttribute("href", "https://checkout.x");
});

test("Button tem altura mínima de toque (min-h-[44px])", () => {
  render(<Button href="#">CTA</Button>);
  expect(screen.getByRole("link")).toHaveClass("min-h-[44px]");
});
