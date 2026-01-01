import { Button, Dialog, Input, Box, Stack, Portal, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/userBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { TopToaster } from "@/components/ui/toaster";

const GroupChatModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = ChatState();

  const handleGroup = (u) => !selectedUsers.some(s => s._id === u._id) ? setSelectedUsers([...selectedUsers, u]) : TopToaster.create({ title: "User already added", type: "warning" });

  const handleSearch = async (query) => {
    if (!query) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?search=${query}`, { headers: { Authorization: `Bearer ${user.token}` } });
      setSearchResult(data);
      setLoading(false);
    } catch (e) { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) return TopToaster.create({ title: "Fill all fields", type: "warning" });
    try {
      const { data } = await axios.post("/api/chat/group", 
        { name: groupChatName, users: JSON.stringify(selectedUsers.map(u => u._id)) }, 
        { headers: { Authorization: `Bearer ${user.token}` } });
      setChats([data, ...chats]);
      setOpen(false);
    } catch (e) { TopToaster.create({ title: "Error", type: "error" }); }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild><span style={{ cursor: "pointer" }}>{children}</span></Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner p="4">
          <Dialog.Content bg="white" borderRadius="xl" p="6" maxW="md">
            <Dialog.Header><Dialog.Title fontSize="2xl" textAlign="center">Create Group Chat</Dialog.Title></Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body as={Stack} gap="4">
              <Input placeholder="Chat Name" variant="subtle" onChange={e => setGroupChatName(e.target.value)} />
              <Input placeholder="Add Users" variant="subtle" onChange={e => handleSearch(e.target.value)} />
              <Box display="flex" flexWrap="wrap" gap="2">
                {selectedUsers.map(u => <UserBadgeItem key={u._id} user={u} handleFunction={() => setSelectedUsers(selectedUsers.filter(s => s._id !== u._id))} />)}
              </Box>
              {loading ? <Spinner mx="auto" /> : searchResult?.slice(0, 4).map(u => <UserListItem key={u._id} user={u} handleFunction={() => handleGroup(u)} />)}
            </Dialog.Body>
            <Dialog.Footer gap="3">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button colorPalette="blue" onClick={handleSubmit}>Create Chat</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default GroupChatModal;