import React, { useEffect } from "react";
import "./style.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { Layout,Button } from 'antd';
function Header() {
  const [user] = useAuthState(auth);
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
    <Layout className="layout" >
    <Layout.Header style={{ position:"sticky",top:0, zIndex:1,display: 'flex', justifyContent: 'space-between',backgroundColor:"var(--theme)" }}>
    <div className="logo" style={{ color: 'white' }}>Finacly</div>
      <div>
        {user ? <Button className="link" style={{ marginRight: '10px' }} onClick={handleLogout}>Logout</Button> :
        <Button className="link"  style={{ marginRight: '10px' }}><Link to={"/"} >SignIn</Link></Button>
        }
      </div>
    </Layout.Header>
  </Layout>
  );
}

export default Header;
