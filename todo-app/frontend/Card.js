import React from "react";

const Card = (props) => {
  return (
    <div
      className="card"
      style={{
        backgroundColor: props.todo.finished ? "red" : "green"
      }}
    >
      <div className="card-body">
        <div className="row">
          <div className="col-8">
            <h1
              style={{
                color: props.todo.finished ? "white" : "black"
              }}
            >
              {props.todo.content}
            </h1>
          </div>
          <div className="col-2  mr-0">
            <button
              className="btn btn-info btn-lg"
              onClick={props.onClickCheck}
            >
              Done
            </button>
          </div>
          <div className="col-2  mr-0">
            <button
              className="btn btn-warning btn-lg"
              onClick={props.onClickTrash}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

//   const print = () => {
//     console.log(props.item.isCompleted);
//   };
