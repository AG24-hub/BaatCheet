import { Box, Text, Avatar} from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({user, handleFunction}) => {
  //const {user} = ChatState(), did not used context apip here because it will show the current logged in user only
  return (
    <Box onClick={handleFunction} cursor="pointer" bg="#E8E8E8" _hover={{background: "#38B2AC", color: "white",}} w="100%" display="flex" alignItems="center" color="black" px={3} py={2} mb={2} borderRadius="lg">
      <Avatar.Root size="sm" mr={2}>
        <Avatar.Image src={user?.pic} />
        <Avatar.Fallback name={user?.name} />
      </Avatar.Root>
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  )
}

export default UserListItem
