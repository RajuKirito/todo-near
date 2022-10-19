import "regenerator-runtime/runtime";
import React from "react";
import Card from "./Card";

import "./assets/global.css";

import { SignInPrompt, SignOutButton } from "./ui-components";

export default function App({ isSignedIn, helloNEAR, wallet }) {
  const [todosFromBlockchain, setTodosFromBlockchain] = React.useState([]);
  const [formValue, setFormValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // Get blockchian state once on component load
  React.useEffect(() => {
    if (isSignedIn) {
      setIsLoading(true);
      console.log("signed in");
      console.log(helloNEAR.contractId);
      getTodos();
      setIsLoading(false);
    }
  }, []);

  /// If user not signed-in with wallet - show prompt
  if (!isSignedIn) {
    // Sign-in flow will reload the page later
    return <SignInPrompt onClick={() => wallet.signIn()} />;
  }

  async function addTodo(e) {
    setIsLoading(true);
    e.preventDefault();

    const todo = e.target[0].value;
    console.log(todo);
    setFormValue("");

    await helloNEAR.add_todo(todo);
    getTodos();
    setIsLoading(false);
  }

  function getTodos() {
    setIsLoading(true);
    helloNEAR.get_todos().then((res) => {
      console.log(res);
      setTodosFromBlockchain(res);
      setIsLoading(false);
    });
    console.log("todos are" + todosFromBlockchain);
    console.log(isLoading);
  }

  async function removeTodo(todo = []) {
    setIsLoading(true);
    console.log(todo);
    await helloNEAR.delete_todo(todo[0]);
    getTodos();
    setIsLoading(false);
  }

  async function updateTodo(todo) {
    setIsLoading(true);
    console.log(todo);
    // await helloNEAR.add_todo(todo);
    await helloNEAR.update_todo(todo[0]);
    getTodos();
    setIsLoading(false);
  }

  function handleChange(e) {
    setFormValue(e.target.value);
  }
  return (
    <div className="container mx-auto my-5">
      <SignOutButton
        accountId={wallet.accountId}
        onClick={() => wallet.signOut()}
      />
      <h1 className="text-center">Todo App</h1>

      <div className="text-center">
        <form onSubmit={addTodo}>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col col-8">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add Todo"
                    value={formValue}
                    onChange={handleChange}
                  />
                </div>
                <div className="col col-4">
                  <button className="btn btn-secondary btn-lg">
                    <span>Add Todo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div>
          {isLoading ? (
            <h1>Updating state please wait...</h1>
          ) : (
            todosFromBlockchain.map((item, index) => {
              return (
                <div key={index} className="row">
                  <div className="col offset-2 col-8">
                    <Card
                      todo={item[1]}
                      id={index}
                      onClickTrash={() => removeTodo(item)}
                      onClickCheck={() => updateTodo(item)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
