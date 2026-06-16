'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleRight,
  faArrowRotateRight,
  faArrowsRotate,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';

interface ActionButtonsProps {
  onRandomize: () => void;
  onRestart: () => void;
  onNext: () => void;
  isLoading?: boolean;
  loadingButton?: 'randomize' | 'next' | null;
}

export const ActionButtons = ({
  onRandomize,
  onRestart,
  onNext,
  isLoading = false,
  loadingButton = null,
}: ActionButtonsProps) => {
  const buttons = [
    {
      id: 'randomize',
      icon: faArrowsRotate,
      tooltip: 'Randomize',
      onClick: onRandomize,
      isLoading: isLoading && loadingButton === 'randomize',
    },
    {
      id: 'restart',
      icon: faArrowRotateRight,
      tooltip: 'Restart',
      onClick: onRestart,
      isLoading: false,
    },
    {
      id: 'next',
      icon: faAngleRight,
      tooltip: 'Next Text',
      onClick: onNext,
      isLoading: isLoading && loadingButton === 'next',
    },
  ];

  return (
    <>
      <div className="flex items-center justify-center gap-6 mt-20">
        {buttons.map((button) => (
          <div
            key={button.id}
            data-tooltip-id={`${button.id}-tooltip`}
            data-tooltip-content={button.tooltip}
            data-tooltip-place="top"
          >
            <button
              onClick={button.onClick}
              disabled={button.isLoading}
              className={`
                bg-transparent p-2 rounded-md 
                hover:bg-neutral-500 
                text-neutral-400 text-lg 
                cursor-pointer hover:text-white 
                transition-all
                ${button.isLoading ? 'animate-pulse opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {button.isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={button.icon} />
              )}
            </button>
          </div>
        ))}
      </div>

      {buttons.map((button) => (
        <Tooltip
          key={button.id}
          className="!bg-neutral-700 !text-white !text-xs !px-3 !py-1 !rounded-md"
          id={`${button.id}-tooltip`}
        />
      ))}
    </>
  );
};
