import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ColorVariantsEditor from "./ColorVariantsEditor";
import { toColorVariants, normalizeHex, colorError } from "./productColors";

test("existing custom hex codes survive edit normalization", () => {
  expect(toColorVariants([{ name: "Navy", hex: "#123456" }])).toEqual([{ name: "Navy", hex: "#123456" }]);
  expect(toColorVariants(["Red"])[0].hex).toBeTruthy();
  expect(normalizeHex("abc")).toBe("#AABBCC");
  expect(colorError([{ name: "Red", hex: "invalid" }])).toMatch(/valid hex/);
  expect(colorError([{ name: "Red", hex: "#f00" }, { name: " red ", hex: "#fff" }])).toMatch(/unique/);
});

test("suggestions add variants and hex and picker edits stay synchronized", () => {
  function Harness() { const [colors, setColors] = useState([]); return <ColorVariantsEditor value={colors} onChange={setColors} />; }
  render(<Harness />);
  fireEvent.click(screen.getByRole("button", { name: /navy/i }));
  expect(screen.getByLabelText("Color 1 name").value).toBe("Navy");
  fireEvent.change(screen.getByLabelText("Color 1 hex code"), { target: { value: "#123456" } });
  expect(screen.getByLabelText("Color 1 picker").value).toBe("#123456");
  fireEvent.change(screen.getByLabelText("Color 1 picker"), { target: { value: "#abcdef" } });
  expect(screen.getByLabelText("Color 1 hex code").value).toBe("#ABCDEF");
  fireEvent.click(screen.getByLabelText("Remove color 1"));
  expect(screen.queryByLabelText("Color 1 name")).toBeNull();
});
