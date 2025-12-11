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
    <div className="flex justify-center items-center mt-6">
      <div className="flex items-center gap-1">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all duration-300 ${
                  currentStep === step.number
                    ? "bg-[var(--coral-pink)] text-white scale-110 shadow-md"
                    : currentStep > step.number
                    ? "bg-[var(--coral-pink)] text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {currentStep > step.number ? "✓" : step.number}
              </div>
              <span
                className={`text-[10px] mt-1.5 font-medium transition-colors duration-300 ${
                  currentStep >= step.number
                    ? "text-[var(--coral-pink)]"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 rounded-full transition-colors duration-300 ${
                  currentStep > step.number
                    ? "bg-[var(--coral-pink)]"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
