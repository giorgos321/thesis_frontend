import {
  Button,
  Label,
  Modal,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import api from "../../api";
import ModuleWrapper from "../components/ModuleWrapper";

interface Student {
  id?: number;
  name: string;
  register_number: string;
  createdAt?: string;
  updatedAt?: string;
}

enum ModalMode {
  create,
  update,
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [modal, setModal] = useState<boolean>(false);
  const [isNameValid, setIsNameValid] = useState<boolean>(true);
  const [isNumberValid, setIsNumberValid] = useState<boolean>(true);
  const [modalMode, setModalMode] = useState<ModalMode | undefined>();
  const studentName = useRef<HTMLInputElement>(null);
  const studentNumber = useRef<HTMLInputElement>(null);
  const [modalDisplayName, setModalDisplayName] = useState<
    string | undefined
  >();
  const selectedStudent = useRef<Student>({
    id: NaN,
    name: "",
    register_number: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoad(true);
    setStudents([]);
    try {
      const { data } = await api.get<Student[]>("api/student");
      setStudents(data);
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };

  const checkValidation = () => {
    const nameLength = selectedStudent.current.name.length;
    const numberLength = selectedStudent.current.register_number.length;
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

  const sendEdit = async () => {
    if (!checkValidation()) return;
    await api.put<Student>(
      `api/student/${selectedStudent.current.id}`,
      selectedStudent.current
    );
    closeModal();
    getData();
  };

  const sendNew = async () => {
    if (!checkValidation()) return;
    await api.post<Student>(`api/student`, selectedStudent.current);
    closeModal();
    getData();
  };

  const sendDelete = async (id: number) => {
    await api.delete<Student>(`api/student/${id}`);
    getData();
  };

  const onEdit = (student: Student) => {
    setModalDisplayName(student.name);
    selectedStudent.current = { ...student };
    if (studentName.current && studentNumber.current) {
      studentName.current.value = student.name;
      studentNumber.current.value = student.register_number;
    }
    openModal(ModalMode.update);
  };

  const addNew = () => {
    setModalDisplayName(undefined);
    selectedStudent.current = {
      name: "",
      register_number: "",
    };
    if (studentName.current && studentNumber.current) {
      studentName.current.value = "";
      studentNumber.current.value = "";
    }
    openModal(ModalMode.create);
  };

  const openModal = (mode: ModalMode) => {
    setModalMode(mode);
    setModal(true);
    setIsNameValid(true);
    setIsNumberValid(true);
  };

  const closeModal = () => {
    setModalMode(undefined);
    setModal(false);
  };

  return (
    <ModuleWrapper>
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-row items-center justify-between">
          <div className="text-2xl dark:text-white light:text-black">Φοιτητές</div>
          <Button size={"md"} onClick={addNew}>
            <IoMdAdd className="mr-2" />
            Προσθήκη
          </Button>
        </div>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="w-5">Α/Μ</Table.HeadCell>
            <Table.HeadCell>Όνομα</Table.HeadCell>
            <Table.HeadCell className=" w-3">
              <span className="sr-only">Delete</span>
            </Table.HeadCell>
            <Table.HeadCell className=" w-3">
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {students.map((student) => (
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
                <Table.Cell>
                  <Button
                    pill
                    size={"xs"}
                    color="failure"
                    onClick={() =>
                      typeof student.id === "number" && sendDelete(student.id)
                    }
                  >
                    <MdDelete />
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button pill size={"xs"} onClick={() => onEdit(student)}>
                    <MdEdit />
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

      <Modal onClose={closeModal} position="center" show={modal}>
        <Modal.Header>
          {modalMode === ModalMode.update
            ? modalDisplayName
            : "Προσθήκη φοιτητή"}
        </Modal.Header>
        <Modal.Body>
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
                      <span className="font-medium"></span>Το όνομα φοιτητή
                      είναι υποχρεωτικό.
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
                      <span className="font-medium"></span>Το Α/Μ είναι
                      υποχρεωτικό.
                    </>
                  )
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button color="gray" onClick={closeModal}>
            Άκυρο
          </Button>
          <Button onClick={modalMode === ModalMode.update ? sendEdit : sendNew}>
            Αποθήκευση
          </Button>
        </Modal.Footer>
      </Modal>
    </ModuleWrapper>
  );
};

export default Students;
