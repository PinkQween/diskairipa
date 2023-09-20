import detectOS from "../utils/detectOS"
import { GoDownload } from 'react-icons/go'

function Home() {
  return (
    <div className="bg-[#404eed] min-h-[626px] items-center justify-center flex">
      <div className="">
        <div className="flex flex-1">
          <button className="h-12 rounded-full px-4 mx-6 bg-white flex items-center"><GoDownload />Download for {detectOS}</button>
          <button className="h-12 rounded-full px-4 bg-discord-gray-700 text-white align-middle">Open Diskairipa in your browser</button>
        </div>
        <div className="flex">
          <img src="https://discord.com/assets/8a8375ab7908384e1fd6efe408284203.svg" />
          <img src="https://discord.com/assets/c40c84ca18d84633a9d86b4046a91437.svg" />
        </div>
      </div>
    </div>
  )
}

export default Home