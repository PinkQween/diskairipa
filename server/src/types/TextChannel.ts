import User from "./User";
import Message from "./Message";

export default interface TextChannel {
    users: User[];
    messages: Message[];
    id: string;
}