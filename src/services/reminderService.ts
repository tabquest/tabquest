import type { Task } from '../types/domain';

export const checkDueReminders = (tasks: Task[]): Task[] => {
  const now = new Date();
  return tasks.filter((task) => {
    if (!task.reminderDateTime || task.completed || task.reminderSent)
      return false;
    const reminderTime = new Date(task.reminderDateTime);
    return now >= reminderTime;
  });
};
