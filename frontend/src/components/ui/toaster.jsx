'use client'

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
})

export const TopToaster = createToaster({
  placement: 'top-left',
  pauseOnPageIdle: true,
})

//Extracted the UI to a small component so we don't repeat the JSX for every toaster instance 
const ToastTemplate = ({toast}) => (
  <Toast.Root width={{ md: 'sm' }}>
    {toast.type === 'loading' ? (
      <Spinner size='sm' color='blue.solid' />
    ) : (
      <Toast.Indicator />
    )}
    <Stack gap='1' flex='1' maxWidth='100%'>
      {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
      {toast.description && (
        <Toast.Description>{toast.description}</Toast.Description>
      )}
    </Stack>
    {toast.action && (
      <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
    )}
    {toast.closable && <Toast.CloseTrigger />}
  </Toast.Root>
)

export const Toaster = () => {
  return (
    <Portal>
      {/* Listens to the first toaster instance */}
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast) => <ToastTemplate toast={toast} />}
      </ChakraToaster>

      {/* Listens to the top-left toaster instance */}
      <ChakraToaster toaster={TopToaster} insetInline={{ mdDown: '4' }}>
        {(toast) => <ToastTemplate toast={toast} />}
      </ChakraToaster>
    </Portal>
  )
}