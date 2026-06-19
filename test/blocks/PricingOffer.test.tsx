import { render, screen } from "@testing-library/react";
import { PricingOffer } from "@/components/blocks/PricingOffer";

test("mostra preço ancorado e CTA", () => {
  render(<PricingOffer fromPrice="R$57,00" price="R$19,90" ctaLabel="Quero agora" ctaHref="#c" />);
  expect(screen.getByText("R$57,00")).toBeInTheDocument();
  expect(screen.getByText("R$19,90")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Quero agora" })).toHaveAttribute("href", "#c");
});
