export const getSender = (loggedUser, users)=> {
    return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name //on first render we need the ?
}

export const getSenderAll = (loggedUser, users)=> {
    return users[0]?._id === loggedUser?._id ? users[1] : users[0]//on first render we need the ?
}

export const isDifferentSender = (messages, m, i, userId) => {  //all msg, curr msg, curr msg idx, user id
    return (
        i < messages.length-1 && 
        messages[i]?.sender?._id !== userId &&
        (messages[i+1]?.sender?._id !== m.sender?._id ||
        messages[i+1]?.sender?._id === undefined)
    )
}

export const isLastMessage = ((messages, i, userId)=> {
    return (
        i === messages.length-1 &&
        messages[messages.length-1]?.sender?._id && 
        messages[messages.length-1]?.sender?._id !== userId
    )
})

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i-1]?.sender?._id === m.sender?._id;
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i+1]?.sender?._id === m.sender?._id &&
    messages[i]?.sender?._id !== userId
  )     return 42;
  else if (
    (i < messages.length - 1 &&
      messages[i+1]?.sender?._id !== m.sender?._id &&
      messages[i]?.sender?._id !== userId) ||
    (i === messages.length - 1 && messages[i]?.sender?._id !== userId)
  )     return 0;
  else return "auto";
};