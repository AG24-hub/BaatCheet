import { Container, Box, Text, Tabs } from "@chakra-ui/react"
import Login from "../components/Authentication/login"
import Signup from "../components/Authentication/signup"
import { useNavigate } from "react-router-dom"
import {useEffect, useState} from "react"

const HomePage = () => {
  const [user, setUser] = useState("")
  const navigate = useNavigate()
  useEffect(()=> {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    setUser(userInfo)
          
    if(userInfo){
      navigate("/chat")
    }
  }, [navigate])

  return (
    <Container maxW='xl' centerContent>
      <Box display='flex' justifyContent = 'center' alignItems="center" p={2} bg="rgba(255, 255, 255, 0.5)" w="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px">
        <Text fontSize={'3xl'} color={'black'}>BaatCheet</Text>
      </Box>
      <Box bg="rgba(255, 255, 255, 0.5)" color={"black"} w="100%" p={4} borderRadius={"lg"} borderWidth={"1px"}>
      <Tabs.Root
        defaultValue="login"
        variant="plain"
        css={{
          "--tabs-indicator-bg": "rgba(195, 234, 241, 0.8)",
          "--tabs-indicator-shadow": "shadows.xs",
          "--tabs-trigger-radius": "radii.full",
        }}
      >
        <Tabs.List style={{ display: "flex" }}>
          <Tabs.Trigger value="login" style={{width:"50%", color: "black"}}>Login</Tabs.Trigger>
          <Tabs.Trigger value="signup" style={{width:"50%", color: "black"}}>Signup</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="login"><Login/></Tabs.Content>
        <Tabs.Content value="signup"><Signup/></Tabs.Content>
      </Tabs.Root>
      </Box>
    </Container>
  )
}

export default HomePage
