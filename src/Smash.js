import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  loadTasks,
  getTasksForToday,
  updateTimeRange,
  markAsDone,
} from "./lib/tasks";
import { secondsToString } from "./lib/time";

export function Smash() {
  const history = useHistory();
  const [tasks, setTasks] = useState();
  const [startTimestamp, setStartTimestamp] = useState();
  const [currentTask, setCurrentTask] = useState();
  const [seconds, setSeconds] = useState();
  useEffect(() => {
    const list = loadTasks();
    setTasks(list);

    const [tasksToDo, tasksDone] = getTasksForToday(list || []);
    setCurrentTask(tasksToDo[0]);

    const timestamp = new Date().getTime();
    setStartTimestamp(timestamp);
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      updateTimeRange(tasks, currentTask.id, startTimestamp);
      setSeconds(Math.floor((new Date().getTime() - startTimestamp) / 1000));
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  });

  return currentTask ? (
    <div className="py-10 px-20">
      <p className="text-3xl text-gray-800 text-center">{currentTask.title}</p>
      <p className="mt-4 text-xl text-orange-800 text-center">
        {secondsToString(seconds)}
      </p>
      <div className="mt-10 flex justify-center">
        <button
          type="button"
          className="text-lg border border-red-300 rounded-sm py-1 px-2 bg-red-200 hover:bg-red-300 text-red-900"
          onClick={() => {
            history.push("/list");
          }}
        >
          Pause
        </button>
        <button
          type="button"
          className="ml-4 text-2xl border border-green-300 rounded-sm py-2 px-4 bg-green-200 hover:bg-green-300 text-green-900"
          onClick={() => {
            markAsDone(tasks, currentTask);
            history.push("/list");
          }}
        >
          Smashed!
        </button>
      </div>
    </div>
  ) : null;
}
