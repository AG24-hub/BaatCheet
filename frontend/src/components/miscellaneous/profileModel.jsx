import { Dialog, Portal, Button, Text, Image } from "@chakra-ui/react";

const ProfileModal = ({ user, open, onOpenChange }) => {
  if (!user) return null;

  return (
    // We use the 'open' prop to control visibility manually
    <Dialog.Root open={open} onOpenChange={onOpenChange} size="lg" placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner zIndex="modal">
          <Dialog.Content h="410px">
            <Dialog.Header>
              <Dialog.Title fontSize="40px" textAlign="center" justifyContent="center" fontFamily="Work Sans">
                {user.name}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body display="flex" flexDir="column" alignItems="center" justifyContent="center" gap={6}>
              <Image borderRadius="full" boxSize="150px" src={user.pic} alt={user.name} />
              <Text fontSize="30px" fontFamily="Work Sans">Email: {user.email}</Text>
            </Dialog.Body>
            <Dialog.Footer justifyContent="center">
              <Button onClick={() => onOpenChange({ open: false })}>Close</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ProfileModal;