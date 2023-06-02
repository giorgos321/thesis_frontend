import {
  Button,
  //   Label,
  Modal,
  //   Select,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
// import moment from "moment";
import moment from "moment";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BiMinus } from "react-icons/bi";
import { BsPlusLg } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
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

interface Student {
  id: number;
  name: string;
  register_number: string;
  createdAt?: string;
  updatedAt?: string;
}

// enum ModalMode {
//   create,
//   update,
// }

// const currentYear = moment().year();

const Absences = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [modal, setModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  //   const [modalMode, setModalMode] = useState<ModalMode | undefined>();
  //   const [isValid, setIsValid] = useState(true);
  //   const [year, setYear] = useState<number>(currentYear);
  //   const [semester, setSemester] = useState<number>(1);

  //   const selectedLab = useRef<Absence>({
  //     id: NaN,
  //     lab_name: "",
  //     lab_description: "",
  //     lab_year: currentYear,
  //     lab_semester: 1,
  //     createdAt: "",
  //     updatedAt: "",
  //   });

  const { id: labInstanceId } = useParams();
  const id = parseInt(labInstanceId as string);
  //   console.log(id);

  //   useEffect(() => {
  //     selectedLab.current.lab_year = year;
  //     selectedLab.current.lab_semester = semester;
  //   }, [year, semester]);

  const getStudents = async (subs: Subscription[]) => {
    const studentIds = subs.map((sub) => sub.id);
    try {
      const { data } = await api.get<Student[]>("api/student");
      const students = data.filter(
        (student) => !studentIds.includes(student.id)
      );
      console.log("setting students");
      setStudents(students);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData().then((subs) => {
      getStudents(subs);
    });
  }, []);

  const refresh = () => {
    getData().then((subs) => {
      getStudents(subs);
    });
  };

  const getData = async () => {
    setLoad(true);
    setSubscriptions([]);
    try {
      const { data } = await api.get<any[]>(`api/subscriptions/${id}`);
      const subscriptions: Subscription[] = data.map((el) => ({
        id: el.studentId,
        name: el.students[0].name,
        absences: el.absense,
        register_number: el.students[0].register_number,
        subscribedDate: moment(el.createdAt).format("DD/MM/YYYY"),
      }));
      setSubscriptions(subscriptions);
      setLoad(false);
      return subscriptions;
    } catch (error) {
      setLoad(false);
      return [];
    }
  };

  const _subs = useMemo(() => {
    return subscriptions.filter((s) => s.name.includes(search));
  }, [subscriptions, search]);

  const openModal = () => {
    // setModalMode(mode);
    setModal(true);
  };

  const closeModal = () => {
    // setModalMode(undefined);
    setModal(false);
  };

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

  const sendDelete = async (sub: Subscription) => {
    await api.delete(`api/subscriptions/${id}`, {
      data: { labInstanceId: id, studentId: sub.id },
    });
    refresh();
  };

  return (
    <ModuleWrapper>
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-row items-center justify-between">
          <div className="text-2xl">Απουσίες</div>
          <Button size={"md"} onClick={openModal}>
            <IoMdAdd className="mr-2" />
            Προσθήκη
          </Button>
        </div>
        <TextInput
          id="search"
          placeholder="Αναζήτηση"
          className="max-w-sm"
          required
          rightIcon={FiSearch}
          onChange={(e) => {
            setSearch(e.target.value);
            setTimeout(() => {
              e.target.focus();
            });
          }}
          type="text"
        />
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>A/M</Table.HeadCell>
            <Table.HeadCell>Όνομα</Table.HeadCell>
            <Table.HeadCell>Ημερομινία Εγγραφής</Table.HeadCell>
            <Table.HeadCell>Απουσίες</Table.HeadCell>
            <Table.HeadCell className=" w-3">
              <span className="sr-only">Delete</span>
            </Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {_subs.map((subscription, i) => (
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
                  <div className="flex flex-row items-center gap-3">
                    <Button
                      color="gray"
                      onClick={() =>
                        updateAbcense(subscription, i, "decrement")
                      }
                    >
                      <AiOutlineMinus />
                    </Button>
                    <div className="text-base">{subscription.absences}</div>
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
                <Table.Cell>
                  <Button
                    pill
                    size={"xs"}
                    color="failure"
                    onClick={() => sendDelete(subscription)}
                  >
                    <MdDelete />
                  </Button>
                </Table.Cell>
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
      {modal && (
        <ModalComponent
          closeModal={closeModal}
          modal={modal}
          students={students}
          labId={id}
          refresh={refresh}
        />
      )}
    </ModuleWrapper>
  );
};

const ModalComponent: FC<{
  closeModal: () => void;
  refresh: () => void;
  modal: boolean;
  students: Student[];
  labId: number;
}> = ({ closeModal, modal, students, labId, refresh }) => {
  const [newSubscriptions, setNewSubscriptions] = useState<Student[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const ref1 = useRef<HTMLDivElement>(null);

  const ref2 = useRef<HTMLDivElement>(null);

  const _students = useMemo(() => {
    const ids = newSubscriptions.map((s) => s.id);
    return students.filter((s) => !ids.includes(s.id));
  }, [newSubscriptions, modal, students]);

  const filteredStudents = useMemo(() => {
    return _students.filter((s) => s.name.includes(search));
  }, [_students, search]);

  const addStudentForSubscription = (student: Student) => {
    setNewSubscriptions([...newSubscriptions, student]);
  };

  const removeStudentForSubscription = (student: Student) => {
    setNewSubscriptions([
      ...newSubscriptions.filter((s) => s.id !== student.id),
    ]);
  };

  const sendSubscriptions = async () => {
    const subs = newSubscriptions.map((s) => ({
      absense: 0,
      labInstanceId: labId,
      studentId: s.id,
    }));
    setIsProcessing(true);
    await api.post(`api/subscriptions/`, subs);
    setNewSubscriptions([]);
    refresh();
    closeModal();
    setIsProcessing(false);
  };

  return (
    <Modal onClose={closeModal} position="center" show={modal}>
      <Modal.Header>{"Νέο Εργαστίριο"}</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-3">
          <TextInput
            id="search"
            placeholder="Αναζήτηση"
            required
            rightIcon={FiSearch}
            onChange={(e) => {
              setSearch(e.target.value);
              setTimeout(() => {
                e.target.focus();
              });
            }}
            type="text"
          />
          <div
            className="max-h-[230px] overflow-y-auto"
            onWheel={(e) => {
              const delta = e.deltaY;
              if (ref1.current) {
                if (delta > 0) {
                  ref1.current.scrollTop += 20;
                } else {
                  ref1.current.scrollTop -= 20;
                }
              }
            }}
            ref={ref1}
          >
            <Table hoverable>
              <Table.Head style={{ position: "sticky", top: "0px" }}>
                <Table.HeadCell className="w-5">A/M</Table.HeadCell>
                <Table.HeadCell>Όνομα</Table.HeadCell>
                <Table.HeadCell className=" w-3">
                  <span className="sr-only">Add</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {filteredStudents.map((student) => (
                  <Table.Row
                    key={student.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {student.register_number}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {student.name}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <Button
                        size={"xs"}
                        color={"light"}
                        onClick={() => addStudentForSubscription(student)}
                      >
                        <BsPlusLg />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          <div
            className="max-h-[230px] overflow-y-auto"
            onWheel={(e) => {
              const delta = e.deltaY;
              if (ref2.current) {
                if (delta > 0) {
                  ref2.current.scrollTop += 20;
                } else {
                  ref2.current.scrollTop -= 20;
                }
              }
            }}
            ref={ref2}
          >
            <Table hoverable>
              <Table.Head style={{ position: "sticky", top: "0px" }}>
                <Table.HeadCell className="w-5">A/M</Table.HeadCell>
                <Table.HeadCell>Όνομα</Table.HeadCell>
                <Table.HeadCell className=" w-3">
                  <span className="sr-only">Add</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {newSubscriptions.map((student) => (
                  <Table.Row
                    key={student.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {student.register_number}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {student.name}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <Button
                        size={"xs"}
                        color={"light"}
                        onClick={() => removeStudentForSubscription(student)}
                      >
                        <BiMinus />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button color="gray" onClick={closeModal}>
          Άκυρο
        </Button>
        <Button isProcessing={isProcessing} onClick={sendSubscriptions}>
          Αποθήκευση
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Absences;
