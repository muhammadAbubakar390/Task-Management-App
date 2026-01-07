type Props = {
  params: {
    id: string;
  };
};

export default function TaskDetailsPage({ params }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Task Details
      </h1>

      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <p><strong>Task ID:</strong> {params.id}</p>
        <p className="text-gray-500">
          Task details will appear here.
        </p>
      </div>
    </div>
  );
}
