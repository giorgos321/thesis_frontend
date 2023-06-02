import {
  Button,
  //   Label,
  //   Modal,
  //   Select,
  Spinner,
  Table,
} from "flowbite-react";
// import moment from "moment";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { useParams } from "react-router-dom";
import api from "../../api";
import ModuleWrapper from "../components/ModuleWrapper";

interface Subscription {
  id: number;
  name: string;
  absences: number;
  register_number: number;
  subscribedDate: string;
}

// enum ModalMode {
//   create,
//   update,
// }

// const currentYear = moment().year();

const Absences = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  //   const [modal, setModal] = useState<boolean>(false);
  //   const [modalMode, setModalMode] = useState<ModalMode | undefined>();
  //   const [isValid, setIsValid] = useState(true);
  //   const [year, setYear] = useState<number>(currentYear);
  //   const [semester, setSemester] = useState<number>(1);
  //   const [isProcessing, setIsProcessing] = useState<boolean>(false);
  //   const selectedLab = useRef<Absence>({
  //     id: NaN,
  //     lab_name: "",
  //     lab_description: "",
  //     lab_year: currentYear,
  //     lab_semester: 1,
  //     createdAt: "",
  //     updatedAt: "",
  //   });

  const { id } = useParams();
  //   console.log(id);

  //   useEffect(() => {
  //     selectedLab.current.lab_year = year;
  //     selectedLab.current.lab_semester = semester;
  //   }, [year, semester]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoad(true);
    setSubscriptions([]);
    try {
      const { data } = await api.get<any[]>(`api/subscriptions/${id}`);
      console.log(data);

      const subscriptions: Subscription[] = data.map((el) => ({
        id: el.studentId,
        name: el.students[0].name,
        absences: el.absense,
        register_number: el.students[0].register_number,
        subscribedDate: moment(el.createdAt).format("DD/MM/YYYY"),
      }));
      console.log(subscriptions);

      setSubscriptions(subscriptions);
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };

  //   const checkValidation = () => {
  //     const nameLength = selectedLab.current.lab_name.length;
  //     if (nameLength > 0) {
  //       return true;
  //     } else {
  //       setIsValid(false);
  //       return false;
  //     }
  //   };

  //   const sendEdit = async () => {
  //     // if (!checkValidation()) return;
  //     // setIsProcessing(true);
  //     // await api.put<Lab>(
  //     //   `api/labs/${selectedLab.current.id}`,
  //     //   selectedLab.current
  //     // );
  //     // setIsProcessing(false);
  //     // closeModal();
  //     // getData();
  //   };

  //   const sendNew = async () => {
  //     // if (!checkValidation()) return;
  //     // setIsProcessing(true);
  //     // await api.post<Lab>(`api/labs`, selectedLab.current);
  //     // setIsProcessing(false);
  //     // closeModal();
  //     // getData();
  //   };

  //   const sendDelete = async (id: number) => {
  //     // await api.delete<Lab>(`api/labs/${id}`);
  //     // getData();
  //   };

  //   const onEdit = (lab: Absence) => {
  //     // selectedLab.current = lab;
  //     // setYear(lab.lab_year);
  //     // setSemester(lab.lab_semester);
  //     // openModal(ModalMode.update);
  //   };

  //   const getYearsRange = () => {
  //     const range = 5;
  //     const startRange = currentYear - range;
  //     const endRange = currentYear + range;
  //     const years = [];
  //     for (let year = startRange; year < endRange; year++) {
  //       years.push(year);
  //     }

  //     return years;
  //   };

  //   const getSemesters = () => {
  //     const semesters = [];
  //     for (let semester = 1; semester <= 8; semester++) {
  //       semesters.push(semester);
  //     }
  //     return semesters;
  //   };

  //   const years = useRef(getYearsRange());

  //   const semesters = useRef(getSemesters());

  //   const addNew = () => {
  //     selectedLab.current = {
  //       lab_name: "",
  //       lab_description: "",
  //       lab_year: year,
  //       lab_semester: semester,
  //     };
  //     openModal(ModalMode.create);
  //   };

  //   const openModal = (mode: ModalMode) => {
  //     setModalMode(mode);
  //     setModal(true);
  //   };

  //   const closeModal = () => {
  //     setModalMode(undefined);
  //     setModal(false);
  //   };

  const updateAbcense = async (
    subscription: Subscription,
    i: number,
    op: "increment" | "decrement"
  ) => {
    const subs = [...subscriptions];
    if (op === "increment") {
      subs[i].absences = subs[i].absences + 1;
    } else {
      subs[i].absences = subs[i].absences - 1;
    }
    try {
      await api.put(`api/subscriptions/${id}`, {
        labInstanceId: id,
        studentId: subscription.id,
        absense: subs[i].absences,
      });
      setSubscriptions(subs);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModuleWrapper>
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-row items-center justify-between">
          <div className="text-2xl">Εργαστίρια</div>
          <Button size={"md"}>
            <IoMdAdd className="mr-2" />
            Προσθήκη
          </Button>
        </div>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>A/M</Table.HeadCell>
            <Table.HeadCell>Όνομα</Table.HeadCell>
            <Table.HeadCell>Ημερομινία Εγγραφής</Table.HeadCell>
            <Table.HeadCell>Απουσίες</Table.HeadCell>
            {/* <Table.HeadCell className=" w-3">
              <span className="sr-only">Edit</span>
            </Table.HeadCell> */}
          </Table.Head>

          <Table.Body className="divide-y">
            {subscriptions.map((subscription, i) => (
              <Table.Row
                key={subscription.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {subscription.register_number}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {subscription.name}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {subscription.subscribedDate}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <div className="flex flex-row gap-3 items-center">
                    <Button
                      color="gray"
                      onClick={() =>
                        updateAbcense(subscription, i, "decrement")
                      }
                    >
                      <AiOutlineMinus />
                    </Button>
                    <div className=" text-base">{subscription.absences}</div>
                    <Button
                      color="gray"
                      onClick={() =>
                        updateAbcense(subscription, i, "increment")
                      }
                    >
                      <AiOutlinePlus />
                    </Button>
                  </div>
                </Table.Cell>
                {/* <Table.Cell>
                  <Button pill size={"xs"}>
                    <MdEdit />
                  </Button>
                </Table.Cell> */}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {load && (
          <div className="w-full text-center">
            <Spinner className="text-center" size={"xl"} />
          </div>
        )}
      </div>
    </ModuleWrapper>
  );
};

export default Absences;
