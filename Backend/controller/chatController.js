const expressAsyncHandler = require("express-async-handler");
const Chat = require("../Model/chatModel");
const User = require("../Model/userModel");

const accessChat = expressAsyncHandler(async (req, res)=> {
    const {userId} = req.body
    if(!userId){
        console.log("UserId params not sent with the request")
        return res.status(400)
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq:req.user._id}}},
            {users: {$elemMatch: {$eq:userId}}}
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    })

    if(isChat.length > 0) {
        res.send(isChat[0])
    }else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }

        try{
            const createdChat = Chat.create(chatData)
            const fullChat = await Chat.findOne({_id: createdChat,_id}).populate("users", "-password")
            res.status(200).send(fullChat)
        }catch(error) {
            return res.status(400)
            throw new Error(error.message)
        }
    }
})

const fetchChats = expressAsyncHandler(async (req, res)=> {
    try{
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
        .populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage")
        .sort({updateAt: -1}).then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email"
            })

            res.status(200).send(results)
        })
    }catch(error){
        return res.status(400)
        throw new Error(error.message)
    }
})

//it needs only users array and group name
const createGroupChat = expressAsyncHandler(async (req, res)=> {
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message: "Please fill all the field"})
    }

    var users = JSON.parse(req.body.users)
    if(users.length < 2){
        return res.status(400).send({message: "More than 2 users requires to create a group"})
    }

    users.push(req.user) // pushes current user to the group along with selected

    let groupChat
    try{
        groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user,
        })
    }catch(error){
        return res.status(400)
        throw new Error(error.message)
    }

    const fullGroupChat = await Chat.findOne({_id: groupChat._id}).populate("users", "-password").populate("groupAdmin", "-password")
    res.status(200).json(fullGroupChat)
})

const renameGroup = expressAsyncHandler( async(req, res)=> {
    const {chatId, chatName} = req.body
    const updatedChat = await Chat.findByIdAndUpdate(chatId, {chatName}, {new:true}).populate("users", "-password").populate("groupAdmin", "-password")

    if(!updatedChat){
        return res.status(400)
        throw new Error("chat not found")
    }else {
        res.json(updatedChat)
    }
})

const addToGroup = expressAsyncHandler(async(req, res)=> {
    const {chatId, userId} = req.body
    const added = await Chat.findByIdAndUpdate(chatId, {$push: {users: userId}}, {new: true}).populate("users", "-password").populate("groupAdmin", "-password")

    if(!added){
        return res.status(400)
        throw new Error("chat not found")
    }else {
        res.json(added)
    }
})

const removeFromGroup = expressAsyncHandler(async(req, res)=> {
    const {chatId, userId} = req.body
    const removed = await Chat.findByIdAndUpdate(chatId, {$pull: {users: userId}}, {new:true}).populate("users", "-password").populate("groupAdmin", "-password")

    if(!removed){
        return res.status(400)
        throw new Error("chat not found")
    }else {
        res.json(removed)
    }
})

module.exports = {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup};