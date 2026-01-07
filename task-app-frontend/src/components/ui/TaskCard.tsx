import { Task } from "@/types/task";

type Props = {
  task: Task;
  onDelete: (id: string) => void;
};

export default function TaskCard({ task, onDelete }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold text-lg">{task.title}</h3>

      {task.description && (
        <p className="text-gray-600 text-sm mt-1">
          {task.description}
        </p>
      )}

      <div className="flex justify-between items-center mt-4">
        <span className="text-xs px-2 py-1 rounded bg-gray-100">
          {task.status}
        </span>

        <button
          onClick={() => onDelete(task.id)}
          className="text-sm text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
