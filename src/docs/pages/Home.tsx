import { FC, useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import api from '../../api';
import { Card } from '../../lib';

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
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((lab) => (
          <div key={lab.id} className="max-w-sm">
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{lab.lab_name}</h5>
              <div>
                <div className="flex flex-row justify-between items-end text-gray-900 dark:text-white">
                  <div>Smth</div>
                  <span className="flex flex-row align-bottom items-end text-xl leading-none">
                    <FiUsers className="mr-2" size={20} />
                    {lab.studentCount}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
