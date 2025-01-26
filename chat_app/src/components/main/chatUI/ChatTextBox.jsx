import { Input } from "postcss";

const ChatTextBox=()=>{
    return(
        <div className="flex items-center border-2 border-black h-[90%] w-[80%]">
            <p className="text-4xl">O</p>
            <input type="text" className="h-[70%] w-[80%]"/>
        </div>
    )
}

export default ChatTextBox;