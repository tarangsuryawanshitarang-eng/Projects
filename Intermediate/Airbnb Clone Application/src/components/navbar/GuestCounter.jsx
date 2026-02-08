import { MdAdd, MdRemove } from 'react-icons/md';
import { useFilterStore } from '../../store/useFilterStore';

const GuestCounter = () => {
  const { 
    guests, 
    incrementAdults, 
    decrementAdults, 
    incrementChildren, 
    decrementChildren 
  } = useFilterStore();

  const CounterRow = ({ label, description, value, onIncrement, onDecrement, min = 0, max = 16 }) => (
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="font-medium text-text-primary">{label}</p>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDecrement}
          disabled={value <= min}
          className={`
            w-8 h-8 flex items-center justify-center
            rounded-full border border-border
            transition-colors
            ${value <= min 
              ? 'opacity-30 cursor-not-allowed' 
              : 'hover:border-text-primary'
            }
          `}
        >
          <MdRemove className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-medium">{value}</span>
        <button
          onClick={onIncrement}
          disabled={value >= max}
          className={`
            w-8 h-8 flex items-center justify-center
            rounded-full border border-border
            transition-colors
            ${value >= max 
              ? 'opacity-30 cursor-not-allowed' 
              : 'hover:border-text-primary'
            }
          `}
        >
          <MdAdd className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <CounterRow
        label="Adults"
        description="Ages 13 or above"
        value={guests.adults}
        onIncrement={incrementAdults}
        onDecrement={decrementAdults}
        min={1}
        max={16}
      />
      <div className="border-t border-border" />
      <CounterRow
        label="Children"
        description="Ages 2–12"
        value={guests.children}
        onIncrement={incrementChildren}
        onDecrement={decrementChildren}
        min={0}
        max={8}
      />
    </div>
  );
};

export default GuestCounter;
