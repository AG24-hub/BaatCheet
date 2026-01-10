import React, { useEffect, useState } from 'react'
import { ChatState } from '@/Context/ChatProvider'
import { Box, Text, Flex, IconButton, Spinner, Field, Input, Button} from '@chakra-ui/react'
import { toaster } from './ui/toaster'
import { getSender, getSenderAll } from '@/config/chatlogic'
import ProfileModal from './miscellaneous/profileModel'
import UpdateGroupChatModal from './miscellaneous/updateGroupChatModal'
import axios from 'axios'
import ScrollableChats from './scrollableChats'
import Lottie from 'react-lottie'
import animationData from "../animations/typing.json"

import io from "socket.io-client"
const ENDPOINT = "/";
var socket, SelectedChatCompare

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

const SingleChat = ({fetchAgain, setFetchAgain}) => {
  const {user, selectedChat, setSelectedChat, notification, setNotification} = ChatState()
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState([])

  const [socketConnected, setSocketConnected] = useState(false)

  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const fetchMessages = async()=> {
    if(!selectedChat)  return
    try{
        const config = {
          headers: {
            "content-type" : "application/json",
            Authorization: `Bearer ${user.token}`
          }
        }

        setLoading(true)
        const {data} = await axios.get(
          `/api/message/${selectedChat._id}`, config
        )

        setMessages(data)
        setLoading(false)

        socket.emit("join chat", selectedChat._id)

      }catch(error){
        toaster.create({
          description: "Error occoured",
          type: "error",
          duration: 5000,
          isClosable: "true",
        });
        return;
      }
  }

  useEffect(()=> {
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on("connected", ()=> setSocketConnected(true))
    socket.on("typing", ()=> setIsTyping(true))
    socket.on("stop typing", ()=> setIsTyping(false))
  }, [])

  useEffect(()=> {
    fetchMessages()
    SelectedChatCompare = selectedChat
  }, [selectedChat])

  useEffect(()=> {
    socket.on("message recieved", (newMessageRecieved)=> {
      if(!SelectedChatCompare || SelectedChatCompare._id != newMessageRecieved.chat._id){
        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved, ...notification])
          setFetchAgain(!fetchAgain)
        }
      }else {
        setMessages([...messages, newMessageRecieved])
      }
    })
  }, [messages])

  const sendMessage = async (event)=> {
    if((event.key === "Enter" || event === "click") && newMessage){
      socket.emit("stop typing", selectedChat._id)
      try{
        const config = {
          headers: {
            "content-type" : "application/json",
            Authorization: `Bearer ${user.token}`
          }
        }

        const {data} = await axios.post(
          "/api/message", 
          {
            content: newMessage,
            chatId: selectedChat._id
          },
          config
        )

        socket.emit('new message', data)
        setMessages([...messages, data])
        setNewMessage("")

      }catch(error){
        toaster.create({
          description: "Error occoured",
          type: "error",
          duration: 5000,
          isClosable: "true",
        });
        return;
      }
    }
  }

  const typingHandler = (e)=> {
    setNewMessage(e.target.value)
    //typing indicator logic
    if(!socketConnected) return 
    if(!typing){
      setTyping(true)
      socket.emit("typing", selectedChat._id)
    }
    
    let lastTypingTime = new Date().getTime()
    var timerLength = 3000

    setTimeout(()=> {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime

      if(timeDiff >= timerLength) {
        socket.emit('stop typing', selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
  }

  return (
    <>
    {selectedChat ? (
      <>
      <Flex fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w="100%" fontFamily="Work sans" display="flex" justifyContent={{ base: "space-between" }} alignItems="center">
          <Box display={{ base: "flex", md: "none" }} onClick={()=> setSelectedChat("")}>
            <i className="fa-solid fa-arrow-left"></i>
          </Box>

          {!selectedChat.isGroupChat ? (
            <>
              {getSender(user, selectedChat.users)}
              <IconButton variant="ghost"  size="sm" fontSize="14px" onClick={() => setOpen(true)}>
                <i className="fa-solid fa-eye"></i>
              </IconButton>
              <ProfileModal user={getSenderAll(user, selectedChat.users)} open={open} onOpenChange={(details) => setOpen(details.open)}/>
            </>
          ) : (
            <>
              {selectedChat.chatName.toUpperCase()}
              {<UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />}
            </>
          )}
      </Flex>

      <Box display="flex" flex="1" flexDir="column" justifyContent="flex-end" p={3} bg="rgba(255, 255, 255, 0.6)" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
        {loading? (
          <Spinner color="teal.500" size="xl" w={20} h={20} alignSelf="center" margin="auto"/>
        ):(
          <div style={{display: "flex", flexDirection: "column", overflowY: "scroll", scrollbarWidth: "none"}}>
            <ScrollableChats messages = {messages}/>
          </div>
        )}
        <Field.Root onKeyDown={sendMessage} id="first-name" /*isRequired*/ mt={3}>
          <div style={{
            height: isTyping? ("25px") : ("0px"),
          }}>
          <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }}/>
          </div>
          <Flex w="100%" alignItems="center">
            <Input variant="filled" bg="#F8F9FA" flex="1"  mr={2} placeholder="Enter a message.." value={newMessage} onChange={typingHandler} />
            <Button bg="teal" onClick={() => sendMessage("click")}><i className="fa-solid fa-paper-plane"></i></Button>      
          </Flex>      
        </Field.Root>
      </Box>
      </>
    ) : (
      <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on an user to start conversation
          </Text>
        </Box>
    )}
    </>
  )
}

export default SingleChat
