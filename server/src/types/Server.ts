import Channels from "./Channels";
import Image from "./Image";
import Role from "./Roles";

export default interface Server {
    channels: Channels[];
    icon?: Image;
    banner?: Image;
    roles?: Role[];
    id: string;
}