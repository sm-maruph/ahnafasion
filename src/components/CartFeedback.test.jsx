import { fireEvent, render, screen, act } from "@testing-library/react";
import CartFeedback from "./CartFeedback";

const mockNavigate = jest.fn();
const mockDismiss = jest.fn();
let mockConfirmation = null;
let mockCount = 3;
jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate, useLocation: () => ({ pathname: "/product/shirt" }) }), { virtual: true });
jest.mock("../context/CartContext", () => ({ useCart: () => ({ count: mockCount, confirmation: mockConfirmation, dismissConfirmation: mockDismiss }) }));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  mockConfirmation = null;
  mockCount = 3;
  window.PointerEvent = MouseEvent;
  HTMLElement.prototype.setPointerCapture = jest.fn();
  HTMLDialogElement.prototype.showModal = jest.fn();
  HTMLDialogElement.prototype.close = jest.fn();
});

test("dragging moves the bag without navigating, and a subsequent click opens it", () => {
  render(<CartFeedback />);
  const button = screen.getByRole("button", { name: /Open bag, 3 items/ });
  const startX = parseFloat(button.style.left);
  fireEvent.pointerDown(button, { button: 0, clientX: 500, clientY: 300 });
  fireEvent.pointerMove(button, { clientX: 400, clientY: 250 });
  fireEvent.pointerUp(button);
  fireEvent.click(button, { detail: 1 });
  expect(parseFloat(button.style.left)).toBe(startX - 100);
  expect(mockNavigate).not.toHaveBeenCalled();
  fireEvent.pointerDown(button, { button: 0, clientX: 400, clientY: 250 });
  fireEvent.pointerUp(button);
  fireEvent.click(button, { detail: 1 });
  expect(mockNavigate).toHaveBeenCalledWith("/cart");
});

test("keyboard movement stays in bounds and saves the position", () => {
  localStorage.setItem("af-cart-position", JSON.stringify({ x: 12, y: 12 }));
  render(<CartFeedback />);
  const button = screen.getByRole("button", { name: /Open bag/ });
  fireEvent.keyDown(button, { key: "ArrowLeft" });
  expect(button.style.left).toBe("12px");
  fireEvent.keyDown(button, { key: "ArrowRight" });
  expect(JSON.parse(localStorage.getItem("af-cart-position")).x).toBe(32);
});

test("success opens a timed confirmation and restores scrolling on cleanup", () => {
  jest.useFakeTimers();
  mockConfirmation = { id: 1 };
  const { unmount } = render(<CartFeedback />);
  expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  expect(document.body.style.overflow).toBe("hidden");
  act(() => jest.advanceTimersByTime(2400));
  expect(mockDismiss).toHaveBeenCalledTimes(1);
  unmount();
  expect(document.body.style.overflow).toBe("");
  jest.useRealTimers();
});

test("floating cart is hidden when empty and appears when an item is added", () => {
  mockCount = 0;
  const { rerender } = render(<CartFeedback />);
  expect(screen.queryByRole("button", { name: /Open bag/ })).toBeNull();
  mockCount = 1;
  rerender(<CartFeedback />);
  expect(screen.getByRole("button", { name: /Open bag, 1 items/ })).toBeTruthy();
  mockCount = 0;
  rerender(<CartFeedback />);
  expect(screen.queryByRole("button", { name: /Open bag/ })).toBeNull();
});
