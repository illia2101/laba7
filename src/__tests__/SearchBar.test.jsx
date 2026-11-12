import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchBar from "../components/SearchBar";
import { SORT_OPTIONS } from "../utils/catalog";

describe("SearchBar debounce", () => {
  let onQueryChange;

  beforeEach(() => {
    vi.useFakeTimers();
    onQueryChange = vi.fn();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("викликає пошук лише після затримки 300 мс", () => {
    render(
      <SearchBar
        query=""
        onQueryChange={onQueryChange}
        sortBy={SORT_OPTIONS[0].value}
        onSortChange={vi.fn()}
        count={10}
      />,
    );

    const input = screen.getByRole("searchbox");

    fireEvent.change(input, {
      target: { value: "математика" },
    });

    expect(onQueryChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(onQueryChange).not.toHaveBeenCalled();

    // Минає остання 1 мс
    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(onQueryChange).toHaveBeenCalledTimes(1);
    expect(onQueryChange).toHaveBeenCalledWith("математика");
  });

  it("скасовує попередній пошук при новому введенні", () => {
    render(
      <SearchBar
        query=""
        onQueryChange={onQueryChange}
        sortBy={SORT_OPTIONS[0].value}
        onSortChange={vi.fn()}
        count={10}
      />,
    );

    const input = screen.getByRole("searchbox");

    fireEvent.change(input, {
      target: { value: "мат" },
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    fireEvent.change(input, {
      target: { value: "математика" },
    });

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(onQueryChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(onQueryChange).toHaveBeenCalledTimes(1);
    expect(onQueryChange).toHaveBeenCalledWith("математика");
  });
});
