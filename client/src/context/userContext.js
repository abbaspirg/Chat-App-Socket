import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      axios.get("/profile").then((response) => {
        setUser(response.data); // Assuming the user data is in response.data
        if(response.data){
          navigate('/chat')
        }else{
          navigate('/login')
        }
      });
    }
  }, [user]); // Adding a dependency array to useEffect to avoid unnecessary calls

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
