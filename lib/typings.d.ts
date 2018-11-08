import {IGame} from "models/groupModel";

// This will allow you to load `.json` files from disk

declare module "*.json"
{ const value: IGame;
  export default value;
}
