import { Input } from "postcss";

const ChatTextBox=()=>{
    return(
        <div className="flex justify-around items-center h-[90%] w-[80%]">
            <p className="text-4xl cursor-pointer">O</p>
            <input type="text" className="h-[70%] w-[80%]"/>
            <p className="text-4xl cursor-pointer">{">"}</p>
        </div>
    )
}

export default ChatTextBox;