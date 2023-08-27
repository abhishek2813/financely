import React from "react";

import { Button } from "antd";
function ButtonCom({ text, onclick, blue, disable }) {
  return (
    <>
      <Button 
        type={blue?"primary":"text"}
        style={{
          width: "100%",
        }}
        onClick={onclick} disable={disable}
      >
        {text}
      </Button>
    </>
  );
}

export default ButtonCom;
