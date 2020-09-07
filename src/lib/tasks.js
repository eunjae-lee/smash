import { getDateWithoutTime } from "./date";

const LOCAL_STORAGE_KEY = "smashTasks";

export function getList() {
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY));
  } catch (e) {
    return null;
  }
}

export function setList(newList) {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
}

export function addTask(list, newTask) {
  const newList = [
    ...(list || []),
    { id: generateUUID(), title: newTask, createdAt: new Date().getTime() },
  ];
  setList(newList);
  return newList;
}

export function updateTimeRange(list, taskId, startTimestamp) {
  const index = list.findIndex((task) => task.id == taskId);
  if (!list[index].ranges) {
    list[index].ranges = {};
  }
  list[index].ranges[startTimestamp] = new Date().getTime();
  setList(list);
}

export function markAsDone(list, task) {
  const index = list.findIndex((t) => t.id === task.id);
  list[index].done = true;
  setList(list);
}

export function getSecondsSpent(task) {
  if (!task.ranges) {
    return null;
  }
  const totalSeconds = Object.keys(task.ranges)
    .map((startTimestamp) => {
      const endTimestamp = task.ranges[startTimestamp];
      const seconds = (endTimestamp - startTimestamp) / 1000;
      return seconds;
    })
    .reduce((acc, seconds) => {
      acc += seconds;
      return acc;
    }, 0);
  return Math.floor(totalSeconds);
}

export function isTaskForToday(task) {
  return (
    getDateWithoutTime(task.createdAt).toString() ===
    getDateWithoutTime(new Date()).toString()
  );
}

const generateUUID = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
