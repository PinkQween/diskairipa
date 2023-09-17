import Image from "./Image";
import permissions from "./Permissions";

export default interface Role {
    name: string;
    colour: string;
    permissions: permissions;
    icon?: Image;
    id: string
}