import React from 'react'
import Header from "../Header";
import SignUpSignIn from "../SignUpSignIn";
function SignIn() {
  return (
    <div>
        <Header />
        <div className="wrapper">
          <SignUpSignIn />
        </div>
    </div>
  )
}

export default SignIn