// src/app/test/page.tsx
export default function TestPage() {
  return (
    <div className="p-8 bg-red-100">
      <h1 className="text-2xl font-bold text-red-900">Tailwind Test</h1>
      <p className="mt-4 text-red-700">If this has red background, Tailwind works!</p>
      <div className="mt-4 p-4 bg-blue-500 text-white rounded-lg">
        Blue box with rounded corners
      </div>
    </div>
  );
}