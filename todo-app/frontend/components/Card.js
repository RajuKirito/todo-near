import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  solid
} from "@fortawesome/fontawesome-svg-core/import.macro";

const Card = (props) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row">
          <div className="col-10">
            <h1>{props.todo}</h1>
          </div>
          <div className="col-2  mr-0">
            {/* <button
              onClick={props.onClickPencil}
              className="mt-10"
            >Update</button> */}
            <button
              onClick={props.onClickTrash}
            >Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};