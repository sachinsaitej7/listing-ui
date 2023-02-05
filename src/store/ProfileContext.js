import { createContext } from "react";

export const ProfileContext = createContext({
  addNew: false,
  setAddNew: () => {},
  profile: null,
  setProfile: () => {},
});
