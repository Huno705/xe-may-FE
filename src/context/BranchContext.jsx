import { createContext, useContext, useState } from "react";

const BranchContext = createContext({
  selectedBranch: null,
  setSelectedBranch: () => {},
});

export function BranchProvider({ children }) {
  const [selectedBranch, setSelectedBranch] = useState(null);
  return (
    <BranchContext.Provider value={{ selectedBranch, setSelectedBranch }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranchFilter() {
  return useContext(BranchContext);
}