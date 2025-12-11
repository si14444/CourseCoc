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
    <div className="flex justify-center items-center mt-8 mb-2">
      <div className="inline-flex items-center gap-0 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-100">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                {/* Glow effect for current step */}
                {currentStep === step.number && (
                  <div className="absolute inset-0 rounded-full bg-[var(--coral-pink)] blur-md opacity-40 animate-pulse"></div>
                )}

                <div
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-500 ${
                    currentStep === step.number
                      ? "bg-gradient-to-br from-[var(--coral-pink)] to-[#ff8787] text-white scale-110 shadow-[0_4px_20px_rgba(255,107,107,0.4)]"
                      : currentStep > step.number
                      ? "bg-gradient-to-br from-[var(--coral-pink)] to-[#ff8787] text-white shadow-sm"
                      : "bg-gray-100 text-gray-400"
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
                className={`text-[11px] mt-2 font-semibold transition-all duration-300 whitespace-nowrap ${
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
              <div className="mx-4 mb-6">
                <div
                  className={`w-16 h-1 rounded-full transition-all duration-500 ${
                    currentStep > step.number
                      ? "bg-gradient-to-r from-[var(--coral-pink)] to-[#ff8787]"
                      : "bg-gray-200"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
