import type { FC } from "react";
import { useEffect, useState } from "react";
// import { FiUsers } from 'react-icons/fi';
import moment, { MomentInput } from "moment";
import api from "../../api";
import Calendar from "../components/Calendar";
// import { Card } from '../../lib';

interface Lab {
  endRecur: MomentInput;
  startRecur: MomentInput;
  lab: { lab_name: string };
  daysOfWeek: string;
}

const Home: FC = () => {
  const [data, setData] = useState<Lab[]>([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await api.get("api/labinstance");

    const events = data.map((lab: Lab) => ({
      ...lab,
      title: lab.lab.lab_name,
      daysOfWeek: [parseInt(lab.daysOfWeek)],
      startRecur: moment(lab.startRecur).format("YYYY-MM-DD"),
      endRecur: moment(lab.endRecur).format("YYYY-MM-DD"),
    }));

    setData(events);
  };
  console.log(data);

  return (
    <div className="mx-auto max-w-screen-xl lg:p-12 lg:text-center">
      <div className="flex flex-row flex-wrap gap-2">
        <Calendar events={data} />
      </div>
    </div>
  );
};

export default Home;
