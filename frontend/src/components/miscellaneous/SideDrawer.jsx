import { Box, Button, Text, Menu ,Portal, Avatar, Drawer, Input, Spinner, Stack} from '@chakra-ui/react'
import React, { useState } from 'react'
import { Tooltip } from "@/components/ui/tooltip"
import { ChatState } from '@/Context/ChatProvider'
import ProfileModal from './profileModel'
import { useNavigate } from 'react-router-dom'
import { TopToaster } from "@/components/ui/toaster"
import ChatLoading from '../ChatLoading'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'
import { getSender } from '@/config/chatlogic'
import NotificationBadge from './notificationBadge'

const SideDrawer = () => {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isOpen = () => setIsSearchOpen(true);
  const onClose = () => setIsSearchOpen(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const {user, setSelectedChat, chats, setChats, notification, setNotification} = ChatState()
  const Navigate = useNavigate()

  const logoutHandler = ()=> {
    localStorage.removeItem("userInfo")
    Navigate("/")
  }

  const handleSearch = async()=>{
    if(!search){
      TopToaster.create({
        description: "Please enter name or email",
        type: "error",
        duration: 5000,
        isClosable: "true",
        position: "top-left",
      });
      return;
    }

    try{
      setLoading(true)

      const config = {
        headers: {Authorization: `Bearer ${user.token}`},
      };
      const {data} = await axios.get(`api/user?search=${search}`,config )
      setLoading(false)
      setSearchResult(data)
    }catch(error){
      TopToaster.create({
        description: "Error occoured",
        type: "error",
        duration: 5000,
        isClosable: "true",
        position: "top-left",
      });
      console.log(error)
      return;
    }
  }

  const accessChat = async(userId)=> {
    try{
      setLoadingChat(true)
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        } 
      }
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if(!chats.find((c)=> c._id === data._id))  setChats([data, ...chats])

      setSelectedChat(data);
      setLoadingChat(false);
      onClose()
    }catch(error){
      TopToaster.create({
        description: "Error occoured during fetching the chats",
        type: "error",
        duration: 5000,
        isClosable: "true",
        position: "top-left",
      });
        console.log(error)

      return;
    }
  }

  return (
    <>
    <Box display="flex" justifyContent="space-between" alignItems="center" bg="rgba(255, 255, 255, 0.5)" w="100%" p="5px 10px 5px 10px" >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={isOpen}>
                <i className="fa-solid fa-magnifying-glass"></i>
                <Text display={{ base: "none", md: "flex" }} px={4}>Search User</Text>
            </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">BaatCheet</Text>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/*Notification */}
            <Menu.Root>
            <Menu.Trigger asChild>
              <Box position="relative" display="inline-block">
                <NotificationBadge count={notification.length} />
                <i className="fa-solid fa-bell"></i>
              </Box>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
              <Menu.Content pl={2}>
                {!notification.length && <Box>No New Messages</Box>}
                {notification.map(notif=> (
                  <Menu.Item key={notif._id} value={notif._id} onClick={()=> {
                    setSelectedChat(notif.chat)
                    setNotification(notification.filter((n)=> n!== notif))
                  }}>
                    {notif.chat.isGroupChat? `New message in ${notif.chat.chatName}`: `New message from ${getSender(user, notif.chat.users)}`}
                  </Menu.Item>
                ))}
              </Menu.Content>
              </Menu.Positioner>
            </Portal>
            </Menu.Root>
            
            {/*Avatar */}
            <Menu.Root positioning={{ placement: "bottom-end" }}>
            <Menu.Trigger rounded="full">
                <Avatar.Root size="sm" cursor="pointer">
                <Avatar.Image src={user.pic} />
                </Avatar.Root>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner zIndex="popover">
                <Menu.Content>
                    {/* 1. The Menu Item just changes the state */}
                    <Menu.Item 
                    value="profile" 
                    onSelect={() => setIsProfileOpen(true)}
                    >
                    <i className="fa-solid fa-user" style={{ marginRight: "10px" }}></i>
                    My Profile
                    </Menu.Item>

                    <Menu.Item value="logout" onClick={logoutHandler}>
                        <i className="fa-solid fa-right-from-bracket" style={{ marginRight: "10px" }}></i>
                        Logout
                    </Menu.Item>
                </Menu.Content>
                </Menu.Positioner>
            </Portal>
            </Menu.Root>

            {/* 2. Place the Modal OUTSIDE the Menu.Root entirely */}
            <ProfileModal user={user} open={isProfileOpen} onOpenChange={(e) => setIsProfileOpen(e.open)} />
        </div>
    </Box>

    <Drawer.Root  
      open={isSearchOpen} // Pass the boolean variable here, NOT the function
      onOpenChange={(e) => setIsSearchOpen(e.open)} 
      placement="left" >
      <Drawer.Backdrop animation="fade-in 300ms ease-out"/>
      <Drawer.Content h="100dvh">
        <Drawer.Header borderBottomWidth="1px">Search Users</Drawer.Header>
        
        <Drawer.Body>
          {/* Input and Button area */}
          <Box display="flex" pb={4} gap={2}>
            <Input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)}/>
            <Button onClick={handleSearch}>Search</Button>
          </Box>
          <Stack gap={2}>
            {loading ? (
              <ChatLoading /> // Ensure ChatLoading is updated to v3
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
          </Stack>

          {/* Loading Spinner for Chat Access */}
          {loadingChat && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Spinner color="blue.500" borderWidth="4px" size="lg"/>
            </Box>
          )}
        </Drawer.Body>
        
        <Drawer.CloseTrigger />
      </Drawer.Content>
    </Drawer.Root>
    </>
  )
}

export default SideDrawer
