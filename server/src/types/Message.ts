import Image from "./Image";
import Reaction from "./Reaction";
import User from "./User";

export default interface Message {
    id: string;
    content: string; // Markdown or plain text content
    author: User; // User who sent the message
    timestamp: Date; // Date and time when the message was sent
    images?: Image[]; // Array of images within the message
    reactions?: Reaction[]; // Array of reactions to the message
}