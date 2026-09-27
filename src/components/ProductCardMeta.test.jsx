import { render, screen } from "@testing-library/react";
import { ProductCardPrice, ProductCardReviews } from "./ProductCardMeta";

test("shows the actual taka saving beside current and original prices", () => {
  render(<ProductCardPrice product={{ price: 670, oldPrice: 880 }} />);
  expect(screen.getByText("Save ৳210")).toBeInTheDocument();
  expect(screen.getByText("৳880").tagName).toBe("DEL");
  expect(screen.getByText("৳670")).toBeInTheDocument();
});

test.each([undefined, 670, 600])("does not advertise savings with original price %s", (oldPrice) => {
  render(<ProductCardPrice product={{ price: 670, oldPrice }} />);
  expect(screen.queryByText(/Save/)).not.toBeInTheDocument();
});

test("shows review data and an honest empty state", () => {
  const { rerender } = render(<ProductCardReviews product={{ rating: 4.6, reviews: 12 }} />);
  expect(screen.getByText("4.6")).toBeInTheDocument();
  expect(screen.getByText("(12 reviews)")).toBeInTheDocument();
  rerender(<ProductCardReviews product={{ reviews: 0 }} />);
  expect(screen.getByText("No reviews yet")).toBeInTheDocument();
  expect(screen.queryByText("4.6")).not.toBeInTheDocument();
});
