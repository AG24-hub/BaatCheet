import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
import { VStack, Field, Input, Button} from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { toaster } from "@/components/ui/toaster"
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async ()=> {
    setLoading(true)
    if(!email|| !password){
      toaster.create({
        description: "Please fill the form",
        type: "warning",
        duration: 5000,
        isClosable: "true",
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {headers: {"Content-type": "application/json"},}
      const {data} = await axios.post("/api/user/login", {email, password}, config)
      toaster.create({
        description: "login successful",
        type: "success",
        duration: 5000,
        isClosable: "true",
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chat");
    }catch(error){
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        type: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false);
      }
    }

  return (
      <VStack spacing='5px' color='black'>
        <Field.Root>
          <Field.Label>Email <span style={{ color: "red" }}>*</span></Field.Label>
          <Input 
              id = "mail"
              value={email}
              placeholder="Enter email address" 
              onChange={(e)=> setEmail(e.target.value)}
              />
          <Field.ErrorText>Invalid mail id</Field.ErrorText>
        </Field.Root>

        <Field.Root>
          <Field.Label>Password <span style={{ color: "red" }}>*</span></Field.Label>
          <PasswordInput id="pswd" value={password} onChange={(e) => setPassword(e.target.value)} />
  
          <Button width="100%" onClick={submitHandler} isLoading={loading}>Login</Button>
          <Button width="100%" >Use as a guest</Button>
  
        </Field.Root>
      </VStack>
    )
}

export default Login
