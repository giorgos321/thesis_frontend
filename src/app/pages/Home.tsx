import type { FC } from "react";
import { useEffect, useState } from "react";
// import { FiUsers } from 'react-icons/fi';
import api from "../../api";
import Calendar from "../components/Calendar";

const Home: FC = () => {
  const [data, setData] = useState<[]>([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await api.get("api/labinstance");

    setData(data);
  };
  console.log(data);

  return (
    <div className="mx-auto max-w-screen-xl lg:p-12 lg:text-center">
      <div className="flex flex-row flex-wrap gap-2">
        <Calendar data={data} />
      </div>
    </div>
  );
};

export default Home;
