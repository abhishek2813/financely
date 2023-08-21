import React, { useEffect } from "react";
import "./style.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Logout suuccessfully");
          navigate("/");
        })
        .catch((e) => {
          toast.error(e.message);
        });
    } catch (error) {
      toast.error("Couldn't log out");
    }
  };
  return (
    <div className="navbar">
      <p className="logo">Finacly</p>
      {user ? (
        <p className="logo link" onClick={handleLogout}>
          Logout
        </p>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default Header;
