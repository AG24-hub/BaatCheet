import { Box } from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"

// We tell Framer Motion to animate a Chakra Box
const MotionBox = motion.create(Box)

const NotificationBadge = ({ count }) => {
  return (
    <AnimatePresence>
      {count > 0 && (
        <MotionBox
          // Animation Logic (The "Scale" Effect)
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          
          // Styling
          position="absolute"
          top="-5px"
          right="-5px"
          bg="teal.500"
          color="white"
          borderRadius="full"
          minW="20px"
          h="20px"
          cursor="pointer"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="10px"
          fontWeight="bold"
          zIndex={10}
          px={1}
          boxShadow="0 0 5px rgba(0,0,0,0.2)"
        >
          {count > 9 ? "9+" : count}
        </MotionBox>
      )}
    </AnimatePresence>
  )
}

export default NotificationBadge