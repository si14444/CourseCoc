interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "기본정보" },
  { number: 2, label: "장소추가" },
  { number: 3, label: "내용작성" },
  { number: 4, label: "미리보기" },
];

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-center items-center mt-10 space-x-4">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full text-sm font-semibold transition-all duration-300 ${
                currentStep >= step.number
                  ? "bg-[var(--coral-pink)] text-white shadow-[0_4px_12px_var(--pink-shadow)]"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.number}
            </div>
            <span
              className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                currentStep >= step.number
                  ? "text-[var(--coral-pink)]"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 rounded-full transition-colors duration-300 ${
                currentStep >= step.number + 1
                  ? "bg-[var(--coral-pink)]"
                  : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
