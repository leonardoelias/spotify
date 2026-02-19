import { fireEvent } from "@testing-library/react";
import { it, expect, describe, vi } from "vitest";

import { render, screen } from "../../../test/test-utils";

import { SearchResults } from "./SearchResults";

interface TestItem {
  id: string;
  name: string;
}

const items: TestItem[] = [
  { id: "1", name: "Item 1" },
  { id: "2", name: "Item 2" },
  { id: "3", name: "Item 3" },
];

const defaultProps = {
  items,
  total: 3,
  page: 1,
  onPageChange: vi.fn(),
  renderItem: (item: TestItem) => <span>{item.name}</span>,
  emptyMessage: "No results",
};

describe("SearchResults", () => {
  it("should render all items", () => {
    render(<SearchResults {...defaultProps} />);

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("should render empty message when items is empty", () => {
    render(<SearchResults {...defaultProps} items={[]} total={0} />);

    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("should return null when isLoading is true", () => {
    const { container } = render(
      <SearchResults {...defaultProps} isLoading={true} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("should not show pagination when total <= pageSize", () => {
    render(<SearchResults {...defaultProps} total={10} pageSize={20} />);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("should show pagination when total > pageSize", () => {
    render(<SearchResults {...defaultProps} total={50} pageSize={20} />);

    expect(screen.getByLabelText("pagination.next")).toBeInTheDocument();
  });

  it("should call onPageChange when pagination is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <SearchResults
        {...defaultProps}
        total={50}
        pageSize={20}
        onPageChange={onPageChange}
      />,
    );

    const nextButton = screen.getByLabelText("pagination.next");
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("should use default pageSize of 20", () => {
    render(<SearchResults {...defaultProps} total={21} />);

    expect(screen.getByLabelText("pagination.next")).toBeInTheDocument();
  });
});
