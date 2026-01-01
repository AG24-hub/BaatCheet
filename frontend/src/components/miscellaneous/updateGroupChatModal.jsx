import { useState } from "react";
import { Button, Dialog, Flex, IconButton, Input, Portal, Spinner, Stack} from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { toaster } from "@/components/ui/toaster";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
const [open, setOpen] = useState(false);
const [groupChatName, setGroupChatName] = useState("");
const [search, setSearch] = useState("");
const [searchResult, setSearchResult] = useState([]);
const [loading, setLoading] = useState(false);
const [renameloading, setRenameLoading] = useState(false);

const { selectedChat, setSelectedChat, user } = ChatState();

const handleSearch = async(query)=> {
    setSearch(query)
    if(!query) return;

    try{
        setLoading(true)
        const config = {headers: {Authorization : `Bearer ${user.token}`}}
        const {data} = await axios.get(`/api/user?search=${search}`, config)
        setLoading(false)
        setSearchResult(data)
    }catch(error){
        toaster.create({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        type: "error",
      });
      setLoading(false);
    }
}

const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {headers: { Authorization: `Bearer ${user.token}` }};
      const { data } = await axios.put(`/api/chat/rename`,{ chatId: selectedChat._id, chatName: groupChatName },config);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Rename failed",
        type: "error",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
};

const handleAddUser = async(user1)=> {
    if(selectedChat.users.find((u)=> u._id === user1._id)){
      toaster.create({ 
        title: "User Already in group!", 
        type: "error"
    });
    return;
    }

    if(selectedChat.groupAdmin._id !== user1._id){
      toaster.create({ 
        title: "Only admin can add someone!", 
        type: "error"
    });
    return;
    }

    try {
        setLoading(true)
        const config = {headers: {Authorization : `Bearer ${user.token}`}}
        const data = await axios.put(`/api/chat/groupadd`, {chatId: selectedChat._id, userId: user1._id}, config)
        setSelectedChat(data)
        setFetchAgain(!fetchAgain);
        setLoading(false)
    }catch(error){
        toaster.create({
        title: "Error Occurred!",
        description: error.response?.data?.message,
        type: "error",
      });
      setLoading(false);
    }
}

const handleRemove = async(user1)=> {
    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
      toaster.create({ title: "Only admins can remove someone!", type: "error" });
      return;
    }
    try{
        setLoading(true)
        const config = {headers: {Authorization: `Bearer ${user.token}`}}
        const {data} = await axios.put(`/api/chat/groupremove`, {chatId: selectedChat._id, userId: user1._id}, config)
        user._id === user1._id ? setSelectedChat() : setSelectedChat(data)
        setFetchAgain(!fetchAgain);
        fetchMessages()
        setLoading(false)
    }catch(error){
        toaster.create({
        title: "Error Occurred!",
        description: error.response?.data?.message,
        type: "error",
      });
      console.log(error)
      setLoading(false);
    }
}

  return (
    <>
      <IconButton display={{ base: "flex" }} variant="ghost" onClick={() => setOpen(true)}>
        <i className="fa-solid fa-eye"></i>
      </IconButton>

      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)} placement="center">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title fontSize="35px" fontFamily="Work sans" textAlign="center">
                  {selectedChat.chatName}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.CloseTrigger />

              <Dialog.Body>
                <Flex w="100%" flexWrap="wrap" pb={3}>
                  {selectedChat.users.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      admin={selectedChat.groupAdmin}
                      handleFunction={() => handleRemove(u)}
                    />
                  ))}
                </Flex>

                <Stack gap={4}>
                  <Flex gap={2}>
                    <Input placeholder="Chat Name" value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)}/>
                    <Button colorPalette="teal" isLoading={renameloading} onClick={handleRename}>
                      Update
                    </Button>
                  </Flex>

                  <Input placeholder="Add User to group" onChange={(e) => handleSearch(e.target.value)}/>
                  {loading ? (
                    <Spinner size="lg" alignSelf="center" />
                  ) : (
                    searchResult?.filter((u) => !selectedChat.users.find((member) => member._id === u._id)).map((u) => (
                      <UserListItem
                        key={u._id}
                        user={u}
                        handleFunction={() => handleAddUser(u)}
                      />
                    ))
                  )}
                </Stack>
              </Dialog.Body>

              <Dialog.Footer>
                <Button onClick={() => handleRemove(user)} colorPalette="red">
                  Leave Group
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default UpdateGroupChatModal;