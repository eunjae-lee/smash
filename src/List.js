import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { getList, addTask, getSecondsSpent } from "./lib/tasks";
import { secondsToString } from "./lib/time";

export function List() {
  const [newTask, setNewTask] = useState("");
  const [list, setList] = useState(getList);
  const history = useHistory();

  const onSubmit = (event) => {
    event.preventDefault();
    setList(addTask(list, newTask));
    setNewTask("");
  };
  return (
    <div className="py-10 px-20">
      <div className="p-2">
        <p className="uppercase text-orange-900">Today</p>
        <ul className="list-decimal mt-10">
          {(list || []).map((item, index) => (
            <li
              key={index}
              className={`mb-2 ${item.done && "line-through text-gray-500"}`}
            >
              <span className="text-2xl text-gray-700">{item.title}</span>
              <span className="ml-4 text-gray-600">
                {secondsToString(getSecondsSpent(item))}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="Enter new task..."
            className="border-b-2 text-2xl p-2 text-gray-800 w-full"
          />
        </form>
      </div>
      <div className="mt-10">
        <button
          type="button"
          className="border-2 rounded-md bg-orange-600 hover:bg-orange-700 text-orange-200 w-full py-4 text-3xl"
          onClick={() => {
            history.push("/smash");
          }}
          disabled={list === null || list.length === 0}
        >
          Start Smashing!
        </button>
      </div>
    </div>
  );
}
