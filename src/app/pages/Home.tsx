import type { FC } from "react";
import { useEffect, useState } from "react";
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

  const refresh = async () => {
    await getData();
  };

  return (
    <div className="mx-auto max-w-screen-xl lg:px-12 lg:text-center">
      <div className="flex flex-row flex-wrap gap-2">
        <Calendar data={data} refresh={refresh} />
      </div>
    </div>
  );
};

export default Home;
