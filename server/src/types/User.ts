import Image from "./Image";

export default interface User {
    id: string;
    username: string;
    image?: Image;
}