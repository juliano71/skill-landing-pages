import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Reveal } from "@/components/motion/Reveal";

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, useReducedMotion: () => true };
});

test("Reveal renderiza os filhos quando reduced-motion está ativo", () => {
  render(<Reveal><p>texto a11y</p></Reveal>);
  expect(screen.getByText("texto a11y")).toBeInTheDocument();
});
