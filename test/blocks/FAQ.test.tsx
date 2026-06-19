import { render, screen } from "@testing-library/react";
import { FAQ } from "@/components/blocks/FAQ";

test("renderiza perguntas como elementos de detalhe", () => {
  render(<FAQ items={[{ q: "Tem garantia?", a: "Sim, 7 dias." }]} />);
  expect(screen.getByText("Tem garantia?")).toBeInTheDocument();
  expect(screen.getByText("Sim, 7 dias.")).toBeInTheDocument();
});
