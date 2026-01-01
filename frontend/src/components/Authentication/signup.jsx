import React, { useState,useRef  } from 'react'
import {useNavigate} from "react-router-dom"
import { VStack, Field, Input, Button, FileUpload} from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { HiUpload } from "react-icons/hi"
import { toaster } from "@/components/ui/toaster"
import axios from 'axios'

const signup = () => {
  const [show, setShow] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmpassword, setConfirmPassword] = useState("")
  const [pic, setPic] = useState()
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const postDetails = (pics)=> {
    setLoading(true)
    if(!pics) {
      toaster.create({
        description: "Please select an image",
        type: "warning",
        duration: 5000,
        isClosable: "true",
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if(pics.type === "image/jpg" || pics.type === "image/png" || pics.type === "image/jpeg") {
      const data = new FormData();
      data.append("file", pics)
      data.append("upload_preset", "Chat-app")
      //data.append("cloud_name", "dbtnadmq5")
      fetch("https://api.cloudinary.com/v1_1/dbtnadmq5/image/upload", {
        method: "POST",
        body: data,
      }).then((res)=> res.json())
      .then((data) => {
          setPic(data.secure_url.toString());
          console.log(data.secure_url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }else {
      toaster.create({
        description: "Please select an image",
        type: "warning",
        duration: 5000,
        isClosable: "true",
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  }

  const submitHandler = async ()=> {
    setLoading(true)
    if(!name || !email|| !password || !confirmpassword){
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
    if(password !== confirmpassword){
      toaster.create({
        description: "password do not match",
        type: "warning",
        duration: 5000,
        isClosable: "true",
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {"Content-type": "application/json",},
      }
      const {data} = await axios.post("/api/user", {name, email, password, pic}, config)
      toaster.create({
        description: "Registration successful",
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
        <Field.Label>Name <span style={{ color: "red" }}>*</span> </Field.Label>
        <Input
            id="first_name"
            value={name}
            placeholder='Enter your Name'
            onChange={(e)=> setName(e.target.value)}
        />

        <Field.Label>Email <span style={{ color: "red" }}>*</span></Field.Label>
        <Input 
            id="email"
            value={email}
            placeholder="Enter email address" 
            onChange={(e)=> setEmail(e.target.value)}
            />
        <Field.ErrorText>Invalid mail id</Field.ErrorText>

        <Field.Label>Password <span style={{ color: "red" }}>*</span></Field.Label>
        <PasswordInput id="pwd" value={password} onChange={(e) => setPassword(e.target.value)} />
        
        <Field.Label>Confirm Password <span style={{ color: "red" }}>*</span></Field.Label>
        <PasswordInput id="cpwd" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        
        <Field.Label>Enter image <span style={{ color: "red" }}>*</span></Field.Label>

        <input
          type="file"
          ref={fileInputRef}
          id="pics"
          accept="image/*"
          style={{ display: "none" }} // hidden
          onChange={(e) => postDetails(e.target.files[0])}
        />

        <Button variant="outline" size="sm" color="black" onClick={() => fileInputRef.current.click()}>
        <HiUpload /> Upload file
        </Button>

        {pic && (
          <img src={pic} alt="Profile Preview" style={{ width: 100, height: 100, borderRadius: "50%" }}/>
        )}


        <Button width="100%" onClick={submitHandler} isLoading={loading}>Submit</Button>

      </Field.Root>
    </VStack>
  )
}

export default signup
