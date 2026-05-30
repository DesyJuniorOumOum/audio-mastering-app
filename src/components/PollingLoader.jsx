import { useState, useEffect } from 'react';
import { useMastering } from '../context/MasteringContext';
import RadarSpinner from './RadarSpinner';
import StepTracker from './StepTracker';

export default function PollingLoader() {
    const { status, taskId, t } = useMastering();
    const [stepIndex, setStepIndex] = useState(0);

    const steps = t('steps', { returnObjects: true });

    useEffect(() => {
        if (status === "uploading") {
            setStepIndex(0);
        } else if (status === "processing") {
            // Commencer à l'étape 1 car l'upload est terminé
            setStepIndex(1);
            
            // Fait défiler les étapes toutes les 4 secondes
            const interval = setInterval(() => {
                setStepIndex((prev) => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    }
                    return prev;
                });
            }, 4000);
            
            return () => clearInterval(interval);
        }
    }, [status, steps]);

    return (
        <div className="loader-container">
            {/* Composant atomique de chargement */}
            <RadarSpinner />

            <div className="loader-title">
                {status === "uploading" ? (
                    <h3>{t('loadingUpload')}</h3>
                ) : (
                    <h3>{t('loadingMastering')}</h3>
                )}
                {taskId && <span className="task-id">{t('taskLabel')}{taskId.substring(0, 18)}...</span>}
            </div>

            {/* Composant atomique de checklist réutilisable */}
            <StepTracker 
                steps={steps} 
                currentStepIndex={status === "uploading" ? 0 : stepIndex} 
            />
        </div>
    );
}