import { Elements } from 'react-flow-renderer';
import DialogueNode from './DialogueNode';
import DialogueEdge from './DialogueEdge';

const initialElements : Elements<any> = [
  new DialogueNode("Character 1", "Hello world!"),
  new DialogueNode("World", "What's up?"),
  new DialogueEdge("0", "1")
];

export default initialElements;