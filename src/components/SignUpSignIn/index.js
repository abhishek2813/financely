import React, { useState } from "react";
import Input from "../Input";
import ButtonCom from "../Button";
import "./style.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db, provider } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDoc, setDoc,doc } from "firebase/firestore";

function SignUpSignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate()

  const handleSignUp = () => {
    setLoading(true);
    if (name !== "" && email !== "" && password !== "" && cpassword !== "") {
      if (password === cpassword) {
        //add into firebase account
        createUserWithEmailAndPassword(auth, email, password)
          .then((userData) => {
            const user = userData.user;
            console.log("User created", user);
            toast.success("sign up successfully");
            setName("");
            setEmail("");
            setPassword("");
            setCpassword("");
            createDoc(user);
            setLoading(false);
            navigate("/dashboard");
          })
          .catch((error) => {
            toast.error(error.message);
            setLoading(false);
          });
      } else {
        toast.error("password and confirm password do not match");
        setLoading(false);
      }
    } else {
      toast.error("Please enter all information");
      setLoading(false);
    }
  };
  const handleSignIn = () => {
    setLoading(true);
    //validtions
    if (email !== "" && password !== "") {
      //add login function
      signInWithEmailAndPassword(auth, email, password)
        .then((userData) => {
          // const user = userData.user;
          toast.success("Login Success")
          setEmail("")
          setPassword("")
          navigate("/dashboard");
          toast.success("Login Success")
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message);
          setLoading(false);
        });
    } else {
      toast.error("Please enter email and password");
      setLoading(false);
    }
  };
  const handleGoogleAuth= () => {
    setLoading(true);
    signInWithPopup(auth, provider)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;
    setLoading(false)
    createDoc(user)
    navigate('/dashboard')
    toast.success("login success")
  }).catch((error) => {
    // Handle Errors here.
   toast.error(error.message)
   setLoading(false)
  });
  }
  async function createDoc(user) {
    //make sure the user
    const userRef = doc(db,"users",user.uid);
    const userData = await getDoc(userRef)
    // chce the user  if exist
    if(!userData.exists()){
    try {
      await setDoc(doc(db,"users",user.uid),{
        name:user.displayName ?user.displayName :name,
        email:user.email,
        photoURL:user.photoURL ?user.photoURL :"",
        createdAt:new Date()
      });
      toast.success("Doc created successfully")
    } catch (error) {
      toast.error(error.message)
    }
    }else{
      toast.error("doc already exists")
    }
  }
  return (
    <div className="signup-wrapper">
      {isLogin ? (
        <>
          <h2 className="title">
            Login in <span style={{ color: "var(--theme)" }}>Financely</span>
          </h2>
          <form>
            <Input
              type="email"
              label="email"
              placeholder="Email"
              state={email}
              setState={setEmail}
            />
            <Input
              type="password"
              label="password"
              placeholder="example@123"
              state={password}
              setState={setPassword}
            />
            <br />
            <ButtonCom
              text={loading ? "Loading...." : "Login"}
              onclick={handleSignIn} blue={true}
            />
            <p style={{ textAlign: "center", color: "var(--black)" }}>Or</p>
            <ButtonCom
              text={loading ? "Loading...." : "Login using Google"}
              blue={true}
              onclick={handleGoogleAuth}
            />
          </form>
        </>
      ) : (
        <>
          <h2 className="title">
            SignUp On <span style={{ color: "var(--theme)" }}>Financely</span>
          </h2>
          <form>
            <Input
              type="text"
              label="Full Name"
              placeholder="Full name"
              state={name}
              setState={setName}
            />
            <Input
              type="email"
              label="email"
              placeholder="Email"
              state={email}
              setState={setEmail}
            />
            <Input
              type="password"
              label="password"
              placeholder="example@123"
              state={password}
              setState={setPassword}
            />
            <Input
              type="password"
              label="confim password"
              placeholder="example@123"
              state={cpassword}
              setState={setCpassword}
            />
            <br />
            <ButtonCom
              text={loading ? "Loading...." : "Signup using email and password"}
              onclick={handleSignUp} blue={true}
            />
            <p style={{ textAlign: "center", color: "var(--black)" }}>Or</p>
            <ButtonCom
              text={loading ? "Loading...." : "Signup using Google"}
              blue={true}
              onclick={handleGoogleAuth}
            />
          </form>
        </>
      )}
      <p
        onClick={() => setIsLogin(!isLogin)}
        style={{
          textAlign: "center",
          color: "var(--black)",
          cursor: "pointer",
        }}
      >
        {isLogin
          ? "Don't have an account? Create"
          : "Already have an account? Login"}
      </p>
    </div>
  );
}

export default SignUpSignIn;
