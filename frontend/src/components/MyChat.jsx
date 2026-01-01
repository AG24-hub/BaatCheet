import { ChatState } from '@/Context/ChatProvider'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { TopToaster } from './ui/toaster'
import ChatLoading from '../components/ChatLoading'
import { Box, Button, Text, Stack} from '@chakra-ui/react'
import { getSender } from '@/config/chatlogic';
import GroupChatModal from './miscellaneous/groupChatModal';

const MyChat = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const {user, selectedChat, setSelectedChat, chats, setChats} = ChatState()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
        TopToaster.create({
          description: "Error occoured during fetching the chats",
          type: "error",
          duration: 5000,
          isClosable: "true",
          position: "top-left",
        });
        return;
      }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);


  return (
    <Box display={{ base: selectedChat ? "none" : "flex", md: "flex" }} flexDir="column" alignItems="center" p={3} bg="rgba(255, 255, 255, 0.5)" w={{ base: "100%", md: "31%" }} borderRadius="lg" borderWidth="1px">

      <Box pb={3} px={3} fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans" display="flex" w="100%" justifyContent="space-between" alignItems="center">
        My Chats

        <GroupChatModal>
          <Button display="flex" fontSize={{ base: "17px", md: "10px", lg: "17px" }}>New Group Chat <i className="fa-solid fa-plus"></i></Button>
        </GroupChatModal>
      
      </Box>

      <Box display="flex" flexDir="column"p={3} /*bg="#F8F8F8"*/bg="rgba(255, 255, 255, 0.6)"  w="100%" h="100%" borderRadius="lg" overflowY="hidden">
          {chats? (
            <Stack overflowY="scroll">
              {chats.map((chat)=> (
                <Box onClick={() => setSelectedChat(chat)} cursor="pointer" bg={selectedChat === chat ? "#38B2AC" : "#F8F9FA"} color={selectedChat === chat ? "white" : "black"} px={3} py={2} borderRadius="lg" key={chat._id}>
                  
                  <Text>
                    {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                  </Text>
                </Box>
              ))}
            </Stack>
          ):(<ChatLoading />)}
      </Box>
    </Box>
  )
}

export default MyChat
