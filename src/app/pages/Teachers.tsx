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

interface Teacher {
  id?: number;
  username: string;
  createdAt?: string;
  updatedAt?: string;
}

enum ModalMode {
  create,
  update,
}

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [modal, setModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode | undefined>();
  const [isValid, setIsValid] = useState(true);
  const teacherName = useRef<HTMLInputElement>(null);
  const [modalDisplayName, setModalDisplayName] = useState<
    string | undefined
  >();
  const selectedTeacher = useRef<Teacher>({
    id: NaN,
    username: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoad(true);
    setTeachers([]);
    try {
      const { data } = await api.get<Teacher[]>("api/teacher/");
      setTeachers(data);
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };

  const checkValidation = () => {
    const nameLength = selectedTeacher.current.username.length;
    if (nameLength > 0) {
      return true;
    } else {
      setIsValid(false);
      return false;
    }
  };

  const sendEdit = async () => {
    if (!checkValidation()) return;
    await api.put<Teacher>(
      `api/teacher/${selectedTeacher.current.id}`,
      selectedTeacher.current
    );
    closeModal();
    getData();
  };

  const sendNew = async () => {
    if (!checkValidation()) return;
    await api.post<Teacher>(`api/teacher`, selectedTeacher.current);
    closeModal();
    getData();
  };

  const sendDelete = async (id: number) => {
    await api.delete<Teacher>(`api/teacher/${id}`);
    getData();
  };

  const onEdit = (teacher: Teacher) => {
    setModalDisplayName(teacher.username);
    selectedTeacher.current = { ...teacher };
    if (teacherName.current) {
      teacherName.current.value = teacher.username;
    }
    openModal(ModalMode.update);
  };

  const addNew = () => {
    setModalDisplayName(undefined);
    selectedTeacher.current = {
      username: "",
    };
    if (teacherName.current) {
      teacherName.current.value = "";
    }
    setIsValid(true);
    openModal(ModalMode.create);
  };

  const openModal = (mode: ModalMode) => {
    setModalMode(mode);
    setModal(true);
    setIsValid(true);
  };

  const closeModal = () => {
    setModalMode(undefined);
    setModal(false);
  };
  console.log(teachers);

  return (
    <ModuleWrapper>
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-row items-center justify-between">
          <div className="light:text-black text-2xl dark:text-white">
            Καθηγητές
          </div>
          <Button size={"md"} onClick={addNew}>
            <IoMdAdd className="mr-2" />
            Προσθήκη
          </Button>
        </div>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Όνομα</Table.HeadCell>
            <Table.HeadCell className=" w-3">
              <span className="sr-only">Delete</span>
            </Table.HeadCell>
            <Table.HeadCell className=" w-3">
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {teachers.map((teacher) => (
              <Table.Row
                key={teacher.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {teacher.username}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    pill
                    size={"xs"}
                    color="failure"
                    onClick={() =>
                      typeof teacher.id === "number" && sendDelete(teacher.id)
                    }
                  >
                    <MdDelete />
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button pill size={"xs"} onClick={() => onEdit(teacher)}>
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
            : "Εισαγωγή Καθηγητή"}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label value="Ονομα" />
              </div>
              <TextInput
                ref={teacherName}
                defaultValue={selectedTeacher.current.username}
                onChange={(e) => {
                  selectedTeacher.current.username = e.target.value;
                  if (!isValid && e.target.value.length > 0) {
                    setIsValid(true);
                    setTimeout(() => {
                      e.target.focus();
                    });
                  }
                }}
                color={isValid ? undefined : "failure"}
                helperText={
                  isValid ? undefined : (
                    <>
                      <span className="font-medium"></span>Το όνομα καθηγητή
                      είναι υποχρεωτικό.
                    </>
                  )
                }
              />
            </div>
            {/* <div>
              <div className="mb-2 block">
                <Label value="Lab Description" />
              </div>
              <Textarea
                defaultValue={selectedTeacher.current.lab_description}
                onChange={(e) =>
                  (selectedTeacher.current.lab_description = e.target.value)
                }
                placeholder="Lab Description..."
                required
                rows={4}
              />
            </div> */}
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

export default Teachers;
