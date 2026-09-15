import { render, act } from "@testing-library/react";
import CheckoutLoader from "./CheckoutLoader";
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }), { virtual: true });
beforeEach(() => {
  jest.useFakeTimers();
  mockNavigate.mockClear();
  HTMLDialogElement.prototype.showModal = jest.fn();
  HTMLDialogElement.prototype.close = jest.fn();
});
afterEach(() => jest.useRealTimers());
test("shows animation then takes the selected product and options to checkout", () => {
  const item = { id: 5, size: "M", color: "Blue", qty: 2 };
  const { unmount } = render(<CheckoutLoader item={item} />);
  expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  expect(mockNavigate).not.toHaveBeenCalled();
  act(() => jest.advanceTimersByTime(1400));
  expect(mockNavigate).toHaveBeenCalledWith("/checkout", { state: { items: [item] } });
  unmount();
  expect(document.body.style.overflow).toBe("");
});
test("cancels pending checkout navigation on unmount", () => {
  const { unmount } = render(<CheckoutLoader item={{ id: 5 }} />);
  unmount();
  act(() => jest.advanceTimersByTime(1400));
  expect(mockNavigate).not.toHaveBeenCalled();
});
