import { useRouter } from 'next/router'
import { Ihollow } from '../pages/index'
import { Iuser } from '../pages/index'

interface hollowProps {
  hollows: Ihollow[],
  handleAddArt: void,
  currentUser: Iuser
}

export default function HollowCreatePanel () {
    
    return (
        <div>
            <p>挖掘一個樹洞</p>
            <p>樹洞名稱</p>
            <p>這個樹洞已經存在，您可以點選前往該樹洞</p>
            <div>
                <p>相似樹洞</p>
            </div>
            <input 
                placeholder='請輸入樹洞名稱' type="text" />

            <button onClick={() => {
            }}>送出</button>
        </div>
    )
}