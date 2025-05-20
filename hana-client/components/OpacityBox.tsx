// components/OpacityBox.tsx
import { FC } from 'react';

interface OpacityBoxProps {
  children: React.ReactNode;
}

const OpacityBox: FC<OpacityBoxProps> = ({ children }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow p-4 opacity-90">
      {children}
    </div>
  );
};

export default OpacityBox;
