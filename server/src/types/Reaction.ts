import Image from './Image.ts';
import User from './User.ts'

export default interface Reaction {
    emoji: Image; // Emoji representation, e.g., "👍"
    count: number; // Number of reactions
    users: User[]; // Users who reacted
}