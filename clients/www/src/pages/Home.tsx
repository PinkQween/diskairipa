import detectOS from "../utils/detectOS"
import { GoDownload } from 'react-icons/go'

function Home() {
  return (
    <div className="bg-[#404eed] min-h-[626px] align-middle justify-center flex">
      <div className="">
        <button className="h-12 rounded-full px-4 bg-white flex"><GoDownload />Download for {detectOS}</button>
        <button className="h-12 rounded-full px-4 bg-discord-gray-700 text-white">Open Diskairipa in your browser</button>
      </div>
    </div>
  )
}

export default Home