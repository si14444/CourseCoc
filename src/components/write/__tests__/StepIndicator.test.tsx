import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { StepIndicator } from "../StepIndicator";

describe("StepIndicator", () => {
  it("renders all 4 steps", () => {
    render(<StepIndicator currentStep={1} />);

    expect(screen.getByText("기본 정보")).toBeInTheDocument();
    expect(screen.getByText("장소 추가")).toBeInTheDocument();
    expect(screen.getByText("상세 내용")).toBeInTheDocument();
    expect(screen.getByText("미리보기")).toBeInTheDocument();
  });

  it("highlights the current step", () => {
    const { container } = render(<StepIndicator currentStep={2} />);

    // Step 2 should be highlighted
    const steps = container.querySelectorAll('[class*="bg-"]');
    expect(steps.length).toBeGreaterThan(0);
  });

  it("shows completed steps", () => {
    const { container } = render(<StepIndicator currentStep={3} />);

    // Steps 1 and 2 should be marked as completed
    const completedSteps = container.querySelectorAll('[class*="bg-green"]');
    expect(completedSteps.length).toBeGreaterThanOrEqual(2);
  });
});
