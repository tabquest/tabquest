import taskReducer, {
  setFolders,
  setTasks,
  addFolder,
  updateFolder,
  deleteFolder,
  addTask,
  updateTask,
  deleteTask,
  setAddingNew,
} from '../utils/redux/taskSlice';
import type { Folder, Task } from '../types/domain';

const todayFolder: Folder = {
  id: 'today',
  title: 'Today',
  isDefault: true,
  count: 0,
};
const workFolder: Folder = {
  id: 'work',
  title: 'Work',
  count: 1,
  isDefault: false,
};
const mockTask: Task = {
  id: 't1',
  title: 'Review PR',
  folder: 'work',
  completed: false,
};

describe('taskSlice', () => {
  const initialState = {
    folders: [todayFolder],
    tasks: [] as Task[],
    isAddingNew: false,
  };

  it('should return initial state', () => {
    const state = taskReducer(undefined, { type: 'unknown' });
    expect(state.folders).toHaveLength(1);
    expect(state.folders[0].id).toBe('today');
    expect(state.tasks).toEqual([]);
  });

  it('should handle setFolders', () => {
    const state = taskReducer(
      initialState,
      setFolders([todayFolder, workFolder]),
    );
    expect(state.folders).toHaveLength(2);
  });

  it('should handle setTasks', () => {
    const state = taskReducer(initialState, setTasks([mockTask]));
    expect(state.tasks).toEqual([mockTask]);
  });

  it('should handle addFolder', () => {
    const state = taskReducer(initialState, addFolder(workFolder));
    expect(state.folders).toHaveLength(2);
    expect(state.folders[1]).toEqual(workFolder);
  });

  it('should handle updateFolder title', () => {
    const prevState = { ...initialState, folders: [todayFolder, workFolder] };
    const state = taskReducer(
      prevState,
      updateFolder({ id: 'work', title: 'Office' }),
    );
    expect(state.folders[1].title).toBe('Office');
  });

  it('should handle deleteFolder and recalculate counts', () => {
    const prevState = {
      folders: [todayFolder, { ...workFolder, count: 1 }],
      tasks: [mockTask],
      isAddingNew: false,
    };
    const state = taskReducer(prevState, deleteFolder('work'));
    expect(state.folders).toHaveLength(1);
    expect(state.folders[0].id).toBe('today');
  });

  it('should handle addTask and increment folder count', () => {
    const prevState = {
      folders: [todayFolder, { ...workFolder, count: 0 }],
      tasks: [] as Task[],
      isAddingNew: false,
    };
    const state = taskReducer(prevState, addTask(mockTask));
    expect(state.tasks).toHaveLength(1);
    expect(state.folders[1].count).toBe(1);
  });

  it('should handle updateTask', () => {
    const prevState = {
      folders: [todayFolder, workFolder],
      tasks: [mockTask],
      isAddingNew: false,
    };
    const state = taskReducer(
      prevState,
      updateTask({ id: 't1', updates: { completed: true } }),
    );
    expect(state.tasks[0].completed).toBe(true);
  });

  it('should handle deleteTask and decrement folder count', () => {
    const folderWithCount = { ...workFolder, count: 2 };
    const extraTask: Task = {
      id: 't2',
      title: 'Write docs',
      folder: 'work',
      completed: false,
    };
    const prevState = {
      folders: [todayFolder, folderWithCount],
      tasks: [mockTask, extraTask],
      isAddingNew: false,
    };
    const state = taskReducer(prevState, deleteTask('t1'));
    expect(state.tasks).toHaveLength(1);
    expect(state.folders[1].count).toBe(1);
  });

  it('should handle setAddingNew', () => {
    const state = taskReducer(initialState, setAddingNew(true));
    expect(state.isAddingNew).toBe(true);
  });
});
