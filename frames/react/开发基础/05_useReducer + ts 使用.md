# useReducer + ts 使用

## 篇前疑问

- 何时使用 useReducer, 能否代替 useState
- useReducer 配合 ts 使用呢？

## useReducer + ts 使用

```ts
import { useReducer, Reducer } from "react";

type StateType = {
  name: string;
  age: number;
};

type ActionType = {
  type: "name" | "age";
  payload: any;
};

const initState = {
  name: "copyer",
  age: 18,
};
const reducer: Reducer<StateType, ActionType> = (state, action) => {
  switch (action.type) {
    case "name":
      return { ...state, name: action.payload.name };
    case "age":
      // 会拿到最新的值，这里跟 useState 不一样
      console.log("state======>", state);
      return { ...state, age: action.payload.age };
    default:
      return state;
  }
};
function App() {
  const [state, dispatch] = useReducer(reducer, initState);
  const btn = () => {
    dispatch({ type: "name", payload: { name: "james" } });
    dispatch({ type: "age", payload: { age: 12 } });
  };
  return (
    <div>
      <button onClick={btn}>btn</button>
      <p>{state.name}</p>
    </div>
  );
}

export default App;
```
