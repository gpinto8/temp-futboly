import { createContext, useContext, useState, ReactNode } from 'react';

type TabContextType = {
  currentTab: string;
  setCurrentTab: (id: string) => void;
};

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const [currentTab, setCurrentTab] = useState('Competitions'); // default tab

  return (
    <TabContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};

