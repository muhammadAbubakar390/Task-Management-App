'use client';

export default function TestPage() {
  const testLocalStorage = () => {
    console.log('Testing localStorage...');
    localStorage.setItem('test-time', Date.now().toString());
    console.log('Saved test-time to localStorage');
    alert('Saved to localStorage! Check console.');
  };

  const testRedirect = () => {
    console.log('Testing redirect to dashboard...');
    localStorage.setItem('user', JSON.stringify({
      name: 'Test User',
      email: 'test@example.com'
    }));
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">Test Page</h1>
      
      <div className="space-y-4 w-full max-w-md">
        <button 
          onClick={testLocalStorage}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Test LocalStorage
        </button>
        
        <button 
          onClick={testRedirect}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Test Redirect to Dashboard
        </button>
        
        <button 
          onClick={() => {
            console.log('Current localStorage:');
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              console.log(`${key}: ${localStorage.getItem(key!)}`);
            }
            alert('Check console for localStorage contents');
          }}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Show LocalStorage Contents
        </button>
        
        <button 
          onClick={() => {
            localStorage.clear();
            alert('LocalStorage cleared!');
          }}
          className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Clear LocalStorage
        </button>
        
        <a 
          href="/"
          className="block w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-center"
        >
          Go Home
        </a>
        
        <a 
          href="/dashboard"
          className="block w-full py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-center"
        >
          Direct Link to Dashboard
        </a>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg w-full max-w-md">
        <h2 className="font-bold mb-2">Debug Info:</h2>
        <p>Page URL: {typeof window !== 'undefined' ? window.location.href : ''}</p>
        <p>LocalStorage supported: {typeof localStorage !== 'undefined' ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}