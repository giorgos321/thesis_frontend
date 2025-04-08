import {
  Button,
  Label,
  Modal,
  Select,
  Spinner,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import api from "../../api";
import ModuleWrapper from "../components/ModuleWrapper";

interface Lab {
  id?: number;
  lab_name: string;
  lab_description: string;
  lab_year: number;
  lab_semester: number;
  createdAt?: string;
  updatedAt?: string;
}

enum ModalMode {
  create,
  update,
}

const currentYear = moment().year();

const Labs = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [modal, setModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode | undefined>();
  const [isValid, setIsValid] = useState(true);
  const [year, setYear] = useState<number>(currentYear);
  const [semester, setSemester] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const labName = useRef<HTMLInputElement>(null);
  const labDesc = useRef<HTMLTextAreaElement>(null);
  const [modalDisplayName, setModalDisplayName] = useState<
    string | undefined
  >();
  const selectedLab = useRef<Lab>({
    id: NaN,
    lab_name: "",
    lab_description: "",
    lab_year: currentYear,
    lab_semester: 1,
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    selectedLab.current.lab_year = year;
    selectedLab.current.lab_semester = semester;
  }, [year, semester]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoad(true);
    setLabs([]);
    try {
      const { data } = await api.get<Lab[]>("api/labs");
      setLabs(data);
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };

  const checkValidation = () => {
    const nameLength = selectedLab.current.lab_name.length;
    if (nameLength > 0) {
      return true;
    } else {
      setIsValid(false);
      return false;
    }
  };

  const sendEdit = async () => {
    if (!checkValidation()) return;
    setIsProcessing(true);
    await api.put<Lab>(
      `api/labs/${selectedLab.current.id}`,
      selectedLab.current
    );
    setIsProcessing(false);
    closeModal();
    getData();
  };

  const sendNew = async () => {
    if (!checkValidation()) return;
    setIsProcessing(true);
    await api.post<Lab>(`api/labs`, selectedLab.current);
    setIsProcessing(false);
    closeModal();
    getData();
  };

  const sendDelete = async (id: number) => {
    await api.delete<Lab>(`api/labs/${id}`);
    getData();
  };

  const onEdit = (lab: Lab) => {
    setModalDisplayName(lab.lab_name);
    selectedLab.current = { ...lab };
    if (labName.current && labDesc.current) {
      labName.current.value = lab.lab_name;
      labDesc.current.value = lab.lab_description;
    }
    setYear(lab.lab_year);
    setSemester(lab.lab_semester);
    openModal(ModalMode.update);
  };

  const getYearsRange = () => {
    const range = 5;
    const startRange = currentYear - range;
    const endRange = currentYear + range;
    const years = [];
    for (let year = startRange; year < endRange; year++) {
      years.push(year);
    }

    return years;
  };

  const getSemesters = () => {
    const semesters = [];
    for (let semester = 1; semester <= 8; semester++) {
      semesters.push(semester);
    }
    return semesters;
  };

  const years = useRef(getYearsRange());

  const semesters = useRef(getSemesters());

  const addNew = () => {
    setModalDisplayName(undefined);
    setYear(currentYear);
    setSemester(1);
    if (labName.current && labDesc.current) {
      labName.current.value = "";
      labDesc.current.value = "";
    }

    selectedLab.current = {
      lab_name: "",
      lab_description: "",
      lab_year: currentYear,
      lab_semester: 1,
    };
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

  return (
    <ModuleWrapper>
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-row items-center justify-between">
          <div className="light:text-black text-2xl dark:text-white">
            Εργαστήρια
          </div>
          <Button size={"md"} onClick={addNew}>
            <IoMdAdd className="mr-2" />
            Προσθήκη
          </Button>
        </div>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Όνομα Εργαστηρίου</Table.HeadCell>
            <Table.HeadCell>Ακαδημαϊκό έτος</Table.HeadCell>
            <Table.HeadCell>Εξάμηνο</Table.HeadCell>
            <Table.HeadCell className=" w-3">
              <span className="sr-only">Delete</span>
            </Table.HeadCell>
            <Table.HeadCell className=" w-3">
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {labs.map((lab) => (
              <Table.Row
                key={lab.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {lab.lab_name}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {lab.lab_year}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {lab.lab_semester}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    pill
                    size={"xs"}
                    color="failure"
                    onClick={() =>
                      typeof lab.id === "number" && sendDelete(lab.id)
                    }
                  >
                    <MdDelete />
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button pill size={"xs"} onClick={() => onEdit(lab)}>
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
          {modalMode === ModalMode.update ? modalDisplayName : "Νέο Εργαστήριο"}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label value="Όνομα Εργαστηρίου" />
              </div>
              <TextInput
                ref={labName}
                color={isValid ? undefined : "failure"}
                helperText={
                  isValid ? undefined : (
                    <>
                      <span className="font-medium"></span>Το όνομα εργαστηρίου
                      είναι υποχρεωτικό.
                    </>
                  )
                }
                defaultValue={selectedLab.current.lab_name}
                onChange={(e) => {
                  selectedLab.current.lab_name = e.target.value;
                  if (!isValid && e.target.value.length > 0) {
                    setIsValid(true);
                    setTimeout(() => {
                      e.target.focus();
                    });
                  }
                }}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Lab Description" />
              </div>
              <Textarea
                ref={labDesc}
                defaultValue={selectedLab.current.lab_description}
                onChange={(e) =>
                  (selectedLab.current.lab_description = e.target.value)
                }
                placeholder="Περιγραφή εργαστηρίου..."
                required
                rows={4}
                style={{ resize: "none" }}
              />
            </div>
            <div className="flex flex-row gap-2">
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Ακαδημαϊκό έτος" />
                </div>
                <Select
                  value={year}
                  onChange={(e) => {
                    setYear(parseInt(e.target.value));
                  }}
                  required
                >
                  {years.current.map((year) => (
                    <option key={year}>{year}</option>
                  ))}
                </Select>
              </div>
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label value="Εξάμηνο" />
                </div>
                <Select
                  value={semester}
                  onChange={(e) => setSemester(parseInt(e.target.value))}
                  required
                >
                  {semesters.current.map((semester) => (
                    <option key={semester}>{semester}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button color="gray" onClick={closeModal}>
            Άκυρο
          </Button>
          <Button
            isProcessing={isProcessing}
            onClick={modalMode === ModalMode.update ? sendEdit : sendNew}
          >
            Αποθήκευση
          </Button>
        </Modal.Footer>
      </Modal>
    </ModuleWrapper>
  );
};

export default Labs;
