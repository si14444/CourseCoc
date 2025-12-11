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
    <div className="flex justify-center items-center mt-6 mb-4">
      <div className="inline-flex items-center gap-3">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                {/* Animated ring for current step */}
                {currentStep === step.number && (
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[var(--coral-pink)] to-[#ff8787] opacity-30 blur-sm animate-pulse"></div>
                )}

                <div
                  className={`relative flex items-center justify-center w-11 h-11 rounded-full text-sm font-bold transition-all duration-300 ${
                    currentStep === step.number
                      ? "bg-gradient-to-br from-[var(--coral-pink)] to-[#ff8787] text-white shadow-lg scale-110"
                      : currentStep > step.number
                      ? "bg-[var(--coral-pink)] text-white shadow-md"
                      : "bg-white border-2 border-gray-200 text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
              </div>

              <span
                className={`text-xs font-semibold transition-all duration-300 whitespace-nowrap ${
                  currentStep === step.number
                    ? "text-[var(--coral-pink)] scale-105"
                    : currentStep > step.number
                    ? "text-[var(--coral-pink)]"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex items-center mx-3 mb-7">
                <div className="relative w-20 h-0.5">
                  {/* Background line */}
                  <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                  {/* Progress line */}
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-500 ${
                      currentStep > step.number
                        ? "bg-gradient-to-r from-[var(--coral-pink)] to-[#ff8787] scale-x-100"
                        : "scale-x-0"
                    }`}
                    style={{ transformOrigin: "left" }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
