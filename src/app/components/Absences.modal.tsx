import { Button, Label, Modal, Table, TextInput } from "flowbite-react";
import moment from "moment";
import {
  FC,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { BiMinus } from "react-icons/bi";
import { BsPlusLg } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import api from "../../api";
import { Student } from "../pages/Absences";

interface PostStudent {
  name: string;
  register_number: string;
}

interface StudentWithSubscription extends Student {
  isSubscribed: boolean;
}

const AbsencesModal: FC<{
  closeModal: () => void;
  refresh: () => void;
  modal: boolean;
  students: Student[];
  labId: number;
  date: string | undefined;
}> = ({
  closeModal,
  modal,
  students,
  labId,
  refresh,
  date = moment().format("YYYY-MM-DD"),
}) => {
  const [studentsWithSubscription, setStudentsWithSubscription] = useState<
    StudentWithSubscription[]
  >([]);
  const [search, setSearch] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [addNewStudent, setAddNewStudent] = useState<boolean>(false);
  const newStudentModal = useRef<{ sendNewStudent: () => Promise<Student> }>();

  const ref1 = useRef<HTMLDivElement>(null);

  // Initialize or update students with subscription flag when modal opens or students prop changes
  useMemo(() => {
    if (students.length && modal) {
      setStudentsWithSubscription(
        students.map((student) => ({
          ...student,
          isSubscribed: false,
        }))
      );
    }
  }, [students, modal]);

  const filteredStudents = useMemo(() => {
    return studentsWithSubscription.filter((s) => s.name.includes(search));
  }, [studentsWithSubscription, search]);

  const toggleStudentSubscription = (student: StudentWithSubscription) => {
    setStudentsWithSubscription(
      studentsWithSubscription.map((s) =>
        s.id === student.id ? { ...s, isSubscribed: !s.isSubscribed } : s
      )
    );
  };

  const sendSubscriptions = async () => {
    const subscribedStudents = studentsWithSubscription.filter(
      (s) => s.isSubscribed
    );
    const subs = subscribedStudents.map((s) => ({
      absense: 0,
      labInstanceId: labId,
      studentId: s.id,
      subscriptionDate: date,
    }));

    setIsProcessing(true);
    await api.post(`api/subscriptions/`, subs);

    // Reset all subscription flags
    setStudentsWithSubscription(
      studentsWithSubscription.map((s) => ({ ...s, isSubscribed: false }))
    );

    refresh();
    closeModal();
    setIsProcessing(false);
  };

  const sendNewStudent = async () => {
    const newStudent = await newStudentModal.current?.sendNewStudent();
    if (newStudent) {
      // Add the new student with the subscription flag set to true
      setStudentsWithSubscription([
        ...studentsWithSubscription,
        { ...newStudent, isSubscribed: true },
      ]);
    }
    refresh();
    setAddNewStudent(false);
  };

  return (
    <Modal onClose={closeModal} position="center" show={modal} size={"5xl"}>
      <Modal.Header>{"Εγγραφή φοιτητών"}</Modal.Header>
      <Modal.Body>
        {!addNewStudent ? (
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
              className="max-h-[460px] w-full overflow-y-auto"
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
                  <Table.HeadCell className="w-1">A/M</Table.HeadCell>
                  <Table.HeadCell>Όνομα</Table.HeadCell>
                  <Table.HeadCell className="w-3 text-right"></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {filteredStudents.map((student) => (
                    <Table.Row
                      key={student.id}
                      className={
                        student.isSubscribed
                          ? "bg-gray-50 dark:border-gray-700 dark:bg-gray-700"
                          : "bg-white dark:border-gray-700 dark:bg-gray-800"
                      }
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {student.register_number}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {student.name}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap text-right font-medium text-gray-900 dark:text-white">
                        <Button
                          size={"xs"}
                          color={student.isSubscribed ? "failure" : "success"}
                          onClick={() => toggleStudentSubscription(student)}
                        >
                          {student.isSubscribed ? <BiMinus /> : <BsPlusLg />}
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        ) : (
          <NewStudentComponent ref={newStudentModal} />
        )}
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button color="gray" onClick={closeModal}>
          Άκυρο
        </Button>
        <Button color="gray" onClick={() => setAddNewStudent(!addNewStudent)}>
          {addNewStudent ? "Εγγραφή φοιτητών" : "Αποθήκευση νέου φοιτητή"}
        </Button>
        <Button
          isProcessing={isProcessing}
          onClick={addNewStudent ? sendNewStudent : sendSubscriptions}
        >
          Αποθήκευση
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const NewStudentComponent = forwardRef((_props, ref) => {
  const studentName = useRef<HTMLInputElement>(null);
  const studentNumber = useRef<HTMLInputElement>(null);
  const [isNameValid, setIsNameValid] = useState<boolean>(true);
  const [isNumberValid, setIsNumberValid] = useState<boolean>(true);

  const selectedStudent = useRef<PostStudent>({
    name: "",
    register_number: "",
  });

  useImperativeHandle(ref, () => ({
    sendNewStudent() {
      return sendStudent(selectedStudent.current);
    },
  }));

  const sendStudent = async (student: PostStudent): Promise<Student | void> => {
    if (!checkValidation(student)) return;
    const { data } = await api.post<Student>(`api/student`, student);
    return data;
    // closeModal();
    // getData();
  };

  const checkValidation = (student: PostStudent) => {
    const nameLength = student.name.length;
    const numberLength = student.register_number.length;
    if (nameLength > 0 && numberLength > 0) {
      return true;
    } else {
      if (nameLength <= 0) {
        setIsNameValid(false);
      }
      if (numberLength <= 0) {
        setIsNumberValid(false);
      }

      return false;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 block">
          <Label value="Όνομα φοιτητή" />
        </div>
        <TextInput
          ref={studentName}
          defaultValue={selectedStudent.current.name}
          onChange={(e) => {
            selectedStudent.current.name = e.target.value;
            if (!isNameValid && e.target.value.length > 0) {
              setIsNameValid(true);
              setTimeout(() => {
                e.target.focus();
              });
            }
          }}
          color={isNameValid ? undefined : "failure"}
          helperText={
            isNameValid ? undefined : (
              <>
                <span className="font-medium"></span>Το όνομα φοιτητή είναι
                υποχρεωτικό.
              </>
            )
          }
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label value="A.M." />
        </div>
        <TextInput
          ref={studentNumber}
          defaultValue={selectedStudent.current.register_number}
          onChange={(e) => {
            selectedStudent.current.register_number = e.target.value;
            if (!isNumberValid && e.target.value.length > 0) {
              setIsNumberValid(true);
              setTimeout(() => {
                e.target.focus();
              });
            }
          }}
          color={isNumberValid ? undefined : "failure"}
          helperText={
            isNumberValid ? undefined : (
              <>
                <span className="font-medium"></span>Το Α/Μ είναι υποχρεωτικό.
              </>
            )
          }
        />
      </div>
    </div>
  );
});

export default AbsencesModal;
