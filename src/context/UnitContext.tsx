import React, { createContext, useContext, useState } from 'react';

type Unit = 'metric' | 'imperial';

type UnitContextType = {
  unit: Unit;
  toggleUnit: () => void;
};

const UnitContext = createContext<UnitContextType>({
  unit: 'metric',
  toggleUnit: () => {},
});

export const useUnit = () => useContext(UnitContext);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unit, setUnit] = useState<Unit>('metric');

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <UnitContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </UnitContext.Provider>
  );
};
