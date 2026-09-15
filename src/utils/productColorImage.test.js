import { productColorImage } from "./productColorImage";
import { mapCartItem } from "../api/mappers";

const product = { image: "default.jpg", colors: [{ name: "Red" }, { name: "Blue" }], images: ["red.jpg", "blue.jpg"] };
test("matches each selected color to its image in upload order", () => {
  expect(productColorImage(product, "Red")).toBe("red.jpg");
  expect(productColorImage(product, "blue")).toBe("blue.jpg");
});
test("missing color images use the cover safely", () => {
  expect(productColorImage({ ...product, images: ["red.jpg"] }, "Blue")).toBe("default.jpg");
  expect(productColorImage(product, null)).toBe("default.jpg");
});
test("signed-in cart uses ordered gallery rows and retains the selected color", () => {
  const row = { id: 1, color: "Blue", qty: 2, product: { ...product, images: undefined,
    product_images: [{ url: "blue.jpg", position: 1 }, { url: "red.jpg", position: 0 }] } };
  expect(mapCartItem(row)).toMatchObject({ image: "blue.jpg", color: "Blue", qty: 2 });
});
