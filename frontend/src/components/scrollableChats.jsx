import { isDifferentSender, isLastMessage, isSameSenderMargin, isSameUser } from '@/config/chatlogic'
import { Tooltip } from "@/components/ui/tooltip"
import { Avatar } from "@chakra-ui/react"
import React, { useEffect, useRef } from 'react'
import { ChatState } from '@/Context/ChatProvider'

const ScrollableChats = ({messages}) => {
  const {user} = ChatState()
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll every time the messages array changes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={{ height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", padding: "10px"}}>
      {messages && messages.map((m, i) => (
        <div style={{ display: "flex" }} key={m._id || i}>
          {(isDifferentSender(messages, m, i, user?._id) || 
            isLastMessage(messages, i, user?._id)) && (
            <Tooltip label={m.sender?.name} placement="bottom-start">
              <Avatar.Root mt="7px" mr={1} size="sm" cursor="pointer">
                <Avatar.Fallback name={m.sender?.name} />
                <Avatar.Image src={m.sender?.pic} />
              </Avatar.Root>
            </Tooltip>
          )}
          <span
            style={{
              backgroundColor: `${
                m.sender?._id === user?._id ? "#0084FF" : "#0D9488"
              }`,
              marginLeft: isSameSenderMargin(messages, m, i, user?._id),
              marginTop: isSameUser(messages, m, i, user?._id) ? 3 : 10,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
            }}
            >
              {m.content}
          </span>
        </div>
      ))}
      <div ref={messagesEndRef} style={{ height: "1px" }} />
    </div>   
    ) 
}

export default ScrollableChats
