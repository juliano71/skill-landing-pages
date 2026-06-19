import { render, screen } from "@testing-library/react";
import { Reveal } from "@/components/motion/Reveal";

test("Reveal renderiza os filhos", () => {
  render(<Reveal><p>conteúdo revelado</p></Reveal>);
  expect(screen.getByText("conteúdo revelado")).toBeInTheDocument();
});
