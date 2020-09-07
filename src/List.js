import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  loadTasks,
  saveTasks,
  deleteAllTasks,
  addTask,
  getSecondsSpent,
  isTaskForToday,
} from "./lib/tasks";
import { secondsToString } from "./lib/time";
import { getDateWithoutTime } from "./lib/date";

function groupTasksPerDay(tasks) {
  return tasks.reduce((acc, task) => {
    if (!task.createdAt) {
      return acc;
    }
    const dateStr = getDateWithoutTime(task.createdAt).toISOString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(task);
    return acc;
  }, {});
}

const dateFormatter = new Intl.DateTimeFormat("default", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result.reduce((acc, task, index) => {
    acc[task.id] = index;
    return acc;
  }, {});
};

export function List() {
  const [newTask, setNewTask] = useState("");
  const [list, setList] = useState(loadTasks);
  const history = useHistory();

  const onSubmit = (event) => {
    event.preventDefault();
    setList(addTask(list, newTask));
    setNewTask("");
  };
  const oldTasksPerDay = groupTasksPerDay(
    (list || []).filter((item) => !isTaskForToday(item))
  );

  const todayTasks = (list || [])
    .filter(isTaskForToday)
    .sort((a, b) => a.order - b.order);

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const orderMap = reorder(
      todayTasks,
      result.source.index,
      result.destination.index
    );

    const newList = list.map((task) => ({
      ...task,
      order: orderMap[task.id],
    }));
    saveTasks(newList);
    setList(newList);
  };

  return (
    <div className="py-10 px-20">
      <div className="p-2">
        <p className="uppercase">
          <span className="text-orange-900 text-xl">Today</span>
          <span className="text-gray-700 text-sm ml-2">
            ({dateFormatter.format(new Date())})
          </span>
        </p>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`${
                  snapshot.isDraggingOver ? "list-none" : "list-disc"
                } mt-10`}
              >
                {todayTasks.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`mb-2 ${
                          item.done && "line-through text-gray-500"
                        }`}
                      >
                        <span className="text-2xl text-gray-700">
                          {item.title}
                        </span>
                        <span className="ml-4 text-gray-600">
                          {secondsToString(getSecondsSpent(item))}
                        </span>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
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

      <div className="p-2 mt-20">
        {Object.keys(oldTasksPerDay)
          .sort((a, b) => (a < b ? 1 : -1))
          .map((day) => {
            const date = new Date(day);
            const title = dateFormatter.format(date);

            return (
              <div key={title}>
                <p className="uppercase text-gray-900">{title}</p>
                <ul className="list-disc mt-4">
                  {oldTasksPerDay[day].map((task, index) => (
                    <li
                      key={index}
                      className={`mb-2 ${
                        task.done && "line-through text-gray-400"
                      }`}
                    >
                      <span className="text-2xl text-gray-600">
                        {task.title}
                      </span>
                      <span className="ml-4 text-gray-500">
                        {secondsToString(getSecondsSpent(task))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
      </div>

      <button
        type="button"
        className="text-gray-400 hover:text-red-600"
        onClick={() => {
          if (confirm("Delete all tasks?")) {
            deleteAllTasks();
            setList([]);
          }
        }}
      >
        Delete All...
      </button>
    </div>
  );
}
