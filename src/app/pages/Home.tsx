import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import api from '../../api';
// import { Card } from '../../lib';

const Home: FC = () => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await api.get('api/labinstance');
    setData(data);
  };

  return (
    <div className="mx-auto max-w-screen-xl p-4 lg:p-12 lg:text-center">
      <div className="flex flex-row flex-wrap gap-2">
        {data.map((lab) => (
          <div className="max-w-[500px] min-w-[500px] rounded-md bg-white p-4">
            <div className="flex flex-row items-center justify-between gap-8">
              <h5 className="text-left text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {lab.lab.lab_name}
              </h5>
              <span className="flex flex-row items-end align-bottom text-xl leading-none">
                <FiUsers className="mr-2" size={20} />
                {lab.students.length}
              </span>
            </div>
            <div className='flex flex-row'>
            <div className="text-gray-900 dark:text-white">{lab.startAt}</div>
            </div>
            
          </div>
        ))}
        {/* {data.map((lab) => (
          <div key={lab.id} className="max-w-sm">
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{lab.lab.lab_name}</h5>
              <div>
                <div className="flex flex-row items-end justify-between text-gray-900 dark:text-white">
                  <div>{lab.lab.lab_description}</div>
                  
                </div>
              </div>
            </Card>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default Home;
