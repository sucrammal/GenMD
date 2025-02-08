
import { useEffect } from 'react'; 

const Chat = ({ setGeneImg }: { setGeneImg: (img: string) => void }) => {

    // useless useEffect
    useEffect(() => {
        setGeneImg; 
    });

    return (
        <div>
            Chat
        </div>
    )
}

export default Chat;