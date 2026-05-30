// src/components/StepTracker.jsx
export default function StepTracker({ steps, currentStepIndex }) {
    return (
        <div className="mastering-steps">
            {steps.map((stepText, idx) => {
                let stepStatus = "waiting";
                if (idx < currentStepIndex) stepStatus = "done";
                else if (idx === currentStepIndex) stepStatus = "active";

                return (
                    <div key={idx} className={`step-item ${stepStatus}`}>
                        <span className="step-badge">
                            {stepStatus === "done" && "✓"}
                            {stepStatus === "active" && <span className="step-spinner-dot"></span>}
                            {stepStatus === "waiting" && "•"}
                        </span>
                        <span className="step-text">{stepText}</span>
                    </div>
                );
            })}
        </div>
    );
}
