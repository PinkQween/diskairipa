import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

async function sleep(ms: number) {
  return await new Promise(resolve => setTimeout(resolve, ms));
}

const NotFound = () => {
  const history = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      await sleep(1000);
      
      history('/');
    }

    redirect();
  })

  return (
    <> 
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                <p className="text-lg">The requested page could not be found.</p>
            </div>
        </div>
    </>
  );
};

export default NotFound;