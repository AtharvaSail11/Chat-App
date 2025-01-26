import ChatTextBox from "./ChatTextBox"
const ChatUI=()=>{
    let array=["","","","","",""];
    let chatMessages=[{type:"Sender",Text:"Hi brother"},{type:"Reciever",Text:"Hello"}];
    return(
        <div className="flex h-screen w-screen">
            {/* Chats Display */}
            <div className="flex flex-col h-full w-[35%]">
                {/* Header */}
                <div className="flex h-[10%] w-full justify-between p-2 items-center bg-blue-400">
                   <p className="text-3xl">Chats</p>
                   <div className="flex h-10 w-10 rounded-full border-2 border-black">

                   </div>
                </div>
                {/* Display the chats here */}
                <div className="flex flex-col h-[90%] w-full bg-slate-300">
                {/* Chats */}
                {array.map((item,index)=>{
                    return(<div className="flex w-full h-16 border-b items-center p-2 border-gray-700 cursor-pointer hover:bg-slate-400" key={index}>
                        <div className="flex h-14 w-14 rounded-full border-2 border-black"></div>
                        <p className="text-xl ml-8">User Name</p>
                    </div>)
                })}
                

                </div>
            </div>
            {/* Chatting section */}
            <div className="flex flex-col h-full w-[65%]">
                {/* Header */}
                <div className="flex items-center h-[8%] w-full bg-blue-400">
                    <div className="flex h-10 w-10 rounded-full border-2 border-black"></div>
                    <p className="text-xl ml-8">User Name</p>
                </div>
                <div className="flex flex-col w-full h-[92%] border-b p-2 bg-blue-100">
                   
                   <div className="flex flex-col h-[90%] w-full">
                    
                    {chatMessages.map((message,index)=>{
                        return(
                        <>
                            {message.type==="Sender"?
                            <div className="flex h-[60px] w-full">
                                <div className="flex h-max w-[40%] rounded-lg bg-slate-300 p-2"><p>{message.Text}</p></div>
                            </div>
                        :<div className="flex justify-end h-[60px] w-full">
                        <div className="flex h-max w-[40%] rounded-lg bg-blue-400 p-2"><p>{message.Text}</p></div>
                            </div>}
                        </>
                        )
                    })}
                        
                   </div>
                   <div className="flex items-center h-[10%] w-full bg-blue-200">
                        <p className="text-4xl cursor-pointer">+</p> 
                        <ChatTextBox/>
                   </div>
                </div>
            </div>
        </div>
    )
}

export default ChatUI;